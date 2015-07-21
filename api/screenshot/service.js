var BaselineService = require('../baseline/service'),
    DiffService = require('../diff/service'),
    ImageService = require('../image/service'),
    config = require('config');

module.exports = {

    saveAndCompare: function (name, imageData, callback) {
        BaselineService.findOne(name, '', function (err, result) {

            if (result) {
                ImageService.compareImages(result.data, imageData, function (resultJson, diffImage) {
                    var acceptableThreshold = resultJson.misMatchPercentage < config.comparison.threshold;
                    if (!acceptableThreshold) {
                        DiffService.save({
                            name: name,
                            data: diffImage
                        }, function (err, result) {
                            callback({
                                passes: acceptableThreshold,
                                difference: resultJson.misMatchPercentage,
                                isSameDimensions: resultJson.isSameDimensions,
                                diffUrl: config.app.apiPath + '/diff/' + name + '/' + result._id + '/raw'
                            });
                        });
                    } else {
                        callback({
                            passes: acceptableThreshold,
                            difference: resultJson.misMatchPercentage,
                            isSameDimensions: resultJson.isSameDimensions
                        });
                    }

                });
            } else {
                BaselineService.save({
                    name: name,
                    data: imageData
                }, function (err) {
                    var noError = (err === null);
                    callback({
                        passes: noError,
                        result: (noError ? "Created a new baseline" : "Failed to save new baseline")
                    });
                });
            }
        });

    },

};
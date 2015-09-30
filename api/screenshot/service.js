var BaselineService = require('../baseline/service'),
    CandidateService = require('../candidate/service'),
    DiffService = require('../diff/service'),
    ImageService = require('../image/service'),
    config = require('config'),
    async = require('async');

function saveComparisons(name, diffImage, submittedImage, callback) {

    async.waterfall([
        function saveCandidate(candidateCallback) {
            CandidateService.save({
                name: name,
                data: submittedImage
            }, function (err, result) {
                candidateCallback(err, result);
            });
        },
        function saveDiff(result, diffCallback) {
            DiffService.save({
                name: name,
                data: diffImage,
                candidate: result._id
            }, function (err, diffResult) {
                diffCallback(err, diffResult);
            });
        }
    ], function (err, diffResult) {
        console.log('inside saveComp cb', err, Object.keys(diffResult));
        callback(err, diffResult);
    });

}

function clearCandidatesAndDiffs(name, callback) {
    async.parallel({
        candidateError: function clearCandidates(candidateCallback) {
            CandidateService.remove({
                name: name
            }, function (err) {
                candidateCallback(null, err);
            });
        },
        diffError: function saveDiff(diffCallback) {
            DiffService.remove({
                name: name
            }, function (err) {
                diffCallback(null, err);
            });
        }
    },
        function (err, results) {
            var statusCode = 201;
            if (results.candidateError || results.diffError) {
                statusCode = 500;
            }
            callback(statusCode, {});
        });
}

module.exports = {

    saveAndCompare: function (name, imageData, callback) {
        BaselineService.findOne(name, '', function (err, result) {

            if (result) {
                ImageService.compareImages(result.data, imageData, function (resultJson, diffImage) {
                    var acceptable = (resultJson.misMatchPercentage < config.comparison.threshold) && resultJson.isSameDimensions;
                    if (!acceptable) {
                        saveComparisons(name, diffImage, imageData, function (err, diffResult) {
                            callback({
                                passes: acceptable,
                                difference: resultJson.misMatchPercentage,
                                isSameDimensions: resultJson.isSameDimensions,
                                diffUrl: config.app.apiPath + '/diff/' + name + '/' + diffResult._id + '/raw'
                            });
                        });
                    } else {
                        callback({
                            passes: true
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
    promoteCandidateToBaseline: function (name, candidateId, callback) {

        CandidateService.findOne(name, candidateId, function (err, result) {
            if (!result) {
                return callback(404, {});
            } else {
                delete result._id;
                BaselineService.save(result, function (err) {
                    if (err) {
                        return callback(500, {});
                    } else {
                        clearCandidatesAndDiffs(name, callback);
                    }
                });
            }
        });

    },
    deleteSnapshot: function (diffId, callback) {
        callback(204, {});
    }

};
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
                candidateCallback(err, result, err);
            });
        },
        function saveDiff(result, err, diffCallback) {
            DiffService.save({
                name: name,
                data: diffImage,
                candidate: result._id
            }, diffCallback);
        }
    ], callback);

};

function clearCandidatesAndDiffs(name, callback) {
    async.parallel({
            candidateError: function clearCandidates(candidateCallback) {
                CandidateService.remove({
                    name: name
                }, function (err, result) {
                    candidateCallback(null, err);
                });
            },
            diffError: function saveDiff(diffCallback) {
                DiffService.remove({
                    name: name
                }, function (err, result) {
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
};

module.exports = {

    saveAndCompare: function (name, imageData, callback) {
        BaselineService.findOne(name, '', function (err, result) {

            if (result) {
                ImageService.compareImages(result.data, imageData, function (resultJson, diffImage) {
                    var acceptableThreshold = resultJson.misMatchPercentage < config.comparison.threshold;
                    if (!acceptableThreshold) {
                        saveComparisons(name, diffImage, imageData, function (err, diffResult) {
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
    promoteCandidateToBaseline: function (name, candidateId, callback) {

        CandidateService.findOne(name, candidateId, function (err, result) {
            if (!result) {
                console.log('cant find candidate');
                return callback(404, {});
            } else {
                delete result._id;
                BaselineService.save(result, function (err, baselineResult) {
                    if (err) {
                        return callback(500, {});
                    } else {
                        clearCandidatesAndDiffs(name, callback);
                    }
                });
            }
        })

    }

};

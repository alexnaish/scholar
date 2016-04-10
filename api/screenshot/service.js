var BaselineService = require('../baseline/service'),
    CandidateService = require('../candidate/service'),
    DiffService = require('../diff/service'),
    ImageService = require('../image/service'),
    config = require('config'),
    async = require('async');

function saveComparisons(name, diffImage, submittedImageData, callback) {

    async.waterfall([
        function saveCandidate(candidateCallback) {
            CandidateService.save({
                name: name,
                data: submittedImageData.imageData,
                meta: submittedImageData.meta
            }, function (err, result) {
                candidateCallback(err, result);
            });
        },
        function saveDiff(result, diffCallback) {
            DiffService.save({
                name: name,
                data: diffImage,
                meta: submittedImageData.meta,
                candidate: result._id
            }, function (err, diffResult) {
                diffCallback(err, diffResult);
            });
        }
    ], function (err, diffResult) {
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

function deleteComparison(diffId, candidateId, callback) {

    async.parallel({
        diffError: function deleteDiff(diffCallback) {
            DiffService.remove({
                _id: diffId,
            }, function (err) {
                diffCallback(null, err);
            });
        },
        candidateError: function deleteCandidate(candidateCallback) {
            CandidateService.remove({
                _id: candidateId
            }, function (err) {
                candidateCallback(null, err);
            });
        }
    }, function (err, results) {
         var statusCode = 200;
            if (results.candidateError || results.diffError) {
                statusCode = 500;
            }
            callback(statusCode, {});
    });

}

module.exports = {

    saveAndCompare: function (name, data, callback) {
        BaselineService.findOne(name, '', function (err, result) {

            if (result) {
                ImageService.compareImages(result.data, data.imageData, function (resultJson, diffImage) {
                    var acceptable = (resultJson.misMatchPercentage < config.comparison.threshold) && resultJson.isSameDimensions;
                    if (!acceptable) {
                        saveComparisons(name, diffImage, data, function (err, diffResult) {
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
                    data: data.imageData,
                    meta: data.meta
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
        CandidateService.findOne(candidateId, {}, function (err, result) {
            if (!result) {
                return callback(404, {});
            } else {
                delete result._id;
                BaselineService.save(result, function (err, insertedDoc) {
                    if (err) {
                        return callback(500, {error: err.message});
                    } else {
                        clearCandidatesAndDiffs(name, callback);
                    }
                });
            }
        });

    },
    deleteSnapshot: function (diffId, callback) {
        DiffService.findOne(diffId, function (err, result) {
            if(result){
                deleteComparison(diffId, result.candidate, callback);
            } else {
                callback(404, {});
            }
        });
    },
    extractMetadata: function(headersObject) {
        headersObject = headersObject || {};
        var metaObject = {};
        var headerMap = {
          'x-scholar-meta-browser': 'browser',
          'x-scholar-meta-resolution': 'resolution'
        };

        for (var key in headerMap) {
          metaObject[headerMap[key]] = headersObject[key];
        }
        return metaObject;
    }
};

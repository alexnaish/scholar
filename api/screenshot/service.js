var BaselineService = require('../baseline/service'),
	CandidateService = require('../candidate/service'),
	DiffService = require('../diff/service'),
	ImageService = require('../image/service'),
	config = require('config'),
	async = require('async');

function saveComparisons(baseline, diffImage, submittedImageData, callback) {

	async.waterfall([
		function saveCandidate(candidateCallback) {
			CandidateService.save({
				name: baseline.name,
				data: submittedImageData.imageData,
				meta: submittedImageData.meta
			}, function (err, result) {
				candidateCallback(err, result);
			});
		},
		function saveDiff(result, diffCallback) {
			DiffService.save({
				name: baseline.name,
				data: diffImage,
				meta: submittedImageData.meta,
				baseline: baseline._id,
				candidate: result._id
			}, function (err, diffResult) {
				diffCallback(err, diffResult);
			});
		}
	], function (err, diffResult) {
		callback(err, diffResult);
	});

}

function clearCandidatesAndDiffs(query, callback) {
	async.parallel({
			candidate: function clearCandidates(candidateCallback) {
				CandidateService.remove(query, candidateCallback);
			},
			diff: function clearDiffs(diffCallback) {
				DiffService.remove(query, function (err) {
					diffCallback(err);
				});
			}
		},
		callback);
}

function deleteComparison(diffId, candidateId, callback) {

	async.parallel({
		diffError: function deleteDiff(diffCallback) {
			DiffService.remove({
				_id: diffId
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
		BaselineService.findOne({
			name: name,
			'meta.browser': data.meta.browser
		}, '', function (err, result) {

			if (result) {
				ImageService.compareImages(result.data, data.imageData, function (resultJson, diffImage) {
					var acceptable = (resultJson.misMatchPercentage < config.comparison.threshold) && resultJson.isSameDimensions;
					if (!acceptable) {
						saveComparisons(result, diffImage, data, function (err, diffResult) {
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
	promoteCandidateToBaseline: function (result, user, callback) {
		delete result._id;
		result.meta.lastUpdated = new Date();
		result.meta.lastUpdatedBy = `${user.firstName} ${user.lastName}`;
		BaselineService.save(result, function (err, insertedDoc) {
			if (err) {
				return callback(err);
			}

			clearCandidatesAndDiffs({name: result.name, 'meta.browser': result.meta.browser}, callback);
		});
	},
	deleteSnapshot: function (diffId, callback) {
		DiffService.findOne(diffId, function (err, result) {
			if (result) {
				deleteComparison(diffId, result.candidate, callback);
			} else {
				callback(404, {});
			}
		});
	},

	removeAllScreenshots: function(baselineRecord, callback) {
		clearCandidatesAndDiffs({name: baselineRecord.name, 'meta.browser': baselineRecord.meta.browser}, function(err){
			if(err) {
				return callback(err);
			}

			BaselineService.remove({
				_id: baselineRecord._id
			}, callback);
		});
	},


	extractMetadata: function (headersObject) {
		headersObject = headersObject || {};
		var metaObject = {};
		var headerMap = {
			'x-scholar-meta-browser': {
				name: 'browser',
				transform: null
			},
			'x-scholar-meta-resolution': {
				name: 'resolution',
				transform: null
			},
			'x-scholar-meta-labels': {
				name: 'labels',
				transform: function (value) {
					return value.split(', ')
				}
			}
		};

		for (var key in headerMap) {
			if (headersObject[key]) {
				var header = headerMap[key];
				metaObject[header.name] = (header.transform ? header.transform(headersObject[key]) : headersObject[key]);
			}

		}
		return metaObject;
	}
};

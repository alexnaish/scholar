var ScreenshotService = require('./service');
var CandidateService = require('../candidate/service');

module.exports = {

    submitNewScreenshot: function (req, res) {
        var meta = ScreenshotService.extractMetadata(req.headers);
        req.body.meta = meta;
        ScreenshotService.saveAndCompare(req.params.name, req.body, function (data) {
            res.status(200).json(data);
        });
    },

    promoteScreenshot: function (req, res, next) {

        CandidateService.findOne(req.params.candidateId, {}, function (err, result) {
            if (err) {
				console.error(`PromoteScreenshot: failed to fetch Candidate ${req.params.candidateId}`);
				return next(err);
			}
            if (!result) {
                return res.status(404).json({
					error: 'Candidate not found'
				})
            }

            ScreenshotService.promoteCandidateToBaseline(result, req.user, function (errorCode, data) {
                res.status(errorCode).json(data);
            });

        });
    },

    deleteScreenshot: function (req, res) {
        ScreenshotService.deleteSnapshot(req.params.diffId, function (statusCode, data) {
            res.status(statusCode).json(data);
        });
    }

};

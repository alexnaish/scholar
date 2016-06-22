var ScreenshotService = require('./service');
var CandidateService = require('../candidate/service');
var BaselineService = require('../baseline/service');

module.exports = {

    submitNewScreenshot: function (req, res) {
        var meta = ScreenshotService.extractMetadata(req.headers);
        req.body.meta = meta;
        ScreenshotService.saveAndCompare(req.params.name, req.body, function (data) {
            res.status(200).json(data);
        });
    },

    deleteScreenshot: function (req, res, next) {

        BaselineService.findOne({_id: req.params.id, name: req.params.name}, '', (err, baseline) => {
            if(err){
                console.error('BaselineService.findOne failed in deleteScreenshot');
                return next(err);
            }

            if(!baseline) {
                return res.status(404).json({
                    error: 'Baseline not found'
                });
            }

            ScreenshotService.removeAllScreenshots(baseline, function (err) {
                if(err) {
                    console.error('ScreenshotService.removeAllScreenshots failed in deleteScreenshot');
                    return next(err);
                }
                res.status(200).json({});
            });

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

            ScreenshotService.promoteCandidateToBaseline(result, req.user, function (err, data) {
                if (err) {
                    console.error(`PromoteScreenshot: failed to promote`);
                    return next(err);
                }
                res.status(201).json(data);
            });

        });
    },

    deleteDiff: function (req, res) {
        ScreenshotService.deleteSnapshot(req.params.diffId, function (statusCode, data) {
            res.status(statusCode).json(data);
        });
    }

};

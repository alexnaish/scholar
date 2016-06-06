var CandidateService = require('./service');
var ImageService = require('../image/service');

module.exports = {
	renderRawImage: function (req, res, next) {
		CandidateService.findOne(req.params.id, 'data', function (err, result) {

            if(err) {
                console.error(`CandidateService.renderRawImage failed`)
                return next(err);
            }

			if (!result) {
				return res.status(404).send();
			}

			return ImageService.generateImage(res, result.data);
		});
	},
	findOutStanding: function (req, res, next) {
		CandidateService.findDistinct(function (err, results) {
			if (err) {
				console.error(`CandidateService.findOutStanding failed`);
				next(err);
			} else {
				res.status(200).json(results);
			}
		});
	}

};

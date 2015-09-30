var CandidateService = require('./service'),
    ImageService = require('../image/service');

module.exports = {
    renderRawImage: function (req, res) {
        CandidateService.findOne(req.params.id, 'data', function (err, result) {
            if (!result) {
                res.status(404).send();
            } else {
                ImageService.generateImage(res, result.data);
            }
        });
    }

};

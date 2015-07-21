var CandidateService = require('./service'),
    ImageService = require('../image/service');

module.exports = {

    find: function (req, res) {
        CandidateService.find({
            name: req.params.name
        }, 'name dateCreated', function (err, data) {
            res.status(200).json(data);
        });
    },
    findOne: function (req, res) {
        CandidateService.findOne({
            _id: req.params.id,
            name: req.params.name
        }, function (err, data) {
            res.status(200).json(data);
        });
    },

    renderRawImage: function (req, res) {
        CandidateService.findOne({
            _id: req.params.id,
            name: req.params.name
        }, '', function (err, result) {
            ImageService.generateImage(res, result.data);
        });
    }

};
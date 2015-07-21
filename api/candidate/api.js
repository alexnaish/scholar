var service = require('./service'),
    ImageService = require('../image/service');

module.exports = {

    find: function (req, res) {
        service.find({
            name: req.params.name
        }, 'name dateCreated', function (err, data) {
            res.status(200).json(data);
        });
    },
    findOne: function (req, res) {
        service.findOne({
            _id: req.params.id,
            name: req.params.name
        }, function (err, data) {
            res.status(200).json(data);
        });
    },

    renderRawImage: function (req, res) {
        service.findOne({
            _id: req.params.id,
            name: req.params.name
        }, '', function (err, result) {
            ImageService.generateImage(res, result.data);
        });
    }

};
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
        }, 'name dateCreated', function (err, result) {
            if (!result) {
                res.status(404).send();
            } else {
                result.raw = config.app.apiPath + '/diff/' + result.name + '/raw';
                res.status(200).json(result);
            }

        });
    },

    renderRawImage: function (req, res) {
        service.findOne({
            _id: req.params.id,
            name: req.params.name
        }, '', function (err, result) {
            if (!result) {
                res.status(404).send();
            } else {
                ImageService.generateImage(res, result.data);
            }
        });
    }

};
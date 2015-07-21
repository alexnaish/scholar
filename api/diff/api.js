var DiffService = require('./service'),
    config = require('config'),
    ImageService = require('../image/service');

module.exports = {

    find: function (req, res) {
        DiffService.find(req.params.name, function (err, data) {
            res.status(200).json(data);
        });
    },
    findOne: function (req, res) {
        DiffService.findOne(req.params.name, req.params.id, 'name dateCreated', function (errorCode, result) {
            res.status(errorCode).json(result);
        });
    },

    renderRawImage: function (req, res) {
        DiffService.findOne(req.params.name, req.params.id, 'data', function (err, result) {
            if (!result) {
                res.status(404).send();
            } else {
                ImageService.generateImage(res, result.data);
            }
        });
    }

};
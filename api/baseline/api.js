var service = require('./service'),
    config = require('config'),
    ImageService = require('../image/service');

module.exports = {

    find: function (req, res) {
        service.find(function (errorCode, result) {
            res.status(errorCode).json(result);
        });
    },
    findOne: function (req, res) {
        service.findOne(req.params.name, 'name dateCreated', function (errorCode, result) {
            res.status(errorCode).json(result);
        });
    },

    renderRawImage: function (req, res) {
        service.findOne(req.params.name, 'data', function (err, result) {
            if (!result) {
                res.status(404).send();
            } else {
                ImageService.generateImage(res, result.data);
            }
        });
    }

};
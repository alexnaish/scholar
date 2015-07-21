var BaselineService = require('./service'),
    config = require('config'),
    ImageService = require('../image/service');

module.exports = {

    find: function (req, res) {
        BaselineService.find(function (errorCode, result) {
            res.status(errorCode).json(result);
        });
    },
    findOne: function (req, res) {
        BaselineService.findOne(req.params.name, 'name dateCreated', function (errorCode, result) {
            res.status(errorCode).json(result);
        });
    },

    renderRawImage: function (req, res) {
        BaselineService.findOne(req.params.name, 'data', function (err, result) {
            if (!result) {
                res.status(404).send();
            } else {
                ImageService.generateImage(res, result.data);
            }
        });
    }

};
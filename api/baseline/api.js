var service = require('./service'),
    config = require('config'),
    ImageService = require('../image/service');

module.exports = {
    findOne: function (req, res) {
        service.findOne({
            name: req.params.name
        }, 'name dateCreated', function (err, result) {
            if (!result) {
                res.status(404).send();
            } else {
                result.raw = config.app.apiPath + '/baseline/' + result.name + '/raw';
                res.status(200).json(result);
            }
        });
    },

    renderRawImage: function (req, res) {
        service.findOne({
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
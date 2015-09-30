var DiffService = require('./service'),
    ImageService = require('../image/service');

module.exports = {

    find: function (req, res) {
        DiffService.find(req.params.name, function (err, data) {
            res.status(200).json(data);
        });
    },
    renderRawImage: function (req, res) {
        DiffService.findOne(req.params.id, 'data', function (err, result) {
            if (!result) {
                res.status(404).send();
            } else {
                ImageService.generateImage(res, result.data);
            }
        });
    }

};
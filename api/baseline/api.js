var BaselineService = require('./service'),
    ImageService = require('../image/service');

module.exports = {

    list: function (req, res, next) {
        BaselineService.list(function (err, results) {
            if(err) {
                return next(err);
            }

            res.status(200).json(results);
        });
    },
    find: function (req, res, next) {
        BaselineService.find({ name: req.params.name }, 'name meta dateCreated', function (err, result) {
            if(err) {
                return next(err);
            }
            res.status(200).json(result);
        });
    },

    renderRawImage: function (req, res) {
        BaselineService.findOne({ _id: req.params.id }, 'data', function (err, result) {
            if (!result) {
                res.status(404).send();
            } else {
                ImageService.generateImage(res, result.data);
            }
        });
    }

};
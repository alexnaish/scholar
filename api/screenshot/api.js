var service = require('./service');

module.exports = {

    submitNewScreenshot: function (req, res) {
        service.saveAndCompare(req.params.name, req.body.imageData, function (data) {
            res.status(200).json(data);
        });
    }

};
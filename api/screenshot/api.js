var service = require('./service');

module.exports = {

    submitNewScreenshot: function (req, res) {
        service.saveAndCompare(req.params.name, req.body.imageData, function (data) {
            res.status(200).json(data);
        });
    },

    deleteScreenshot: function (req, res) {
        service.deleteSnapshot(req.params.diffId, function (statusCode, data) {
            res.status(statusCode).json(data);
        });
    },

    promoteScreenshot: function (req, res) {
        service.promoteCandidateToBaseline(req.params.name, req.params.candidateId, function (errorCode, data) {
            res.status(errorCode).json(data);
        });
    }

};

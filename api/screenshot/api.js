var service = require('./service');

module.exports = {

    submitNewScreenshot: function (req, res) {
        var meta = service.extractMetadata(req.headers);
        req.body.meta = meta;
        service.saveAndCompare(req.params.name, req.body, function (data) {
            res.status(200).json(data);
        });
    },

    promoteScreenshot: function (req, res) {
        service.promoteCandidateToBaseline(req.params.name, req.params.candidateId, function (errorCode, data) {
            res.status(errorCode).json(data);
        });
    },

    deleteScreenshot: function (req, res) {
        service.deleteSnapshot(req.params.diffId, function (statusCode, data) {
            res.status(statusCode).json(data);
        });
    }

};

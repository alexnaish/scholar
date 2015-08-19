var CandidateModel = require('./model');

module.exports = {

    findOne: function (name, id, fields, callback) {
        var errorCode = 200;
        CandidateModel.findOne({
            _id: id,
            name: name
        }, fields, {
            lean: true
        }, function (err, result) {
            if (!result) {
                errorCode = 404;
            }
            callback(errorCode, result);
        });
    },
    save: function (payload, callback) {
        new CandidateModel(payload).save(callback);
    },
    remove: function (query, callback) {
        CandidateModel.remove(query, callback);
    }

};

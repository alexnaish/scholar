var CandidateModel = require('./model');

module.exports = {

    find: function (query, fields, callback) {
        CandidateModel.find(query, fields, callback);
    },
    findOne: function (query, fields, callback) {
        CandidateModel.findOne(query, fields, callback);
    },
    save: function (payload, callback) {
        new CandidateModel(payload).save(callback);
    },
    remove: function (query, callback) {
        CandidateModel.remove(query, callback);
    }

};
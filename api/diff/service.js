var DiffModel = require('./model');

module.exports = {

    find: function (query, fields, callback) {
        DiffModel.find(query, fields, callback);
    },
    findOne: function (query, fields, callback) {
        DiffModel.findOne(query, fields, function (err, result) {
            if (result) {
                result = result.toObject();
            }
            callback(err, result);
        });
    },
    save: function (payload, callback) {
        new DiffModel(payload).save(callback);
    },
    remove: function (query, callback) {
        DiffModel.remove(query, callback);
    }

};
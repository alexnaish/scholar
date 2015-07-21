var BaselineModel = require('./model');

module.exports = {

    findOne: function (query, fields, callback) {
        BaselineModel.findOne(query, fields, function (err, result) {
            if (result) {
                result = result.toObject();
            }
            callback(err, result);
        });
    },
    save: function (payload, callback) {
        BaselineModel.remove({
            name: payload.name
        }, function () {
            new BaselineModel(payload).save(callback);
        });
    }

};
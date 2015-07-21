var BaselineModel = require('./model'),
    config = require('config');

function addRawUrl(result) {
    result.raw = config.app.apiPath + '/baseline/' + result.name + '/raw';
}

module.exports = {

    find: function (callback) {
        var errorCode = 200;
        BaselineModel.find({}, 'name dateCreated', {
            lean: true
        }, function (err, results) {
            if (err) {
                errorCode = 500;
            } else {
                for (var i = 0; i < results.length; i++) {
                    addRawUrl(results[i]);
                }
            }
            callback(errorCode, results);
        });

    },
    findOne: function (name, fields, callback) {

        var errorCode = 200;

        BaselineModel.findOne({
            name: name
        }, fields, {
            lean: true
        }, function (err, result) {
            if (!result) {
                errorCode = 404;
            } else {
                addRawUrl(result);
            }
            callback(errorCode, result);
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
var BaselineModel = require('./model'),
    config = require('config');

function addRawUrl(result) {
    result.raw = config.app.apiPath + '/baseline/' + result.name + '/raw';
}

module.exports = {

    find: function (callback) {
        var errorCode = 200;
        BaselineModel.find({}, 'name meta dateCreated', {
            lean: true,
            sort: {
                dateCreated: -1
            }
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
        var statusCode = 200;
        BaselineModel.findOne({
            name: name
        }, fields, {
            lean: true
        }, function (err, result) {
            if (!result) {
                statusCode = 404;
            } else {
                addRawUrl(result);
            }
            callback(statusCode, result);
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

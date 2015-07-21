var DiffModel = require('./model'),
    config = require('config');

function addRawUrl(result) {
    result.raw = config.app.apiPath + '/diff/' + result.name + '/' + result._id + '/raw';
}

module.exports = {

    find: function (name, callback) {
        var errorCode = 200;
        DiffModel.find({
            name: name
        }, 'name dateCreated', {
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
    findOne: function (name, id, fields, callback) {
        var errorCode = 200;
        DiffModel.findOne({
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
        new DiffModel(payload).save(callback);
    },
    remove: function (query, callback) {
        DiffModel.remove(query, callback);
    }

};
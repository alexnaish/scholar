var DiffModel = require('./model'),
    config = require('config');

function _modify(result) {
    result.raw = config.app.apiPath + '/diff/' + result.name + '/' + result._id + '/raw';
}

module.exports = {

    find: function (name, callback) {
        var errorCode = 200;
        DiffModel.find({
            name: name
        },
        'name dateCreated candidate',
        {
            lean: true,
            sort: {
                dateCreated: -1
            }
        }, function (err, results) {
            if (err) {
                errorCode = 500;
            } else {
                for (var i = 0; i < results.length; i++) {
                    _modify(results[i]);
                }
            }
            callback(errorCode, results);
        });

    },
    findOne: function (name, id, fields, callback) {
        var errorCode = 200;
        DiffModel.findOne({
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
        new DiffModel(payload).save(function(err, result){
            callback(err, result.toObject());
        });
    },
    remove: function (query, callback) {
        DiffModel.remove(query, callback);
    }

};

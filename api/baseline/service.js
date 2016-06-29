'use strict';
const BaselineModel = require('./model');
const config = require('config');
const _ = require('lodash');

function addRawUrl(result) {
    result.raw = config.app.apiPath + '/baseline/' + result._id + '/raw';
}

module.exports = {

    list: function (callback) {

        BaselineModel.aggregate(
            [
                {$sort: {'meta.lastUpdated': -1}},
                {
                    $group: {
                        _id: '$name',
                        dateCreated: {$first: '$dateCreated'},
                        lastUpdatedBy: {$first: '$meta.lastUpdatedBy'},
                        lastUpdated: {$first: '$meta.lastUpdated'},
                        labels: {$push: '$meta.labels'},
                        results: {
                            $push: {
                                _id: '$_id',
                                browser: '$meta.browser',
                                resolution: '$meta.resolution'
                            }
                        }
                    }
                }
            ],
            function (err, results) {
                if (err) {
                    return callback(err);
                }
                results.map(function(result){
                    result.labels = _.uniq(_.flatten(result.labels));
                    return result;
                });

                callback(err, results);
            });

    },
    find: function (query, fields, callback) {
        BaselineModel.find(query, fields, {
            lean: true
        }, callback);
    },
    findOne: function (query, fields, callback) {
        BaselineModel.findOne(query, fields, {
            lean: true
        }, function (err, result) {
            if (result) {
                addRawUrl(result);
            }
            callback(err, result);
        });
    },
    save: function (payload, callback) {
        BaselineModel.remove({
            name: payload.name,
            'meta.browser': payload.meta.browser
        }, function () {
            new BaselineModel(payload).save(callback);
        });
    },

    remove: function (query, callback) {
        BaselineModel.remove(query, callback)
    }

};

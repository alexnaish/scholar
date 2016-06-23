var BaselineModel = require('./model'),
    config = require('config');

function addRawUrl(result) {
    result.raw = config.app.apiPath + '/baseline/' + result._id + '/raw';
}

module.exports = {

    list: function (callback) {

        BaselineModel.aggregate(
            [
                { $sort : { 'meta.lastUpdated' : -1 } },
                {
                    $group: {
                        _id: '$name',
                        dateCreated: {$first: '$dateCreated'},
                        lastUpdatedBy: {$first: '$meta.lastUpdatedBy'},
                        lastUpdated: {$first: '$meta.lastUpdated'},
                        results: {
                            $push: {
                                _id: '$_id',
                                browser: '$meta.browser',
                                labels: '$meta.labels',
                                resolution: '$meta.resolution'
                            }
                        }
                    }
                }
            ],
            callback);

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

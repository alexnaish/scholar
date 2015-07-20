var ScreenshotModel = require('./model');

module.exports = {

    find: function (query, callback) {
        ScreenshotModel.find(query, callback);
    },
    findOne: function (query, callback) {

        ScreenshotModel.findOne(query, function (err, result) {
            if (result) {
                result = result.toObject();
            }
            callback(err, result);
        });

    }


};
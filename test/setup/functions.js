var async = require('async'),
    config = require('config');

module.exports = {

    insertAssets: function (model, dataArray, finalCallback) {
        //Sort variables
        var asyncTasks = [];
        if (dataArray.constructor !== Array) {
            dataArray = [dataArray];
        }

        //Calculate function calls required
        dataArray.forEach(function (item) {
            asyncTasks.push(function (callback) {
                new model(item).save(callback);
            });
        });

        //Perform the async.parallel call
        async.parallel(asyncTasks, function () {
            finalCallback();
        });


    },

    removeAssets: function (model, query, finalCallback) {
        model.remove(query, function () {
            finalCallback();
        });
    }

};

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
                new model(item).save(function(err, result){
                    callback(err, result);
                });
            });
        });

        //Perform the async.parallel call
        async.parallel(asyncTasks, function (err, results) {
            if(err) {
              console.error('Insert Assets Error!', err);
              throw err;
            }
            finalCallback(results);
        });


    },

    removeAssets: function (model, query, finalCallback) {
        model.remove(query, function (err, resp) {
            finalCallback(resp.result.n);
        });
    }

};

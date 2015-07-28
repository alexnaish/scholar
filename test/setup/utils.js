'use strict';
var config = require('config'),
    mongoose = require('mongoose');

before(function (done) {

    function clearDB() {
        for (var i in mongoose.connection.collections) {
            mongoose.connection.collections[i].remove();
        }
        done();
    };

    function reconnect() {
        mongoose.connect("mongodb://" + config.mongo.user + ":" + config.mongo.pass + "@" + config.mongo.host + "/" + config.mongo.db, function (err) {
            if (err) {
                throw err;
            }
            return clearDB();
        });
    };

    function checkState() {
        switch (mongoose.connection.readyState) {
        case 0:
            reconnect();
            break;
        case 1:
            clearDB();
            break;
        default:
            setTimeout(checkState, 20);
        }
    };

    checkState();
});

after(function (done) {
    mongoose.disconnect();
    done();
});

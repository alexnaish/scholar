var ScreenshotModel = require('./model'),
    async = require('async'),
    resemble = require('../lib/resemble.js');


var image = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABIUlEQVR42u3YPQ6CQBAFYI7gETyCR/AIHsGKFls6Q01tiy2dCRewosWWzoSWwooWM5sM2RALw4/sw7fJJmg1X2ZnlsFrV7I8QgghhBBC/hLSNK/2cjmYLc+QEAk8inat73tmx/EeE6KIINh0GDhInl+74KvqgQsJw60JPEmO5jckxM5GXT8xIZIBDVqzAQnRgKXANRvQkG//J4SQNUHsjjR0OwHRS+4X227dzhytIZmU9u0cRDNZlnfcYpdLcWx9OAHR964xs4gTEK2PLDtjQ6aoj8UhOlD1OxAERDKggafp6eOdADez67EqihsuxJ4Sob9r9Wd2WEh/ZoeEyIe5KY/VYhC5xadqu4tCtAXLPQINmWMRQgghhBBCCCGEEDLfegN6BJlsjQsKMgAAAABJRU5ErkJggg==';
var image2 = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACsUlEQVR42u2ZPW4CMRCF9wg5Qo6QI+QIOUIqWtLSRdQUqWhJSxeJlpqWHCESLUUqWqJBeugxGe+OvTZGaC1ZiGV3Pd/82zTHOxnNADKADCADyH2ALBavp+kdm83ncTJ5PI5GzcWMeUcREAjSNkRILbg1BbI6yOHwa/4u1y3t7/c/53vYQtPpU/BdRUHG44eTAKvVu/n7bPZ8+l3uCw2BYquVhAmCCAAEtRaHcLvdd+cicg8UUwomCCKLYXHRvg5sTwyFYEJWLpZ+efHt9utfgMdmpC4rF60jAoPFxecBge8xg62c28WaGE0yROooFS9uJ8fiVoDD3ebzF5dgJeLFDSLaCwU4W8ur5ZR4kfskVpfLt3P6x3SD8EN6YXY5LwzHS5dVQu1PbxAtKLtcDIxlFfkUFw0JLO8Vi4hl+P3RIFZtYUvF+D9bpWvq9icpRjgFs6AIei14jP9z7LGyPB1DNIiYkgsgspRctwT3+j93CDyLZS0EGqq7fMp3uR4KXI9V8F4oqDiItYC+xoJ7shJvA+D7VUE42+jY0XBd24AqIHALTrM6dljrbcmjKghnL/g5xw7grCKqk0dVEAvGSsWwHNcdnTyqg1jxorMV3AjPw2rikqHgrwbC8SIZSFuFQXVC0IUxdYuQBUS3JdoqeB49lE7HXBhjK3pWEJ1q1+uPi+ZRN30aAvf2OczLBuJtAKFxuZ8hU7bOvHY2EOscyzu7OlvPXiUrSCxQSpcb2mwVAcFAqs15DmztFkVpxUA4BvQpTMrpSQgALlkMBK6FTNS15+4bU0VAuHpD81zhcwIUA2mr3toq3nOwq9YRKy66ugDrgPwmCmJMv8SuluPvuSwgGsJbG9jVqoOkQjBMn0PxLCB9Ia76/0gbyK1A9ALJsYeoBoKcn2sPcXWQUHvRZw+Re/wBsfKQkB7c4vQAAAAASUVORK5CYII=';


resemble.outputSettings({
    errorColor: {
        red: 155,
        green: 100,
        blue: 155
    },
    errorType: 'movement',
    transparency: 0.6
});

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

    },
    compare: function (callback) {
        resemble(new Buffer(image, 'base64')).compareTo(new Buffer(image2, 'base64'))
            //.ignoreAntialiasing()
            //.ignoreColors()
            .onComplete(function (data) {
                console.log('1', data);
                var chunks = [];
                var png = data.getDiffImage().pack();

                png.on('data', function (chunk) {
                    chunks.push(chunk);
                    console.log('chunk:', chunk.length);
                });
                png.on('end', function () {
                    var result = Buffer.concat(chunks);
                    callback(result.toString('base64'));
                });

            });
    }


};
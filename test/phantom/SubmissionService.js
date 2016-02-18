var scholarUrl = require('../../config/phantom-conf').scholarUrl;
var request = require('request');

module.exports = {

    submit: function (id, imageData, callback) {
        request.post(scholarUrl + '/api/screenshot/' + id, {
            form: {
                imageData: imageData
            }
        }, function (err, httpResponse, body) {
            try {
                callback(err, JSON.parse(body));
            } catch (e) {
                console.error('Error thrown!', err.code);
                callback(err, body);
            }
        });
    }

};

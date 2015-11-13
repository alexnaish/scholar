var config = require('../../config/phantom-conf');
var request = require('request');

module.exports = {

    submit: function (id, imageData, callback) {
        request.post(config.scholarUrl + '/api/screenshot/' + id, {
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
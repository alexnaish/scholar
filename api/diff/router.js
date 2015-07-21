var config = require('config'),
    api = require('./api');

module.exports = {

    apply: function (app) {

        var path = '/diff/:name';

        app.route(config.app.apiPath + path)
            .get(api.find);

        app.route(config.app.apiPath + path + '/:id')
            .get(api.findOne);

        app.route(config.app.apiPath + path + '/:id/raw')
            .get(api.renderRawImage);

    }

};
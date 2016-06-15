var config = require('config'),
    api = require('./api');

module.exports = {

    apply: function (app) {

        var path = '/baseline';

        app.route(config.app.apiPath + path)
            .get(api.list);

        app.route(config.app.apiPath + path + '/:name')
            .get(api.find);

        app.route(config.app.apiPath + path + '/:id/raw')
            .get(api.renderRawImage);

    }

};

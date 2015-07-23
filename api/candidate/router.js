var config = require('config'),
    api = require('./api');


module.exports = {

    apply: function (app) {

        var path = '/candidate/:name';

        app.route(config.app.apiPath + path + '/:id/raw')
            .get(api.renderRawImage);

    }

};

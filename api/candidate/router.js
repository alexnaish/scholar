var config = require('config'),
    api = require('./api');


module.exports = {

    apply: function (app) {

        app.route(config.app.apiPath + '/candidate/:name/:id/raw')
            .get(api.renderRawImage);

    }

};

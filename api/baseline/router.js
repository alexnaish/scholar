var config = require('config'),
    api = require('./api');


module.exports = {

    apply: function (app) {

        app.route(config.app.apiPath + '/baseline')
            .get(api.find);

        app.route(config.app.apiPath + '/baseline/:name')
            .get(api.findOne);

        app.route(config.app.apiPath + '/baseline/:name/raw')
            .get(api.renderRawImage);

    }

}
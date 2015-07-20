var config = require('config'),
    api = require('./api');

module.exports = {

    apply: function (app) {
        app.route(config.app.apiPath + '/screenshot')
            .post(api.submitNewScreenshot)

        app.route(config.app.apiPath + '/screenshot/:name')
            .get(api.listByName);

        app.route(config.app.apiPath + '/screenshot/:name/raw')
            .get(api.renderRawImage);
    }

}
var config = require('config'),
    api = require('./api');

module.exports = {

    apply: function (app) {
        app.route(config.app.apiPath + '/screenshot/:name')
            .post(api.submitNewScreenshot);

        app.route(config.app.apiPath + '/screenshot/:name/promote/:candidateId')
            .post(api.promoteScreenshot);

    }

};
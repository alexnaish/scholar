var config = require('config'),
    api = require('./api');

module.exports = {

    apply: function (app) {

        var basePath = '/screenshot/:name';

        app.route(config.app.apiPath + basePath)
            .post(api.submitNewScreenshot);

        app.route(config.app.apiPath + basePath + '/promote/:candidateId')
            .put(api.promoteScreenshot);

        app.route(config.app.apiPath + basePath + '/:diffId')
            .delete(api.deleteScreenshot);

    }

};
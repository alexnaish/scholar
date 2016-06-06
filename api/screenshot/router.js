var config = require('config');
var api = require('./api');
var middleware = require('../middleware/auth');

module.exports = {

    apply: function (app) {

        var basePath = '/screenshot/:name';

        app.route(config.app.apiPath + basePath)
            .post(api.submitNewScreenshot);

        app.route(config.app.apiPath + basePath + '/promote/:candidateId')
            .put(middleware.requireValidToken, api.promoteScreenshot);

        app.route(config.app.apiPath + basePath + '/:diffId')
            .delete(middleware.requireValidToken, api.deleteScreenshot);

    }

};

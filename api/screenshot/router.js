var config = require('config');
var api = require('./api');
var auth = require('../middleware/auth');
var validate = require('../middleware/validate');

module.exports = {

    apply: function (app) {

        var basePath = '/screenshot/:name';

        // POST /api/screenshot/:name
        //  DEL /api/screenshot/:name/:id
        //  PUT /api/screenshot/:name/promote/:id
        //  DEL /api/screenshot/:name/diff/:id

        app.route(config.app.apiPath + basePath)
            .post(api.submitNewScreenshot);

        app.route(config.app.apiPath + basePath + '/:id')
            .delete(validate.objectId, auth.requireValidToken, api.deleteScreenshot);

        app.route(config.app.apiPath + basePath + '/promote/:candidateId')
            .put(validate.objectId, auth.requireValidToken, api.promoteScreenshot);

        app.route(config.app.apiPath + basePath + '/diff/:diffId')
            .delete(validate.objectId, auth.requireValidToken, api.deleteDiff);

    }

};

var config = require('config');
var api = require('./api');
var auth = require('../middleware/auth');
var validate = require('../middleware/validate');
var express = require('express');

module.exports = {

    apply: function (app) {

        var screenshotRouter = express.Router();

        screenshotRouter.param('id', validate.objectId);

        screenshotRouter.route('/:name')
            .post(api.submitNewScreenshot);

        screenshotRouter.route('/:name/:id')
            .all(auth.requireValidToken)
            .delete(api.deleteScreenshot);

        screenshotRouter.route('/:name/promote/:candidateId')
            .all(auth.requireValidToken)
            .put(api.promoteScreenshot);

        screenshotRouter.route('/:name/diff/:diffId')
            .all(auth.requireValidToken)
            .delete(api.deleteDiff);

        app.use(config.app.apiPath + '/screenshot', screenshotRouter);

    }

};

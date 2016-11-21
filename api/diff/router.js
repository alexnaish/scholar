var config = require('config');
var api = require('./api');
var express = require('express');

module.exports = {

    apply: function (app) {

        var diffRouter = express.Router();

        diffRouter.route('/:name')
            .get(api.find);

        diffRouter.route('/:name/:id/raw')
            .get(api.renderRawImage);

        app.use(config.app.apiPath + '/diff', diffRouter);

    }

};

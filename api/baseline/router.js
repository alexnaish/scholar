var config = require('config');
var api = require('./api');
var express = require('express');

module.exports = {

	apply: function (app) {

		var baselineRouter = express.Router();

		baselineRouter.route('/')
			.get(api.list);

		baselineRouter.route('/:name')
			.get(api.find);

		baselineRouter.route('/:id/raw')
			.get(api.renderRawImage);

		app.use(config.app.apiPath + '/baseline', baselineRouter);
	}

};

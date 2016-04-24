var config = require('config');
var api = require('./api');
var express = require('express');

module.exports = {

	apply: function (app) {

		var userRouter = express.Router();

		userRouter.route('/')
			.get(api.list)
			.post(api.register);

		userRouter.route('/token')
			.post(api.generateToken);

		userRouter.route('/:id')
			.get(api.fetch)
			.put(api.update)
			.delete(api.remove);

		userRouter.route('/:id/avatar')
			.get(api.generateAvatar);


		app.use(config.app.apiPath + '/user', userRouter);
	}

};

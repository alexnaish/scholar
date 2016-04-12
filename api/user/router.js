var config = require('config');
var api = require('./api');
var express = require('express');

module.exports = {

	apply: function (app) {

		var userRouter = express.Router();

		userRouter.route('/')
			.get(api.list)
			.post(function (req, res, next) {
				res.status(201).json({
					endpoint: 'create new user'
				});
			});

		userRouter.route('/:id')
			.get(api.fetch)
			.put(function (req, res, next) {
				res.status(200).json({
					endpoint: 'update specific user',
					id: req.params.id
				});
			})
			.delete(function (req, res, next) {
				res.status(200).json({
					endpoint: 'delete specific user',
					id: req.params.id
				});
			});

        userRouter.route('/:id/avatar')
            .get(api.generateAvatar);

		app.use(config.app.apiPath + '/user', userRouter);
	}

};

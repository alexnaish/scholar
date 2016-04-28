var UserService = require('./service');

module.exports = {
	list: function (req, res, next) {
		UserService.find({}, 'firstName lastName email', function (err, results) {
			if (err) {
				console.error('UserApi.list errored');
				return next(err);
			}
			res.status(200).json(results);
		});
	},
	fetch: function (req, res, next) {
		UserService.findOne({
			_id: req.params.id
		}, 'username firstName lastName email', function (err, result) {
			if (err) {
				console.error('UserApi.fetch errored');
				return next(err);
			}
			if (!result) {
				return res.status(404).json({
					error: 'User not found'
				});
			}
			res.status(200).json(result);
		});
	},
	register: function (req, res, next) {
		var validity = UserService.valid(req.body, true);
		if (!validity.valid) {
			return res.status(400).json({
				error: validity.reason
			});
		}
		UserService.findOne({
			$or: [{ username: req.body.username }, { email: req.body.email }]
		}, function(err, result) {
			if(err) return next(err);
			if(result) {
				return res.status(409).json({
					error: 'User already exists'
				});
			}
			UserService.create(req.body, function (err, data) {
				if (err) return next(err)
				res.status(201).json(data);
			});
		});
	},
	update: function (req, res, next) {
		var validity = UserService.valid(req.body, false);
		if (!validity.valid) {
			return res.status(400).json({
				error: validity.reason
			});
		}
		UserService.update(req.params.id, req.body, function(err, result) {
			if(err) return next(err);
			if(!result) {
				return res.status(404).json({
					error: 'User not found'
				});
			}
			res.status(200).json(result);
		});
	},
	remove: function (req, res, next) {
		UserService.findOne({
			_id: req.params.id
		}, function(err, result) {
			if(err) return next(err);
			if(!result) {
				return res.status(404).json({
					error: 'User not found'
				});
			}
			UserService.delete(req.params.id, function (err) {
				if (err) return next(err)
				res.status(200).json({});
			});
		});
	},
	generateToken: function (req, res, next) {
		UserService.checkLogin(req.body.username, req.body.password, function(err, userRecord) {
			if(err) return next(err);
			if(!userRecord) {
				return res.status(401).json({error: 'Unable to login'});
			}
			UserService.generateToken(userRecord, function(generatedToken){
				res.status(201).json({
					token: generatedToken
				});
			})

		});
	},
	generateAvatar: function (req, res, next) {
		UserService.avatar(req.params.id, function (err, resp) {
			if (err) {
				console.error('UserApi.generateAvatar errored');
				return next(err);
			}
			if (!resp) {
				return res.sendStatus(404);
			}
			res.set('Cache-Control', 'public, max-age=31557600');
			res.set('Content-Type', 'image/svg+xml');
			res.status(200).send(resp);
		});
	}
};

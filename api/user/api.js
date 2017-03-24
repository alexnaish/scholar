var UserService = require('./service');

module.exports = {
	list: (req, res, next) => {
        UserService.find({}, 'firstName lastName email', (err, results) => {
            if (err) {
                console.error('UserApi.list errored');
                return next(err);
            }
            res.status(200).json(results);
        });
    },
    fetch: (req, res, next) => {
        UserService.findOne({
            _id: req.params.id
        }, 'firstName lastName email social', (err, result) => {
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
    register: (req, res, next) => {
    		var credentialDetails = UserService.validateCredentialsToken(req.hostname, req.body.credentials);
    		if(credentialDetails.valid === false) {
      			console.error(`Invalid credentials: ${credentialDetails.errors.join(', ')}`);
      			return res.status(400).json({
      				error: 'Invalid credentials token',
      				details: credentialDetails.errors
      			});
    		}
        var validity = UserService.valid(credentialDetails.payload, true);
        if (!validity.valid) {
            return res.status(400).json({
                error: validity.reason
            });
        }
        UserService.findOne({
            $or: [{
                username: credentialDetails.payload.username
            }, {
                email: credentialDetails.payload.email
            }]
        }, (err, result) => {
            if (err) return next(err);
            if (result) {
                return res.status(409).json({
                    error: 'User already exists'
                });
            }
            UserService.create(credentialDetails.payload, (err, data) => {
                if (err) return next(err)
                res.status(201).json(data);
            });
        });
    },
    update: (req, res, next) => {
        var validity = UserService.valid(req.body, false);
        if (!validity.valid) {
            return res.status(400).json({
                error: validity.reason
            });
        }
        UserService.update(req.params.id, req.body, (err, result) => {
            if (err) return next(err);
            if (!result) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }
            res.status(200).json(result);
        });
    },
    remove: (req, res, next) => {
        UserService.findOne({
            _id: req.params.id
        }, (err, result) => {
            if (err) return next(err);
            if (!result) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }
            UserService.delete(req.params.id, (err) => {
                if (err) return next(err)
                res.status(200).json({});
            });
        });
    },
    generateToken: (req, res, next) => {
        var credentialDetails = UserService.validateCredentialsToken(req.hostname, req.body.credentials);
        if (credentialDetails.valid === false) {
            console.error(`Invalid credentials: ${credentialDetails.errors.join(', ')}`);
            return res.status(400).json({
                error: 'Invalid credentials token',
				        details: credentialDetails.errors
            });
        }

        UserService.checkLogin(credentialDetails.payload, (err, userRecord) => {
            if (err) return next(err);
            if (!userRecord) {
                return res.status(401).json({
                    error: 'Incorrect credentials'
                });
            }
            UserService.generateAuthToken(userRecord, (generatedToken) => {
                res.status(201).json({
                    token: generatedToken
                });
            })

        });
    },
    generateAvatar: (req, res, next) => {
        UserService.avatar(req.params.id, (err, resp) => {
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

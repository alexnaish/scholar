var UserService = require('./service');

module.exports = {
	list: function (req, res) {
		UserService.find({}, 'firstName lastName email', function (err, results) {
			if (err) {
				console.error('UserApi.list errored:', err);
				return res.status(500).json({
					error: 'Internal Server Error'
				});
			}
			res.status(200).json(results);
		});
	},
	fetch: function (req, res) {
		UserService.findOne({
			_id: req.params.id
		}, 'username firstName lastName email', function (err, result) {
			if (err) {
				console.error('UserApi::Fetch errored:', err);
				return res.status(500).json({
					error: 'Internal Server Error'
				});
			}
			if (!result) {
				return res.status(404).json({
					error: 'No user found'
				});
			}
			res.status(200).json(result);
		});
	},
	generateAvatar: function (req, res) {
		UserService.avatar(req.params.id, function (err, resp) {
			if (err) {
                console.error('UserApi::generateAvatar errored:', err);
				return res.status(500).json({
					error: 'Internal Server Error'
				});
			}
            if(!resp){
                return res.send(404);
            }
			res.set('Cache-Control', 'public, max-age=31557600');
			res.status(200).send(resp);
		});
	}
};

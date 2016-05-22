var config = require('config');
var jwt = require('jsonwebtoken');

module.exports = {
    requireValidToken: function(req, res, next) {
        var authHeader = req.headers.authorization;
        var token = (authHeader || '').split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Missing auth token' });
        }

        jwt.verify(token, config.app.secret, function(err, decoded) {
            if (err) {
                return res.status(400).json({ error: 'Invalid auth token' });
            }
            req.user = decoded.user;
            return next();
        });
    }
};

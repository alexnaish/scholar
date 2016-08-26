var config = require('config');
var api = require('./api');
var middleware = require('../middleware/auth');
var express = require('express');

module.exports = {

    apply: function(app) {

        var userRouter = express.Router();

        userRouter.route('/')
            .get(middleware.requireValidToken, api.list)
            .post(api.register);

        userRouter.route('/token')
            .post(api.generateToken);

        userRouter.route('/:id')
            .all(middleware.requireValidToken)
            .get(api.fetch)
            .put(api.update)
            .delete(api.remove);

        userRouter.route('/:id/avatar')
            .get(api.generateAvatar);


        app.use(config.app.apiPath + '/user', userRouter);
    }

};

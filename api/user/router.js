var config = require('config');
var express = require('express');

module.exports = {

  apply: function(app) {

    var userRouter = express.Router();

    userRouter.route('/')
      .get(function(req, res, next) {
        res.status(200).json({
          endpoint: 'get all users'
        });
      })
      .post(function(req, res, next) {
        res.status(201).json({
          endpoint: 'create new user'
        });
      });

    userRouter.route('/:id')
      .get(function(req, res, next) {
        res.status(200).json({
          endpoint: 'get specific user',
          id: req.params.id
        });
      })
      .put(function(req, res, next) {
        res.status(200).json({
          endpoint: 'update specific user',
          id: req.params.id
        });
      })
      .delete(function(req, res, next) {
        res.status(200).json({
          endpoint: 'delete specific user',
          id: req.params.id
        });
      })

    app.use(config.app.apiPath + '/user', userRouter);
  }

};

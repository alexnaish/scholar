var config = require('config');
var api = require('./api');
var express = require('express');

module.exports = {

  apply: function(app) {

    var candidateRouter = express.Router();

    candidateRouter.route('/')
      .get(api.findOutStanding);

    candidateRouter.route('/:name/:id/raw')
      .get(api.renderRawImage);

    app.use(config.app.apiPath + '/candidate', candidateRouter);
  }

};

var config = require('config');
var api = require('./api');
var express = require('express');
var validate = require('../middleware/validate');

module.exports = {

  apply: function(app) {

    var candidateRouter = express.Router();

    candidateRouter.route('/')
      .get(api.findOutStanding);

    candidateRouter.route('/:name/:id/raw')
      .get(validate.objectId, api.renderRawImage);

    app.use(config.app.apiPath + '/candidate', candidateRouter);
  }

};

var CandidateService = require('./service');
var ImageService = require('../image/service');

module.exports = {
  renderRawImage: function(req, res) {
    CandidateService.findOne(req.params.id, 'data', function(err, result) {
      if (!result) {
        res.status(404).send();
      } else {
        ImageService.generateImage(res, result.data);
      }
    });
  },
  findOutStanding: function(req, res) {
    CandidateService.findDistinct(function(err, results) {
      if (err) {
        console.error('candidate findOutStanding error: ', err);
        res.status(500).send({
          error: err.message || "Database error!"
        });
      } else {
        res.status(200).json(results);
      }
    });
  }

};

var CandidateModel = require('./model');

module.exports = {

  findOne: function(id, fields, callback) {
    var errorCode = 200;
    CandidateModel.findOne({
      _id: id
    }, fields, {
      lean: true
    }, function(err, result) {
      if (!result) {
        errorCode = 404;
      }
      callback(errorCode, result);
    });
  },
  findDistinct: function(callback) {
    CandidateModel.distinct('name', callback);
  },
  save: function(payload, callback) {
    new CandidateModel(payload).save(callback);
  },
  remove: function(query, callback) {
    CandidateModel.remove(query, callback);
  }

};

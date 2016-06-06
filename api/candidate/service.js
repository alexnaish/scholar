var CandidateModel = require('./model');

module.exports = {

  findOne: function(id, fields, callback) {
    CandidateModel.findOne({
      _id: id
    }, fields, {
      lean: true
  }, callback);
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

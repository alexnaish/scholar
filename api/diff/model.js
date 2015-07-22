var screenshotSchema = require('../screenshot/model').schema,
    _ = require('lodash'),
    mongoose = require('mongoose');


var schema = _.extend({}, screenshotSchema);
//schema.candidate = {
//    type: String,
//    required: true
//};

module.exports = mongoose.model('Diff', mongoose.Schema(schema));
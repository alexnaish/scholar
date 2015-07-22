var screenshotSchema = require('../screenshot/model').schema,
    _ = require('lodash'),
    mongoose = require('mongoose');


var schema = _.extend({
    candidate: {
        type: String,
        required: true
    }
}, screenshotSchema);

module.exports = mongoose.model('Diff', schema);

var screenshotSchema = require('../screenshot/model').schema,
    mongoose = require('mongoose');

module.exports = mongoose.model('Candidate', mongoose.Schema(screenshotSchema));
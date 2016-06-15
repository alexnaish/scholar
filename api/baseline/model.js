const screenshotSchema = require('../screenshot/model').schema;
const mongoose = require('mongoose');

const schema = mongoose.Schema(screenshotSchema);
schema.index({ name: 1, 'meta.browser': -1 });

module.exports = mongoose.model('Baseline', schema);
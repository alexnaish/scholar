var mongoose = require('mongoose');

var screenshot = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    data: {
        type: Buffer,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Screenshot', screenshot);
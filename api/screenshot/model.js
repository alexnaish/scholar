var mongoose = require('mongoose');

var screenshotSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});


module.exports = {
    schema: screenshotSchema
}
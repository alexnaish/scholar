var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
	username: {
		required: true,
		type: String
	},
	password: {
		required: true,
		type: String
	},
	firstName: {
		required: true,
		type: String
	},
	lastName: {
		required: true,
		type: String
	},
	email: {
		required: true,
		type: String
	},
    github: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);

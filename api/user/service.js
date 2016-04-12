var UserModel = require('./model');
var bcrypt = require('bcrypt');
var jdenticon = require("jdenticon");
var config = require('config');
var crypto = require('crypto');
var encryptionCost = config.encryption.cost;

// TODO Use this when implementing Create / Update
// function generatePassword(suppliedPassword, callback) {
// 	bcrypt.genSalt(encryptionCost, function (err, salt) {
// 		if (err) return callback(err);
// 		bcrypt.hash(suppliedPassword, salt, callback);
// 	});
// };
//
// function passwordMatches(suppliedPassword, storedPassword, callback) {
// 	bcrypt.compare(suppliedPassword, storedPassword, callback);
// };


module.exports = {
	find: function (query, fields, callback) {
		UserModel.find(query, fields, {
			lean: true,
			sort: {
				dateCreated: -1
			}
		}, callback);
	},
    findOne: function (query, fields, callback) {
		UserModel.findOne(query, fields, {
			lean: true
		}, callback);
	},
	avatar: function (userId, callback) {
		UserModel.findOne({
			_id: userId
		}, '_id', {
			lean: true
		}, function (err, result) {
			var response;
			if (!err && result) {
                var hash = crypto.createHash('md5').update(result._id.toString()).digest("hex");
				response = jdenticon.toSvg(hash, 200);
			}
			callback(err, response);
		});
	}
};

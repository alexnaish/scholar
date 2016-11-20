var UserModel = require('./model');
var config = require('config');
var bcrypt = require('bcrypt-nodejs');
var jdenticon = require("jdenticon");
var config = require('config');
var crypto = require('crypto');
var _ = require('lodash');
var jwt = require('jsonwebtoken');

var requiredKeys = _.keys(_.pickBy(UserModel.schema.paths, function(path) {
    return path.isRequired;
}));

function atob(str) {
    return new Buffer(str, 'base64').toString('binary');
}

function decode(tokenComponent) {
    return JSON.parse(atob(tokenComponent));
}

var validation = {
    username: function(value) {
        return !!(typeof value == 'string' && value.match(/^[a-zA-Z0-9_\-\.]{6,64}$/));
    },
    password: function(value) {
        return !!(typeof value == 'string' && value.length > 7);
    },
    email: function(value) {
        return !!(typeof value == 'string' && value.match(/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/));
    }
};

module.exports = {
    find: function(query, fields, callback) {
        UserModel.find(query, fields, {
            lean: true,
            sort: {
                dateCreated: -1
            }
        }, callback);
    },
    findOne: function(query, fields, callback) {
        UserModel.findOne(query, fields, {
            lean: true
        }, callback);
    },
    valid: function(dataObject, requirePassword) {
        var hasAllRequired = _.every(requiredKeys, function(key) {
            if (key === 'password' && !requirePassword) return true;
            return dataObject[key] !== undefined;
        });

        if (!hasAllRequired) {
            return {
                valid: false,
                reason: 'Must contain required fields'
            };
        }

        var validationErrors = [];
        for (var key in dataObject) {
            if (validation[key] && !validation[key](dataObject[key])) {
                validationErrors.push(key);
            }
        }

        if (validationErrors.length > 0) {
            return {
                valid: false,
                reason: `Must pass validation: ${validationErrors.join(', ')}`
            };
        }
        return {
            valid: true
        };

    },
    create: function(payload, callback) {
        bcrypt.hash(payload.password, null, null, function(err, hash) {
            if (err) callback(err);
            payload.password = hash;
            new UserModel(payload).save(function(err, insertedUser) {
                if (err) return callback(err);
                var user = insertedUser.toObject()
                delete user.password;
                callback(err, user);
            });
        });
    },
    update: function(userId, payload, callback) {
        delete payload._id;
        if (payload.password) {
            bcrypt.hash(payload.password, null, null, function(err, hash) {
                payload.password = hash;
                _performUpdate(userId, payload, callback);
            });
        } else {
            _performUpdate(userId, payload, callback);
        }

        function _performUpdate(userId, payload, callback) {
            UserModel.findOneAndUpdate({
                _id: userId
            }, payload, {
                new: true,
                upsert: false,
                runValidators: true,
                passRawResult: true
            }, function(err, updatedUser) {
                if (updatedUser) {
                    updatedUser = updatedUser.toObject();
                    delete updatedUser.password;
                }
                callback(err, updatedUser);
            });
        }
    },
    delete: function(userId, callback) {
        UserModel.remove({
            _id: userId
        }, callback);
    },
    avatar: function(userId, callback) {
        UserModel.findOne({
            _id: userId
        }, '_id', {
            lean: true
        }, function(err, result) {
            var response;
            if (!err && result) {
                var hash = crypto.createHash('md5').update(result._id.toString()).digest("hex");
                response = jdenticon.toSvg(hash, 200, 0);
            }
            callback(err, response);
        });
    },
    checkLogin: function(userDetails, callback) {
        UserModel.findOne({
            username: userDetails.username
        }, null, {
            lean: true
        }, function(err, result) {
            if (err || !result) return callback(err);
            bcrypt.compare(userDetails.password, result.password, function(err, matches) {
                if (err) return callback(err);
                callback(err, (matches ? result : null));
            });


        });
    },
    validateCredentialsToken: function(hostname, credentialsToken) {
        credentialsToken = credentialsToken || "";
        var validationErrors = [];
        //payload . metadata . signature
        var validationRules = [
            function length(components) {
                return components.length === 3;
            },
            function structure(components) {
                decode(components[0])
                decode(components[1])
                return true;
            },
            function signature(components) {
                return atob(components[2]) === components[0] + components[1];
            },
            function issuer(components) {
                return decode(components[1]).iss === hostname;
            },
            function expired(components) {
                return decode(components[1]).exp > Date.now();
            }
        ];

        var tokenComponents = credentialsToken.split('.');
        validationRules.forEach((func) => {
            try {
                if (!func(tokenComponents)) {
                    validationErrors.push(func.name);
                }
            } catch (e) {
                validationErrors.push(func.name);
            }
        });

        return {
            valid: validationErrors.length === 0,
            errors: validationErrors,
            payload: validationErrors.length === 0 && decode(tokenComponents[0])
        };
    },
    generateAuthToken: function(payload, callback) {
        delete payload.password;
        jwt.sign({
            user: payload
        }, config.app.secret, {
            expiresIn: '6h'
        }, callback);
    }
};

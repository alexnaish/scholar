var config = require('config');
var _ = require('lodash');

module.exports = {
    objectId: function(req, res, next) {
        var validateRegexp = /^[A-Fa-f0-9]{24}$/
        var idValue = _.get(req, 'params.id');

        if(!idValue){
            return next();
        }

        if(!validateRegexp.test(idValue)){
            console.error(`Invalid ID: ${idValue}`);
            return res.status(400).json({
                error: 'Invalid ID'
            });
        }

        next();

    }
};

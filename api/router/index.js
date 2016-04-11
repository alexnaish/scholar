var screenshot = require('../screenshot/router');
var baseline = require('../baseline/router');
var candidate = require('../candidate/router');
var diff = require('../diff/router');
var user = require('../user/router');

module.exports = {

    apply: function (app) {

        screenshot.apply(app);
        baseline.apply(app);
        candidate.apply(app);
        diff.apply(app);
        user.apply(app);

    }
};

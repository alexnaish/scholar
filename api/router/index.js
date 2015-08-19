var screenshot = require('../screenshot/router'),
    baseline = require('../baseline/router'),
    candidate = require('../candidate/router'),
    diff = require('../diff/router');

module.exports = {

    apply: function (app) {

        screenshot.apply(app);
        baseline.apply(app);
        candidate.apply(app);
        diff.apply(app);

    }
};
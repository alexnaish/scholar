var config = require('config'),
    screenshot = require('../screenshot/router');

module.exports = {

    apply: function (app) {

        screenshot.apply(app);

    }
};
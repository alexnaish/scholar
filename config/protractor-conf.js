var request = require('request');

exports.config = {
    directConnect: true,
    capabilities: {
        'browserName': 'chrome'
    },
    baseUrl: 'http://localhost:8000',
    framework: 'jasmine2',
    restartBrowserBetweenTests: false,
    specs: [__dirname + '/../test/e2e/**/*.spec.js'],
    jasmineNodeOpts: {
        defaultTimeoutInterval: 15000,
        isVerbose: true,
        includeStackTrace: true,
        showTiming: true,
        realtimeFailure: true,
        showColors: true
    },
    chromeDriver: __dirname + '/../node_modules/protractor/selenium/chromedriver',
    onPrepare: function () {

        browser.request = request;

    }
};

var config = require('../../config/phantom-conf'); 
var scenarios = config.specs;
var baseUrl = config.baseUrl;
var page = require('webpage').create();
var async = require('async');
var captureService = require('./CaptureService')

page.onConsoleMessage = function (msg, lineNum, sourceId) {
    console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
};

var scenarioFns = scenarios.map(function (scenario) {
    return function (callback) {
        var url = baseUrl + scenario.path;
        console.log('Processing: ', scenario.image);
        page.open(url, function (status) {
            page.viewportSize = scenario.windowSize || {
                    width: 1280,
                    height: 720
                };

            if (status === 'success') {
                setTimeout(function () {
                    if (scenario.setup) {
                        page.evaluate(scenario.setup);
                    }
                    setTimeout(function () {
                        captureService.captureSelector(page, 'test_out/images/' + scenario.image + '.png', scenario.selector);
                        callback();
                    }, scenario.setupTimeout);
                }, scenario.loadTimeout || 2000);
            } else {
                console.error('Failed to load browser for ', url, status);
            }
        });
    };
});

async.waterfall(scenarioFns, function (err) {
    phantom.exit(err);
});
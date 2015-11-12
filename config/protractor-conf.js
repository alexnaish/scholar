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

        browser.submitScreenshot = function(id, callback) {
                var deferred = protractor.promise.defer();

                function makeRequest(id) {
                    browser.takeScreenshot().then(function (png) {
                        request.post('http://localhost:8080/api/screenshot/' + id, {
                            form: {
                                imageData: png
                            }
                        }, function (err, httpResponse, body) {
                            try {
                                deferred.fulfill(JSON.parse(body));
                            } catch(e) {
                                console.log('Error returned:', err);
                                deferred.fulfill(body);
                            }

                        });
                    });

                    return deferred;
                };

                browser.controlFlow().await(makeRequest(id)).then(callback);
            };

        //So it works on non-angular pages
        browser.ignoreSynchronization = true;

    }
};

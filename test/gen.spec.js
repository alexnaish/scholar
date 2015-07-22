describe('can visit www.nowtv.com', function () {

    var myScreenshot;

    function submitScreenshot(id, png, callback) {
        var deferred = protractor.promise.defer();

        function makeRequest(id, png) {
            browser.request.post('http://localhost:8000/api/screenshot/' + id, {
                form: {
                    imageData: png
                }
            }, function (err, httpResponse, body) {
                deferred.fulfill(JSON.parse(body));
            });
            return deferred;
        };

        browser.controlFlow().await(makeRequest(id, png)).then(callback);

    };

    it('user can successfully navigate to nowtv.com', function () {

        browser.driver.get('http://www.nowtv.com/');
        browser.sleep(500);

        browser.takeScreenshot().then(function (png) {
            submitScreenshot('test', png, function (result) {
                console.log('result', result);
                expect(result.passes).toBe(true);
            });
        });
    });

    it('user can successfully navigate to alexnaish.co.uk', function () {

        browser.driver.get('http://www.alexnaish.co.uk/');
        browser.sleep(500);

        browser.takeScreenshot().then(function (png) {
            submitScreenshot('alex', png, function (result) {
                console.log('result', result);
                expect(result.passes).toBe(true);
            });
        });
    });

    it('user can successfully navigate to google.co.uk', function () {

        browser.driver.get('http://www.google.co.uk/');
        browser.sleep(500);

        browser.takeScreenshot().then(function (png) {
            submitScreenshot('google', png, function (result) {
                console.log('result', result);
                expect(result.passes).toBe(true);
            });
        });
    });

});

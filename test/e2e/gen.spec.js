describe('testing ', function () {

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
        browser.sleep(2000);

        browser.takeScreenshot().then(function (png) {
            submitScreenshot('test', png, function (result) {
                console.log('result', result);
                expect(result.passes).toBe(true);
            });
        });
    });

    it('user can successfully navigate to alexnaish.co.uk', function () {

        browser.driver.get('http://www.alexnaish.co.uk/');
        browser.sleep(2000);

        browser.takeScreenshot().then(function (png) {
            submitScreenshot('alex', png, function (result) {
                console.log('result', result);
                expect(result.passes).toBe(true);
            });
        });
    });

    it('user can successfully navigate to google.co.uk', function () {

        browser.driver.get('http://www.google.co.uk/');
        browser.sleep(2000);

        browser.takeScreenshot().then(function (png) {
            submitScreenshot('google', png, function (result) {
                console.log('result', result);
                expect(result.passes).toBe(true);
            });
        });
    });

    it('user can successfully navigate to cloud9trader.com', function () {

        browser.driver.get('http://www.cloud9trader.com/');
        browser.sleep(2000);

        browser.takeScreenshot().then(function (png) {
            submitScreenshot('cloud9', png, function (result) {
                console.log('result', result);
                expect(result.passes).toBe(true);
            });
        });
    });

    it('user can successfully navigate to linkedin.com', function () {

        browser.driver.get('https://www.linkedin.com/nhome/');
        browser.sleep(2000);

        browser.takeScreenshot().then(function (png) {
            submitScreenshot('linkedin', png, function (result) {
                console.log('result', result);
                expect(result.passes).toBe(true);
            });
        });
    });

    it('user can successfully navigate to twitch.tv', function () {

        browser.driver.get('http://www.twitch.tv');
        browser.sleep(2000);

        browser.takeScreenshot().then(function (png) {
            submitScreenshot('twitch', png, function (result) {
                console.log('result', result);
                expect(result.passes).toBe(true);
            });
        });
    });
    it('user can successfully navigate to yahoo.com', function () {

        browser.driver.get('https://uk.yahoo.com/');
        browser.sleep(2000);

        browser.takeScreenshot().then(function (png) {
            submitScreenshot('yahoo', png, function (result) {
                console.log('result', result);
                expect(result.passes).toBe(true);
            });
        });
    });
    it('user can successfully navigate to rivaya.com', function () {

        browser.driver.get('http://rivaya.com/');
        browser.sleep(2000);

        browser.takeScreenshot().then(function (png) {
            submitScreenshot('rivaya', png, function (result) {
                console.log('result', result);
                expect(result.passes).toBe(true);
            });
        });
    });
    it('user can successfully navigate to aeser.co.uk', function () {

        browser.driver.get('http://aeser.co.uk/');
        browser.sleep(2000);

        browser.takeScreenshot().then(function (png) {
            submitScreenshot('aeser', png, function (result) {
                console.log('result', result);
                expect(result.passes).toBe(true);
            });
        });
    });

});

describe('testing ', function () {

    var myScreenshot;

    function submitScreenshot(id, png, callback) {
        var deferred = protractor.promise.defer();

        function makeRequest(id, png) {
            browser.request.post('http://localhost:8080/api/screenshot/' + id, {
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

    xit('user can successfully navigate to nowtv.com', function () {

        browser.driver.get('http://www.nowtv.com/');
        browser.sleep(2000);

        browser.submitScreenshot('test', function (result) {
            expect(result.passes).toBe(true);
        });

    });

    fdescribe('alexnaish.co.uk', function () {

        beforeEach(function () {
            browser.driver.manage().window().maximize();
            browser.executeScript('window.scrollTo(0,0)');
        });

        [
            {
                id: 'alex'
            }
        ].forEach(function (scenario) {
            it('user can successfully navigate to alexnaish.co.uk and target element: ' + scenario.element, function () {

                browser.driver.get('http://www.alexnaish.co.uk/');
                browser.sleep(1000);

                browser.submitScreenshot(scenario.id, function (result) {
                    console.log('result', result);
                    expect(result.passes).toBe(true);
                });
            });

        });
    });

    it('user can successfully navigate to google.co.uk', function () {

        browser.driver.get('http://www.google.co.uk/');
        browser.sleep(2000);

        browser.submitScreenshot('google', function (result) {
            expect(result.passes).toBe(true);
        });
    });

    it('user can successfully navigate to cloud9trader.com', function () {

        browser.driver.get('http://www.cloud9trader.com/');
        browser.sleep(2000);

        browser.submitScreenshot('cloud9', function (result) {
            expect(result.passes).toBe(true);
        });
    });

    it('user can successfully navigate to linkedin.com', function () {

        browser.driver.get('https://www.linkedin.com/nhome/');
        browser.sleep(2000);

        browser.submitScreenshot('linkedin', function (result) {
            expect(result.passes).toBe(true);
        });
    });

    it('user can successfully navigate to twitch.tv', function () {

        browser.driver.get('http://www.twitch.tv');
        browser.sleep(2000);

        browser.submitScreenshot('twitch', function (result) {
            expect(result.passes).toBe(true);
        });
    });
    it('user can successfully navigate to yahoo.com', function () {

        browser.driver.get('https://uk.yahoo.com/');
        browser.sleep(2000);

        browser.submitScreenshot('yahoo', function (result) {
            expect(result.passes).toBe(true);
        });
    });
    it('user can successfully navigate to rivaya.com', function () {

        browser.driver.get('http://rivaya.com/');
        browser.sleep(2000);

        browser.submitScreenshot('rivaya', function (result) {
            expect(result.passes).toBe(true);
        });
    });
    it('user can successfully navigate to aeser.co.uk', function () {

        browser.driver.get('http://aeser.co.uk/');
        browser.sleep(2000);

        browser.submitScreenshot('aeser', function (result) {
            expect(result.passes).toBe(true);
        });
    });

});
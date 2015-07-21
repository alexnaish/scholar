describe('can visit www.nowtv.com', function () {

    var myScreenshot;

    beforeEach(function () {
        browser.driver.get('http://q1ice.nowtv.bskyb.com');
    });


    function submitScreenshot(png) {
        var deferred = protractor.promise.defer();

        browser.request.post('http://localhost.nowtv.bskyb.com:8000/api/screenshot/test', {
            form: {
                imageData: png
            }
        }, function (err, httpResponse, body) {
            deferred.fulfill(JSON.parse(body));
        });

        return deferred;
    };

    it('user can successfully navigate to nowtv.com', function () {
        browser.takeScreenshot().then(function (png) {
            browser.controlFlow().await(submitScreenshot(png)).then(function (result) {
                expect(result.passes).toBe(true);
            });
        });
    });

});
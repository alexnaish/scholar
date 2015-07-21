describe('can visit www.nowtv.com', function () {

    var myScreenshot;

    beforeEach(function () {
        browser.driver.get('http://localhost.nowtv.bskyb.com:3000/');
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

        //        browser.sleep(1000);

        browser.takeScreenshot().then(function (png) {
            browser.controlFlow().await(submitScreenshot(png)).then(function (result) {
                console.log('result', result);
                expect(result.passes).toBe(true);
            });
        });
    });

});
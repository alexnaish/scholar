var fs = require('fs');
var async = require('async');
var submissionService = require('./SubmissionService');
var baseUrl = require('../../config/phantom-conf').baseUrl;
var ResultsFactory = require('./ResultsFactory');

var junitXml = ResultsFactory.createRoot(baseUrl);
var testsFailed = 0;
var imageComparisionFns = [];
var images = fs.readdirSync('test_out/images');

images.forEach(function (name) {

    if (name.indexOf('.png') !== -1) {
        imageComparisionFns.push(function (callback) {
            var id = name.slice(0, name.length - 4);
            var image = fs.readFileSync('test_out/images/' + name);

            submissionService.submit(id, image.toString('base64'), function (err, response) {
                if (response && response.passes) {
                    console.log(name, ' passed!');
                    junitXml.createPassingTestResult(name, response);
                } else {
                    console.error(name, ' failed!');
                    junitXml.createFailingTestResult(name, response, err);
                    testsFailed++;
                }
                callback();
            });
        });
    }

});

async.parallel(imageComparisionFns, function (err) {

    if (err) {
        console.error('Ah shite, something broke trying to work out the diffs', arguments);
    } else {
        junitXml.createTotalAttrs(images.length, testsFailed);
        fs.writeFileSync('test_out/visual-results.xml', junitXml.end());
        if (testsFailed) {
            console.log(testsFailed, 'tests failed!');
            // process.exit(testsFailed);
        }
    }
});

var broadbandSpecs = require('../specs/broadband-specs');
var checkoutSpecs = require('../specs/checkout-specs');
var system = require('system');
var env = system.env;
/*

Possible Spec Options:

image: String that will be the unique identifier within Scholar. Example = "TestHeaderDesktop"
selector: CSS Selector to target specific elements. Example = ".main.header"
path: URL path to target page. Example = "/myTestPage"
loadTimeout: Milliseconds to allow page to stabilise before taking a screenshot (Defaults to 2000). Example = 5000
setup: function that will be evaluated within the browser to allow events to happen after page loads (click on an accordion heading etc). Example = function () {
        $('.faq-question-2').click();
    }
setupTimeout: Milliseconds to allow page to stabilise after running a setup function (Defaults to 0). Example = 2000
windowSize: JS Object with width and height properties. Example = {width: 1280, height: 720},
cookie: JS Object containing name, value and domiain. Example = {
	'name': 'ark',
	'value': 'ark',
	'domain': '.nowtv.com'
}

*/

var specsToRun;

if(env && env.suite) {
	var resolution = env.res || 'all'
		specsToRun = require('../specs/'+ env.suite + '-specs')[resolution];
		console.log('Running ' + resolution + ' tests for ' + env.suite);
} else {
	  specsToRun = broadbandSpecs.all.concat(checkoutSpecs.all)
		console.log('Running all specs!');
}


module.exports = {

	baseUrl: 'http://localhost.nowtv.com:9999',
	scholarUrl: 'http://localhost:8080',
	cookies: [
		{
			'name': 'ark',
			'value': 'ark',
			'domain': '.nowtv.com'
		},
		{
			'name': 'uuid',
			'value': 'f41f4ed3-3d4f-4a39-b8bb-4493a95d44cb',
			'domain': '.nowtv.com'
		},
		{
			'name': 'skyUMV',
			'value': 'some-kind-of-dummy-umv',
			'domain': '.nowtv.com'
		}
	],
	specs: specsToRun

};

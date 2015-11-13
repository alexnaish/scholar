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
windowSize: JS Object with width and height properties. Example = {width: 1280, height: 720}

*/

module.exports = {

	baseUrl: 'http://alexnaish.co.uk',
	scholarUrl: 'http://localhost:8080',
	specs: [
		{
			image: 'main-title',
			selector: 'h1',
			path: '/'
		}, {
			image: 'about',
			selector: '#about',
			path: '/'
		}
	]

};
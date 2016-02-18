var desktopSpecs = [
	{
		image: 'broadband-topnav',
		selector: '.topnav',
		path: '/'
	}, {
		image: 'broadband-header',
		selector: '.header_blue',
		path: '/'
	}, {
		image: 'broadband-form-container',
		selector: '.postcode-landline-container',
		path: '/'
	}, {
		image: 'broadband-form-error',
		selector: '.postcode-landline-container',
		path: '/',
		setup: function() {
				document.getElementById('landline').className += " error";
				document.getElementsByClassName('now-button_primary_green')[0].click()
		}
	}, {
		image: 'broadband-form-valid',
		selector: '.postcode-landline-container',
		path: '/',
		setup: function() {
				document.getElementById('postcode').className += " valid";
				document.getElementById('landline').className += " valid";
		}
	}
];

var mobileSpecs = [
	{
		image: 'broadband-mobile-topnav',
		selector: '.topnav',
		path: '/',
		windowSize: {width: 480, height: 600}
	}, {
		image: 'broadband-mobile-header',
		selector: '.header_blue',
		path: '/',
		windowSize: {width: 480, height: 600}
	}, {
		image: 'broadband-mobile-form-container',
		selector: '.postcode-landline-container',
		path: '/',
		windowSize: {width: 480, height: 600}
	}, {
		image: 'broadband-mobile-form-error',
		selector: '.postcode-landline-container',
		path: '/',
		windowSize: {width: 480, height: 600},
		setup: function() {
				document.getElementById('landline').className += " error";
				document.getElementsByClassName('now-button_primary_green')[0].click()
		}
	}, {
		image: 'broadband-mobile-form-valid',
		selector: '.postcode-landline-container',
		path: '/',
		windowSize: {width: 480, height: 600},
		setup: function() {
				document.getElementById('postcode').className += " valid";
				document.getElementById('landline').className += " valid";
		}
	}
];

module.exports = {
  desktop: desktopSpecs,
  mobile: mobileSpecs,
  all: desktopSpecs.concat(mobileSpecs)
};

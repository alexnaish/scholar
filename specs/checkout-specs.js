var desktopSpecs = [
	{
		image: 'checkout-topnav',
		selector: '',
		path: '/'
	}, {
		image: 'checkout-header',
		selector: '',
		path: '/'
	}
];

var mobileSpecs = [
	{
		image: 'checkout-mobile-topnav',
		selector: '',
		path: '/',
		windowSize: {width: 480, height: 600}
	}, {
		image: 'checkout-mobile-header',
		selector: '',
		path: '/',
		windowSize: {width: 480, height: 600}
	}
];

module.exports = {
  desktop: desktopSpecs,
  mobile: mobileSpecs,
  all: desktopSpecs.concat(mobileSpecs)
};

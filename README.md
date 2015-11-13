# scholar - Visual Regression Engine

[![Code Climate](https://codeclimate.com/github/alexnaish/scholar/badges/gpa.svg)](https://codeclimate.com/github/alexnaish/scholar)
[![Build Status](https://travis-ci.org/alexnaish/scholar.svg)](https://travis-ci.org/alexnaish/scholar)
[![Test Coverage](https://codeclimate.com/github/alexnaish/scholar/badges/coverage.svg)](https://codeclimate.com/github/alexnaish/scholar/coverage)


Screenshots
-----
### Dashboard

http://s30.postimg.org/mk2xbzd7z/dashboard.png

### Comparison Page

http://s30.postimg.org/rhghx3f73/comparison.png

Intro
-----

Needed a nice tool to allow easy Visual regression testing of HTML/CSS/JS modules. No more asserting class names, run your tests, post the base64 screenshots and get immediate feedback within your tests as to whether the difference is acceptable or not.

The first time an image is posted to the application it will specify it as a baseline and after that the application will compare submitted images against the saved baseline for the submitted ID. When submitting an image you need to specify a name/id to group images. The application then uses that ID to either baseline the image (if its the first time the ID has been used) or to find the baseline to compare against.

Setup
-----

1. Clone the repository and then run `cd scholar`.
1. Run `npm install`.
1. On a locally running mongodb server, create the "scholar" database with user/password "scholar/kernel" (configurable with "api/config/default.js" as required). 
	1. On Mongo 2.6 and up you can do this by in your terminal running `mongo scholar --eval "db.createUser({ user: 'scholar', pwd: 'kernel', roles: ['readWrite', 'dbAdmin'] } )` 
1. To start the application run `npm start` or if you have `pm2` installed, run `pm2 start api/index.js --name scholar --watch`.
1. To view the application and the submitted screenshots go to `localhost:8080`.
1. The first time any tests run all they should pass as the images are being baselined. On subsequent runs they should pass/fail depending on whether the website has changed since the baseline was taken.

Example Test Setup
-------

###Protractor

1. To run a sample of tests using protractor, run `npm run protractor`. This will load up Google Chrome and will take snapshots of the entire page to send to scholar. The screenshots are taken by protractor's inbuilt screenshot tool and the helper function to submit the images is stored inside config/protractor-conf.js.


###PhantomJS

1. To run a sample of tests set up to run with PhantomJs `npm run phantom`. Configuration is stored within config/phantom-conf.js.
2. This will download the yosemite version of PhantomJs locally and will then run a few example specs listed within the config file.
3. This solution will also build a test report XML file that is in a ready to use format for use within Jenkins for pretty output graphs!
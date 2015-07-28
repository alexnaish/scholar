# scholar - Visual Regression Engine

Screenshots 
-----
### Dashboard
http://s30.postimg.org/luk4zmcof/dashboard.png

### Comparison Page
http://s30.postimg.org/kr00nns1b/comparison.png


Intro 
-----

Needed a nice tool to allow easy Visual regression testing of HTML/CSS/JS modules. No more asserting class names, run your tests, post the base64 screenshots and get immediate feedback within your tests as to whether the difference is acceptable or not.

The first time an image is posted to the application it will specify it as a baseline and after that the application will compare submitted images against the saved baseline for the submitted ID. When submitting an image you need to specify a name/id to group images. The application then uses that ID to either baseline the image (if its the first time the ID has been used) or to find the baseline to compare against.

Setup
-----

1. Clone the repository and then run `cd scholar`.
1. Run `npm install`.
1. On a locally running mongodb server, create the "scholar" database with user/password "scholar/kernel" (configurable with "api/config/default.js" as required).
1. To start the application run `npm start`.
1. To run a sample of protractor tests set up to use the application run `npm run e2e`. The first time this will run all the tests should pass as the images are being baselined. On subsequent runs the should pass/fail depending on whether the website has changed since the baseline was taken.
1. To view the application and the submitted screenshots go to `localhost:8000`.
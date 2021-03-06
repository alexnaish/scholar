var helpers = require('../../test/setup/functions');
var app = require('../index');
var smallSampleBase64 = require('../../test/setup/samples/1by1');
var largeSampleBase64 = require('../../test/setup/samples/twitchBaseline');

var BaselineModel = require('../baseline/model');
var CandidateModel = require('../candidate/model');
var DiffModel = require('../diff/model');
var BaselineService = require('../baseline/service');
var ScreenshotService = require('./service');

var _ = require('lodash');
var jwt = require('jsonwebtoken');
var config = require('config');
var sinon = require('sinon');
var expect = require('chai').expect;
var request = require('supertest')(app);

describe('Screenshot API', function () {

    var imageName = 'sample-image';
    var testBrowser = 'test';
    var sample = {
        name: imageName,
        meta: {
            browser: testBrowser
        },
        data: smallSampleBase64
    };
    var anotherBrowserSample = {
        name: imageName,
        meta: {
            browser: 'ANOTHER'
        },
        data: smallSampleBase64
    };

    var candidate, diff, baseline, alternateBaseline;

    var generatedToken;
    var mockUser = {
        firstName: 'Screenshot',
        lastName: 'Test'
    };

    function removeAllAssets(callback) {
        helpers.removeAssets(BaselineModel, {}, function () {
            helpers.removeAssets(CandidateModel, {}, function () {
                helpers.removeAssets(DiffModel, {}, function () {
                    callback();
                });
            });
        });
    }

    function insertAssets(callback) {

        var tempCandidate = _.clone(sample);
        tempCandidate.data = sample.data + 'aDifferentEnding';

        helpers.insertAssets(BaselineModel, [sample, anotherBrowserSample], function (results) {
            baseline = _.find(results, {meta: {browser: 'test'}});
            alternateBaseline = _.find(results, {meta : { browser: 'ANOTHER'}});

            helpers.insertAssets(CandidateModel, [tempCandidate], function (results) {
                candidate = results[0];
                var tempDiff = _.clone(sample);
                tempDiff.candidate = candidate._id;
                tempDiff.baseline = baseline._id;
                helpers.insertAssets(DiffModel, [tempDiff], function (results) {
                    diff = results[0];
                    callback();
                });
            });
        });
    }

    before(function () {
        generatedToken = jwt.sign({
            user: mockUser
        }, config.app.secret);
    });

    beforeEach(function (done) {
        removeAllAssets(function () {
            insertAssets(function () {
                done();
            });
        });
    });

    afterEach(function (done) {
        removeAllAssets(function () {
            done();
        });
    });

    it('POST /api/screenshot/:name should save baseline image if new id', function (done) {

        var testName = 'test-image-name';
        var payload = {
            imageData: 'someMagicBase64Value'
        };

        request.post('/api/screenshot/' + testName)
            .send(payload)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                BaselineModel.findOne({
                    name: testName
                }, function (err, result) {
                    expect(result).to.not.equal(null);
                    expect(result.data).to.equal(payload.imageData);
                    done();
                });
            });
    });

    it('POST /api/screenshot/:name should save image metadata if submitted', function (done) {

        var testName = 'test-image-name-metadata';
        var testBrowser = 'Chrome';
        var testResolution = '1280x720';
        var testLabels = 'magical, modules';
        var payload = {
            imageData: 'someMagicBase64Value'
        };

        request.post('/api/screenshot/' + testName)
            .send(payload)
            .set({
                'X-Scholar-Meta-Browser': testBrowser,
                'X-Scholar-Meta-Resolution': testResolution,
                'X-Scholar-Meta-Labels': testLabels
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                BaselineModel.findOne({
                    name: testName
                }, function (err, result) {
                    expect(result).to.not.equal(null);
                    expect(result.meta.browser).to.equal(testBrowser);
                    expect(result.meta.resolution).to.equal(testResolution);
                    expect(result.meta.labels).to.include.members(testLabels.split(', '));
                    done();
                });
            });
    });

    it('POST /api/screenshot/:name compares against baseline image if existing id and saves a comparison and diff if different', function (done) {

        var payload = {
            imageData: largeSampleBase64
        };

        request.post('/api/screenshot/' + imageName)
            .set({
                'X-Scholar-Meta-Browser': testBrowser
            })
            .send(payload)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res.body.passes).to.equal(false);
                expect(res.body.isSameDimensions).to.equal(false);
                expect(res.body).to.have.property('difference');
                expect(res.body).to.have.property('diffUrl');
                CandidateModel.find({
                    name: imageName
                }, function (err, results) {
                    expect(results.length).to.equal(2);

                    DiffModel.find({
                        name: imageName
                    }, function (err, results) {
                        expect(results.length).to.equal(2);

                        BaselineModel.find({
                            name: imageName,
                            'meta.browser': testBrowser
                        }, function (err, results) {
                            expect(results.length).to.equal(1);
                            done();
                        });
                    });
                });
            });
    });

    it('POST /api/screenshot/:name compares against baseline image if existing id and DOESNT save a comparison / diff if the images are alike', function (done) {

        var payload = {
            imageData: smallSampleBase64
        };

        request.post('/api/screenshot/' + imageName)
            .send(payload)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res.body.passes).to.equal(true);
                CandidateModel.find({
                    name: imageName
                }, function (err, results) {
                    expect(results.length).to.equal(1);

                    DiffModel.find({
                        name: imageName
                    }, function (err, results) {
                        expect(results.length).to.equal(1);

                        BaselineModel.find({
                            name: imageName,
                            'meta.browser': testBrowser
                        }, function (err, results) {
                            expect(results.length).to.equal(1);
                            done();
                        });
                    });
                });
            });
    });

    describe('DEL /api/screenshot/:name/:id', () => {


        it('should response with a standard bad request if the id is invalid', function (done) {

            request.del(`/api/screenshot/${baseline.name}/thisisnotanobjectid`)
                .set('Authorization', 'Bearer ' + generatedToken)
                .expect('Content-Type', /json/)
                .expect(400)
                .end(function (err, res) {
                    expect(err).to.equal(null);
                    expect(res).to.not.equal(null);
                    expect(res.body).to.have.property('error');
                    done();
                });

        });

        it('should require the user to authenticate', function (done) {

            request.del(`/api/screenshot/${baseline.name}/${baseline._id}`)
                .expect('Content-Type', /json/)
                .expect(401)
                .end(function (err, res) {
                    expect(err).to.equal(null);
                    expect(res).to.not.equal(null);
                    expect(res.body).to.have.property('error');
                    done();
                });

        });

        it('should return a 404 with an error message if the baseline cannot be found', function (done) {

            request.del(`/api/screenshot/somepretendname/${baseline._id}`)
                .set('Authorization', 'Bearer ' + generatedToken)
                .expect('Content-Type', /json/)
                .expect(404)
                .end(function (err, res) {
                    expect(err).to.equal(null);
                    expect(res).to.not.equal(null);
                    expect(res.body).to.have.property('error', 'Baseline not found');
                    done();
                });

        });

        it('should return a standard server error if an error occurs when searching for the baseline', function (done) {

            var serviceStub = sinon.stub(BaselineService, 'findOne').yields({message: 'error'}, null);

            request.del(`/api/screenshot/${baseline.name}/${baseline._id}`)
                .set('Authorization', 'Bearer ' + generatedToken)
                .expect('Content-Type', /json/)
                .expect(500)
                .end(function (err, res) {
                    expect(err).to.equal(null);
                    expect(res).to.not.equal(null);
                    expect(res.body).to.have.property('error', 'Internal Server Error');
                    serviceStub.restore();
                    done();
                });

        });

        it('should return a standard server error if an error occurs attempting to remove screenshots', function (done) {

            var serviceStub = sinon.stub(ScreenshotService, 'removeAllScreenshots').yields({message: 'error'}, null);

            request.del(`/api/screenshot/${baseline.name}/${baseline._id}`)
                .set('Authorization', 'Bearer ' + generatedToken)
                .expect('Content-Type', /json/)
                .expect(500)
                .end(function (err, res) {
                    expect(err).to.equal(null);
                    expect(res).to.not.equal(null);
                    expect(res.body).to.have.property('error', 'Internal Server Error');
                    serviceStub.restore();
                    done();
                });

        });

        it('should remove the diff and all candidates, diffs related to the baseline', function (done) {

            request.del(`/api/screenshot/${baseline.name}/${baseline._id}`)
                .set('Authorization', 'Bearer ' + generatedToken)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    expect(err).to.equal(null);
                    expect(res).to.not.equal(null);

                    checkCandidates();

                    function checkCandidates() {
                        CandidateModel.count({
                            _id: candidate._id
                        }, function (err, candidateCount) {
                            expect(err).to.equal(null);
                            expect(candidateCount).to.equal(0);
                            checkDiffs();
                        });
                    }

                    function checkDiffs() {
                        DiffModel.count({
                            _id: diff._id
                        }, function (err, diffCount) {
                            expect(err).to.equal(null);
                            expect(diffCount).to.equal(0);
                            checkBaseline();
                        });
                    }

                    function checkBaseline() {

                        BaselineModel.count({
                            _id: baseline._id
                        }, function (err, diffCount) {
                            expect(err).to.equal(null);
                            expect(diffCount).to.equal(0);
                            checkAlternateBaselineExists();
                        });
                    }

                    function checkAlternateBaselineExists() {

                        BaselineModel.count({
                            _id: alternateBaseline._id
                        }, function (err, diffCount) {
                            expect(err).to.equal(null);
                            expect(diffCount).to.equal(1);
                            done();
                        });
                    }

                });

        });

    });


    it('PUT /api/screenshot/:name/promote/:id should 404 if no candidate found', function (done) {

        var imageName = 'someMadeUpName';
        var candidate = {
            _id: '123123123123123123123123'
        };

        request.put('/api/screenshot/' + imageName + '/promote/' + candidate._id)
            .set('Authorization', 'Bearer ' + generatedToken)
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                done();
            });
    });

    it('PUT /api/screenshot/:name/promote/:id should promote a candidate to baseline and return a 201', function (done) {
        request.put('/api/screenshot/' + imageName + '/promote/' + candidate._id)
            .set('Authorization', 'Bearer ' + generatedToken)
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                CandidateModel.find({
                    name: imageName
                }, function (err, results) {
                    expect(results.length).to.equal(0, 'candidate count not 0!');
                    DiffModel.find({
                        name: imageName
                    }, function (err, results) {
                        expect(results.length).to.equal(0, 'diff count not 0!');
                        BaselineModel.find({
                            name: imageName,
                            'meta.browser': testBrowser
                        }, function (err, results) {
                            expect(results.length).to.equal(1, 'baseline count not 1!');
                            expect(results[0].data).to.equal(candidate.data);

                            done();
                        });
                    });
                });
            });
    });

    it('PUT /api/screenshot/:name/promote/:id should save the name of the user who performed the promotion', function (done) {
        request.put('/api/screenshot/' + imageName + '/promote/' + candidate._id)
            .set('Authorization', 'Bearer ' + generatedToken)
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                BaselineModel.find({
                    name: imageName
                }, function (err, results) {
                    expect(results[0].meta).to.have.property('lastUpdatedBy', `${mockUser.firstName} ${mockUser.lastName}`);
                    expect(results[0].meta).to.have.property('lastUpdated');
                    done();
                });
            });
    });

    it('DEL /api/screenshot/:name/diff/:diffId should delete diff and its candidate and return a 204', function (done) {
        request.del('/api/screenshot/' + imageName + '/diff/' + diff._id)
            .set('Authorization', 'Bearer ' + generatedToken)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);

                DiffModel.findOne({
                    _id: diff._id
                }, function (err, result) {
                    expect(result).to.equal(null);
                    CandidateModel.findOne({
                        _id: diff.candidate
                    }, function (err, result) {
                        expect(result).to.equal(null);
                        done();
                    });
                });
            });
    });

    it('DEL /api/screenshot/:name/diff/:diffId should 404 if no diff found', function (done) {
        request.del('/api/screenshot/' + imageName + '/diff/aMadeUpDiffId')
            .set('Authorization', 'Bearer ' + generatedToken)
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                done();
            });
    });

})
;

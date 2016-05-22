var helpers = require('../../test/setup/functions'),
    app = require('../index'),
    smallSampleBase64 = require('../../test/setup/samples/1by1'),
    largeSampleBase64 = require('../../test/setup/samples/twitchBaseline'),
    BaselineModel = require('../baseline/model'),
    CandidateModel = require('../candidate/model'),
    DiffModel = require('../diff/model'),
    _ = require('lodash'),
    expect = require('chai').expect,
    request = require('supertest')(app);

describe('Screenshot API', function () {

    var imageName = 'sample-image';
    var sample = {
        name: imageName,
        data: smallSampleBase64
    };
    var candidate, diff, baseline;

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
        tempCandidate.data = sample.data+'aDifferentEnding';
        helpers.insertAssets(CandidateModel, [tempCandidate], function (results) {
            candidate = results[0];
            var tempDiff = _.clone(sample);
            tempDiff.candidate = candidate._id;
            helpers.insertAssets(DiffModel, [tempDiff], function (results) {
                diff = results[0];
                helpers.insertAssets(BaselineModel, [sample], function (results) {
                    baseline = results[0];
                    callback();
                });
            });
        });
    }

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
                BaselineModel.findOne({ name: testName }, function (err, result) {
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
                BaselineModel.findOne({ name: testName }, function (err, result) {
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
            .send(payload)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res.body.passes).to.equal(false);
                expect(res.body.isSameDimensions).to.equal(false);
                expect(res.body).to.have.property('difference');
                expect(res.body).to.have.property('diffUrl');
                CandidateModel.find({ name: imageName }, function (err, results) {
                    expect(results.length).to.equal(2);

                    DiffModel.find({ name: imageName }, function (err, results) {
                        expect(results.length).to.equal(2);

                        BaselineModel.find({name: imageName}, function(err, results){
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
                CandidateModel.find({ name: imageName }, function (err, results) {
                    expect(results.length).to.equal(1);

                    DiffModel.find({ name: imageName }, function (err, results) {
                        expect(results.length).to.equal(1);

                        BaselineModel.find({name: imageName}, function(err, results){
                            expect(results.length).to.equal(1);
                            done();
                        });
                    });
                });
            });
    });

    it('PUT /api/screenshot/:name/promote/:id should 404 if no candidate found', function (done) {

        var imageName = 'someMadeUpName';
        var candidate = {
            _id: 'madeUpId'
        };

        request.put('/api/screenshot/' + imageName + '/promote/' + candidate._id)
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
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                CandidateModel.find({ name: imageName }, function (err, results) {
                    expect(results.length).to.equal(0, 'candidate count not 0!');
                    DiffModel.find({ name: imageName }, function (err, results) {
                        expect(results.length).to.equal(0, 'diff count not 0!');
                        BaselineModel.find({name: imageName}, function(err, results){
                            expect(results.length).to.equal(1, 'baseline count not 1!');
                            expect(results[0].data).to.equal(candidate.data);
                            done();
                        });
                    });
                });
            });
    });

    it('DEL /api/screenshot/:name/:diffId should delete diff and its candidate and return a 204', function (done) {
        request.del('/api/screenshot/' + imageName + '/' + diff._id)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);

                DiffModel.findOne({_id: diff._id}, function(err, result){
                    expect(result).to.equal(null);
                    CandidateModel.findOne({_id: diff.candidate}, function(err, result){
                        expect(result).to.equal(null);
                        done();
                    });
                });
            });
    });

    it('DEL /api/screenshot/:name/:diffId should 404 if no diff found', function (done) {
        request.del('/api/screenshot/' + imageName + '/aMadeUpDiffId')
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                done();
            });
    });

});

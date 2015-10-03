var helpers = require('../../test/setup/functions'),
    app = require('../index'),
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
            data: 'somekindofbase64image'
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
        helpers.insertAssets(CandidateModel, [sample], function (results) {
            candidate = results[0];
            var tempDiff = _.clone(sample);
            tempDiff.candidate = candidate._id;
            helpers.insertAssets(DiffModel, [tempDiff], function (results) {
                diff = results[0];
                helpers.insertAssets(BaselineModel, [sample], function () {
                    baseline = results[0];
                    callback();
                });
            });
        });
    }

    beforeEach(function (done) {
        removeAllAssets(function(){
            insertAssets(function(){
                done();
            });
        });
    });

    afterEach(function (done) {
        removeAllAssets(function(){
            done();
        });
    });

    it('POST /api/screenshot/:name save baseline image if new id', function (done) {

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
                done();
            });
    });

    it('POST /api/screenshot/:name compare against baseline image if existing id', function (done) {
        done();
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

                CandidateModel.find({name: imageName}, function(err, results){
                    expect(results.length).to.equal(0);

                    DiffModel.find({name: imageName}, function(err, results){
                        expect(results.length).to.equal(0);
                        done();
                    });
                });
            });
    });

    it('DEL /api/screenshot/:name/:diffId should delete diff and its candidate', function (done) {
        done();
    });

});

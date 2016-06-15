var helpers = require('../../test/setup/functions'),
    app = require('../index'),
    DiffModel = require('./model'),
    expect = require('chai').expect,
    request = require('supertest')(app);

describe('Diff API ', function () {

    var assets = [{
        name: 'test-run-1',
        candidate: 'someCandidateId',
        baseline: 'someBaselineId',
        data: 'somekindofbase64image'
    },
    {
        name: 'test-run-2',
        candidate: 'anotherCandidateId',
        baseline: 'someBaselineId',
        data: 'anotherofbase64image'
    }];
    var insertedAssets;

    before(function (done) {
        helpers.insertAssets(DiffModel, assets, function (results) {
            insertedAssets = results;
            done();
        });
    });

    after(function (done) {
        helpers.removeAssets(DiffModel, {}, function () {
            done();
        });
    });
    
    it('/api/diff/:name should list all diffs with the specified name in json format', function (done) {
        request.get('/api/diff/test-run-1')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                expect(res.body.length).to.equal(1);
                done();
            });
    });    

    it('/api/diff/:name/:id/raw should render the specific diff image', function (done) {

        var firstAsset = insertedAssets[0];
        request.get('/api/diff/' + firstAsset.name + '/' + firstAsset._id + '/raw')
            .expect('Content-Type', /image/)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                done();
            });
    });
    
    it('/api/diff/:name/:id/raw should 404 if no diff found', function (done) {

        request.get('/api/diff/letsMakeUpAName/withAnEquallyMadeUpId/raw')
            .expect(404)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                done();
            });
    });

});
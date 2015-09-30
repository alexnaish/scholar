var helpers = require('../../test/setup/functions'),
    app = require('../index'),
    CandidateModel = require('./model'),
    expect = require('chai').expect,
    request = require('supertest')(app);

describe('Candidate API ', function () {

    var assets = [{
        name: 'test-run-1',
        data: 'somekindofbase64image'
    }];
    var insertedAssets;

    before(function (done) {
        helpers.insertAssets(CandidateModel, assets, function (results) {
            insertedAssets = results;
            done();
        });
    });

    after(function (done) {
        helpers.removeAssets(CandidateModel, {}, function () {
            done();
        });
    });

    it('/api/candidate/:name/:id/raw should render the specific candidate image', function (done) {

        var firstAsset = insertedAssets[0];
        request.get('/api/candidate/' + firstAsset.name + '/' + firstAsset._id + '/raw')
            .expect('Content-Type', /image/)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                done();
            });
    });
    
    it('/api/candidate/:name/:id/raw should 404 if no candidate found', function (done) {

        request.get('/api/candidate/letsMakeUpAName/withAnEquallyMadeUpId/raw')
            .expect(404)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                done();
            });
    });
    

});
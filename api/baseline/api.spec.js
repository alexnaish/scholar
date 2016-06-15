var helpers = require('../../test/setup/functions'),
    app = require('../index'),
    BaselineModel = require('./model'),
    BaselineService = require('./service'),
    sinon = require('sinon'),
    _ = require('lodash'),
    expect = require('chai').expect,
    request = require('supertest')(app);

describe('Baseline API', function () {

    var assets = [
        {
            name: 'test-run-1',
            meta: {
              browser: 'test-browser',
              resolution: '1337x420'
            },
            data: 'somekindofbase64image'
        },
        {
            name: 'test-run-2',
            data: 'anotherbase64image'
        },
        {
            name: 'test-run-3',
            data: 'thirdbase64image'
        }];
    var insertedAssets;

    before(function (done) {
        helpers.removeAssets(BaselineModel, {}, function () {
            helpers.insertAssets(BaselineModel, assets, function (results) {
                insertedAssets = results;
                done();
            });
        });
    });

    after(function (done) {
        helpers.removeAssets(BaselineModel, {}, function () {
            done();
        });
    });

    it('/api/baseline should list all baselines', function (done) {
        request.get('/api/baseline')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                expect(res.body.length).to.equal(insertedAssets.length);

                var specificBaseline = _.find(res.body, function(b) { return b._id === 'test-run-1'; });
                expect(specificBaseline).to.not.equal(undefined);
                expect(specificBaseline).to.have.property('_id');
                expect(specificBaseline).to.have.property('dateCreated');
                expect(specificBaseline).to.have.property('lastUpdated');
                expect(specificBaseline).to.have.property('lastUpdatedBy');
                expect(specificBaseline).to.have.property('results');

                var firstResult = specificBaseline.results[0];
                expect(firstResult).to.have.property('browser');
                expect(firstResult).to.have.property('resolution');
                expect(firstResult).to.have.property('labels');
                done();
            });
    });

    it('/api/baseline should return a standard server error if an error occurs', function (done) {

        var serviceStub = sinon.stub(BaselineService, 'list').yields({message: 'error'}, null);

        request.get('/api/baseline')
            .expect('Content-Type', /json/)
            .expect(500)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                expect(res.body).to.have.property('error');
                serviceStub.restore();
                done();
            });

    });

    it('/api/baseline/:name should list all baselines with the specified name', function (done) {

        const insertedAsset = _.find(insertedAssets, {name: 'test-run-1'});
        request.get(`/api/baseline/${insertedAsset.name}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                expect(res.body).to.have.property('length', 1);
                expect(res.body[0]).to.have.property('name', 'test-run-1');
                done();
            });
    });

    it('/api/baseline/:name should return a standard server error if an error occurs', function (done) {

        var serviceStub = sinon.stub(BaselineService, 'find').yields({message: 'error'}, null);

        const insertedAsset = _.find(insertedAssets, {name: 'test-run-1'});
        request.get(`/api/baseline/${insertedAsset.name}`)
            .expect('Content-Type', /json/)
            .expect(500)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                expect(res.body).to.have.property('error');
                serviceStub.restore();
                done();
            });
    });

    it('/api/baseline/:name/raw should render the baselined image', function (done) {
        var firstAsset = insertedAssets[0];
        request.get('/api/baseline/' + firstAsset._id + '/raw')
            .expect('Content-Type', /image/)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                done();
            });
    });

    it('/api/baseline/:name/raw should 404 if no baseline found', function (done) {
        request.get('/api/baseline/thisDoesntExist/raw')
            .expect(404)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                done();
            });
    });

});

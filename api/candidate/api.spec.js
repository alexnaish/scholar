var helpers = require('../../test/setup/functions');
var app = require('../index');
var CandidateModel = require('./model');
var expect = require('chai').expect;
var _ = require('lodash');
var sinon = require('sinon');
var request = require('supertest')(app);

describe('Candidate API ', function() {

  var assets = [{
    name: 'test-run-1',
    data: 'somekindofbase64image'
  }, {
    name: 'test-run-2',
    data: 'anotherkindofbase64image'
  }];
  var insertedAssets;

  before(function(done) {
    helpers.insertAssets(CandidateModel, assets, function(results) {
      insertedAssets = results;
      done();
    });
  });

  after(function(done) {
    helpers.removeAssets(CandidateModel, {}, function() {
      done();
    });
  });

  it('/api/candidate/:name/:id/raw should render the specific candidate image', function(done) {

    var firstAsset = insertedAssets[0];
    request.get('/api/candidate/' + firstAsset.name + '/' + firstAsset._id + '/raw')
      .expect('Content-Type', /image/)
      .expect(200)
      .end(function(err, res) {
        expect(err).to.equal(null);
        expect(res).to.not.equal(null);
        done();
      });
  });

  it('/api/candidate/:name/:id/raw should 404 if no candidate found', function(done) {

    request.get('/api/candidate/letsMakeUpAName/withAnEquallyMadeUpId/raw')
      .expect(404)
      .end(function(err, res) {
        expect(err).to.equal(null);
        expect(res).to.not.equal(null);
        done();
      });
  });

  it('/api/candidate should return a 200 status and an array of outstanding candidate names', function(done) {

    request.get('/api/candidate')
      .expect(200)
      .end(function(err, res) {
        expect(err).to.equal(null);
        expect(res.body).to.have.members(_.map(insertedAssets, 'name'));
        expect(res.body.length).to.equal(insertedAssets.length);
        done();
      });
  });

  it('/api/candidate should return a 500 status and an error message if an error occurs', function(done) {
    var errorMessage = 'Something went wrong!';
    var CandidateService = require('./service');
    var errorStub = sinon.stub(CandidateService, 'findDistinct').yields({message: errorMessage}, null);

    request.get('/api/candidate')
      .expect(500)
      .end(function(err, res) {
        expect(err).to.equal(null);
        expect(res.body).to.have.property('error', errorMessage);
        CandidateService.findDistinct.restore();
        done();
      });
  });


});

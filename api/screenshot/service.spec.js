var BaselineService = require('../baseline/service');
var CandidateService = require('../candidate/service');
var DiffService = require('../diff/service');
var sinon = require('sinon');
var SnapshotService = require('./service');
var expect = require('chai').expect;


describe('Screenshot Service', function() {

  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('saveAndCompare', function(done) {
    done();
  });

  it('promoteCandidateToBaseline', function(done) {
    done();
  });

  it('deleteSnapshot returns a 404 and a blank object if diff doesnt exist', function(done) {

    var findStub = sandbox.stub(DiffService, 'findOne').yields(null, null);

    SnapshotService.deleteSnapshot('someDiffId', function(statusCode, data) {
      expect(findStub.called).to.equal(true);
      expect(statusCode).to.equal(404);
      expect(data).to.be.empty;
      done();
    });

  });

  it('extractMetadata should return a mapped metadata object from the headers passed in', function() {
    var browser = 'Chrome';
    var resolution = '1280x720';

    var headers = {
      'content-type': 'application/json',
      'x-scholar-meta-browser': browser,
      'x-scholar-meta-resolution': resolution,
      'connection': 'close'
    }

    var metadata = SnapshotService.extractMetadata(headers);
    expect(metadata.browser).to.equal(browser);
    expect(metadata.resolution).to.equal(resolution);
  });

  it('extractMetadata should set metadata to undefined if no headers passed in', function() {
    var headers = null;

    var metadata = SnapshotService.extractMetadata(headers);
    expect(metadata.browser).to.equal(undefined);
    expect(metadata.resolution).to.equal(undefined);
  });


});

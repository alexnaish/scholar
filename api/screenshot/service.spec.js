var BaselineService = require('../baseline/service'),
    CandidateService = require('../candidate/service'),
    DiffService = require('../diff/service'),
    sinon = require('sinon'),
    SnapshotService = require('./service'),
    expect = require('chai').expect;
    

describe('Screenshot Service', function () {
    
    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('saveAndCompare', function (done) {
        done();
    });

    it('promoteCandidateToBaseline', function (done) {
        done();
    });

    it('deleteSnapshot returns a 404 and a blank object if diff doesnt exist', function (done) {
        
        var findStub = sandbox.stub(DiffService, 'findOne').yields(null, null);
        
        SnapshotService.deleteSnapshot('someDiffId', function(statusCode, data){
            expect(findStub.called).to.equal(true);
            expect(statusCode).to.equal(404);
            expect(data).to.be.empty;
            done();
        });
        
    });
    



});

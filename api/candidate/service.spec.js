var sinon = require('sinon'),
    CandidateService = require('./service'),
    CandidateModel = require('./model'),
    expect = require('chai').expect;

describe('Candidate Service', function () {

    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('findOne returns a null error and a specific baseline if successful', function (done) {
        var findStub = sandbox.stub(CandidateModel, 'findOne').yields(null, {
            _id: 'someId',
            name: 'test'
        });
        CandidateService.findOne('someId', '', function (error, result) {
            expect(findStub.calledOnce).to.be.true;
            expect(error).to.equal(null);
            expect(result).to.not.equal(null);
            expect(result._id).to.equal('someId');
            expect(result.name).to.equal('test');
            done();
        });
    });

    it('findOne returns a null error and a null result if no result is found', function (done) {
        var findStub = sandbox.stub(CandidateModel, 'findOne').yields(null, null);
        CandidateService.findOne('someId', '', function (statusCode, result) {
            expect(findStub.calledOnce).to.be.true;
            expect(statusCode).to.equal(null);
            expect(result).to.equal(null);
            done();
        });
    });

    it('save adds a new candidate record and passes save result to callback', function (done) {
        var saveStub = sandbox.stub(CandidateModel.prototype, 'save').yields(null);
        var payload = {
            name: 'test',
            data: 'someBase64'
        };

        CandidateService.save(payload, function () {
            expect(saveStub.calledOnce).to.be.true;
            done();
        });
    });

    it('remove deletes any candidates matching query and passes results to callback', function (done) {
        var removeStub = sandbox.stub(CandidateModel, 'remove').yields(null, {
            status: 'some result'
        });

        CandidateService.remove({
            query: 'goes here'
        }, function (err, result) {

            expect(removeStub.calledOnce).to.be.true;
            expect(result.status).to.equal('some result');
            done();
        });
    });

});

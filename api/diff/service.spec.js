var sinon = require('sinon'),
    DiffService = require('./service'),
    DiffModel = require('./model'),
    expect = require('chai').expect;

describe('Diff Service', function () {

    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('find returns a 200 and a list of all Diffs if successful', function (done) {
        var findStub = sandbox.stub(DiffModel, 'find').yields(null, [
            {
                _id: 1,
                name: 'test1'
            },
            {
                _id: 2,
                name: 'test2'
            }
        ]);
        DiffService.find('someName', function (statusCode, results) {
            expect(findStub.calledOnce).to.be.true;
            expect(statusCode).to.equal(200);
            expect(results.length).to.equal(2);
            done();
        });
    });

    it('find returns a 500 if theres an error', function (done) {
        var findStub = sandbox.stub(DiffModel, 'find').yields({
            message: 'WOAH'
        }, null);
        DiffService.find('someName', function (statusCode, results) {
            expect(findStub.calledOnce).to.be.true;
            expect(statusCode).to.equal(500);
            expect(results).to.equal(null);
            done();
        });
    });

    it('findOne returns a 200 and a specific Diff if successful', function (done) {
        var findStub = sandbox.stub(DiffModel, 'findOne').yields(null, {
            _id: 'someId',
            name: 'test'
        });
        DiffService.findOne('someId', '', function (statusCode, result) {
            expect(findStub.calledOnce).to.be.true;
            expect(statusCode).to.equal(200);
            expect(result).to.not.equal(null);
            expect(result._id).to.equal('someId');
            expect(result.name).to.equal('test');
            done();
        });
    });

    it('findOne returns a 404 if no result is found', function (done) {
        var findStub = sandbox.stub(DiffModel, 'findOne').yields(null, null);
        DiffService.findOne('someId', '', function (statusCode, result) {
            expect(findStub.calledOnce).to.be.true;
            expect(statusCode).to.equal(404);
            expect(result).to.equal(null);
            done();
        });
    });

    it('save adds a new Diff record and passes save result to callback', function (done) {
        
        var payload = {
            name: 'test',
            candidate: 'someId',
            data: 'someBase64'
        };
        var saveStub = sandbox.stub(DiffModel.prototype, 'save').yields(null, payload);

        DiffService.save(payload, function (err, result) {
            expect(err).to.equal(null);
            expect(result).to.have.property('name', 'test');
            expect(result).to.have.property('candidate', 'someId');
            expect(result).to.have.property('data', 'someBase64');
            expect(saveStub.calledOnce).to.be.true;
            done();
        });
    });
    
    it('save should call toObject and return the JSON when a mongoose object is returned', function (done) {
        var toObjectStub = sinon.stub()
        var payload = {
            name: 'test',
            candidate: 'someId',
            data: 'someBase64',
            toObject: toObjectStub
        };
        toObjectStub.returns(payload);
        
        var saveStub = sandbox.stub(DiffModel.prototype, 'save').yields(null, payload);

        DiffService.save(payload, function (err, result) {
            expect(err).to.equal(null);
            expect(toObjectStub.called).to.be.true;
            expect(result).to.have.property('name', 'test');
            expect(result).to.have.property('candidate', 'someId');
            expect(result).to.have.property('data', 'someBase64');
            expect(saveStub.calledOnce).to.be.true;
            done();
        });
    });

    it('remove deletes any Diffs matching query and passes results to callback', function (done) {
        var removeStub = sandbox.stub(DiffModel, 'remove').yields(null, {
            status: 'some result'
        });

        DiffService.remove({
            query: 'goes here'
        }, function (err, result) {

            expect(removeStub.calledOnce).to.be.true;
            expect(result.status).to.equal('some result');
            done();
        });
    });

});

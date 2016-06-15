var sinon = require('sinon'),
    BaselineService = require('./service'),
    BaselineModel = require('./model'),
    expect = require('chai').expect;

describe('Baseline Service', function () {

    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });


    it('list returns a null error and a list of all baselines if successful', function (done) {
        var aggregateStub = sandbox.stub(BaselineModel, 'aggregate').yields(null, [
            {
                _id: 'test1'
            },
            {
                _id: 'test2'
            }
        ]);
        BaselineService.list(function (error, results) {
            expect(aggregateStub.calledOnce).to.be.true;
            expect(error).to.equal(null);
            expect(results.length).to.equal(2);
            done();
        });
    });

    it('list returns the error if an error occurs', function (done) {

        var sampleError = {
            message: 'WOAH'
        };

        var aggregateStub = sandbox.stub(BaselineModel, 'aggregate').yields(sampleError, null);

        BaselineService.list(function (err, results) {
            expect(aggregateStub.calledOnce).to.be.true;
            expect(err).to.equal(sampleError);
            expect(results).to.equal(null);
            done();
        });
    });

    it('find returns an array of specific baselines if successful', function (done) {

        var query = {name: 'test'};
        var fields = '_id name';
        var findStub = sandbox.stub(BaselineModel, 'find').yields(null, [{
            _id: 'id',
            name: 'test'
        },{
            _id: 'id2',
            name: 'test2'
        }]);
        BaselineService.find(query, fields, function (err, result) {
            expect(findStub.calledOnce).to.be.true;
            expect(findStub.firstCall.args[0]).to.equal(query);
            expect(findStub.firstCall.args[1]).to.equal(fields);
            expect(err).to.equal(null);
            expect(result).to.not.equal(null);
            expect(result.length).to.equal(2);
            expect(result[0]).to.have.property('_id', 'id');
            expect(result[0]).to.have.property('name', 'test');
            done();
        });
    });

    it('find returns an error if an error occurs', function (done) {

        var error = {message: "baseline.find test error"};
        var findStub = sandbox.stub(BaselineModel, 'find').yields(error, null);

        BaselineService.find('test', '', function (error, result) {
            expect(findStub.calledOnce).to.be.true;
            expect(error).to.equal(error);
            expect(result).to.equal(null);
            done();
        });
    });

    it('findOne returns a 200 and a specific baseline if successful', function (done) {
        var findStub = sandbox.stub(BaselineModel, 'findOne').yields(null, {
            _id: 'id',
            name: 'test'
        });
        BaselineService.findOne({name: 'test'}, '', function (statusCode, result) {
            expect(findStub.calledOnce).to.be.true;
            expect(statusCode).to.equal(200);
            expect(result).to.not.equal(null);
            expect(result.name).to.equal('test');
            expect(result.raw).to.contain('/baseline/id/raw');
            done();
        });
    });

    it('findOne returns a 404 if no result is found', function (done) {
        var findStub = sandbox.stub(BaselineModel, 'findOne').yields(null, null);
        BaselineService.findOne('test', '', function (statusCode, result) {
            expect(findStub.calledOnce).to.be.true;
            expect(statusCode).to.equal(404);
            expect(result).to.equal(null);
            done();
        });
    });

    it('save removes baseline with the same name and then saves the new payload', function (done) {
        var removeStub = sandbox.stub(BaselineModel, 'remove').yields(null);
        var saveStub = sandbox.stub(BaselineModel.prototype, 'save').yields(null);
        var payload = {
            name: 'test',
            data: 'someBase64',
            meta: {
                browser: 'browser'
            }
        };

        BaselineService.save(payload, function () {
            expect(removeStub.calledOnce).to.be.true;
            expect(removeStub.firstCall.args[0].name).to.equal(payload.name);
            expect(saveStub.calledOnce).to.be.true;
            done();
        });
    });

});

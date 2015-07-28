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


    it('find returns a 200 and a list of all baselines if successful', function (done) {
        var findStub = sandbox.stub(BaselineModel, 'find').yields(null, [
            {
                name: 'test1'
            },
            {
                name: 'test2'
            }
        ]);
        BaselineService.find(function (statusCode, results) {
            expect(findStub.calledOnce).to.be.true;
            expect(statusCode).to.equal(200);
            expect(results.length).to.equal(2);
            done();
        });
    });

    it('find returns a 500 if theres an error', function (done) {
        var findStub = sandbox.stub(BaselineModel, 'find').yields({
            message: 'WOAH'
        }, null);
        BaselineService.find(function (statusCode, results) {
            expect(findStub.calledOnce).to.be.true;
            expect(statusCode).to.equal(500);
            expect(results).to.equal(null);
            done();
        });
    });

    it('findOne returns a 200 and a specific baseline if successful', function (done) {
        var findStub = sandbox.stub(BaselineModel, 'findOne').yields(null, {
            name: 'test'
        });
        BaselineService.findOne('test', '', function (statusCode, result) {
            expect(findStub.calledOnce).to.be.true;
            expect(statusCode).to.equal(200);
            expect(result).to.not.equal(null);
            expect(result.name).to.equal('test');
            expect(result.raw).to.not.be.undefined;
            expect(result.raw).to.contain('/baseline/test/raw');
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

    it('save', function (done) {
        var removeStub = sandbox.stub(BaselineModel, 'remove').yields(null);
        var saveStub = sandbox.stub(BaselineModel.prototype, 'save').yields(null);
        var payload = {
            name: 'test',
            data: 'someBase64'
        };

        BaselineService.save(payload, function () {
            expect(removeStub.calledOnce).to.be.true;
            expect(removeStub.firstCall.args[0].name).to.equal(payload.name);
            expect(saveStub.calledOnce).to.be.true;
            done();
        });
    });

});

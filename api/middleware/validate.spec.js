var Validate = require('./validate');
var sinon = require('sinon');
var expect = require('chai').expect;

describe('Validation Middleware', () => {

	var fakeRequest, fakeResponse, fakeNext;
	var sandbox, resJsonStub, resStatusStub;

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		fakeRequest = {
			params: {}
		};

		resJsonStub = sandbox.stub();
		resStatusStub = sandbox.stub();
		fakeResponse = {
			status: resStatusStub,
			json: resJsonStub
		}
		resStatusStub.returns(fakeResponse);
		fakeNext = sandbox.stub();
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should call next if no id parameter', () => {
        Validate.objectId(fakeRequest, fakeResponse, fakeNext);
        expect(resStatusStub.called).to.equal(false);
        expect(resJsonStub.called).to.equal(false);
        expect(fakeNext.called).to.equal(true);
	});

    var invalidIds = [
        { type: 'wrong length and characters', id: 'thisiswrong'},
        { type: 'wrong length and numbers', id: '123'},
        { type: 'wrong length and format', id: 'AWEAS123123ZZZZZ'},
        { type: 'right length but invalid characters', id: 'ZZZZZZZZZZZZZZZZZZZZZZZZ'},
        { type: 'right length but containing symbols', id: 'AAAAAAAAAA(AAA)A!AA$AA$A'}
    ];

    invalidIds.forEach(function(scenario){
        it(`should return a 400 status code if id is: ${scenario.type}`, () => {
            fakeRequest.params.id = scenario.id;
            Validate.objectId(fakeRequest, fakeResponse, fakeNext);
            expect(resStatusStub.getCall(0).args[0]).to.equal(400);
            expect(resJsonStub.getCall(0).args[0]).to.have.property('error', 'Invalid ID');
            expect(fakeNext.called).to.equal(false);
    	});
    });

    it('should call next if valid id parameter', () => {
        fakeRequest.params.id = '123123123aaaaaaaaa123123';
        Validate.objectId(fakeRequest, fakeResponse, fakeNext);
        expect(resStatusStub.called).to.equal(false);
        expect(resJsonStub.called).to.equal(false);
        expect(fakeNext.calledOnce).to.equal(true);
	});

});

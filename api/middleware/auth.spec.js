var AuthMiddleware = require('./auth');
var sinon = require('sinon');
var expect = require('chai').expect;
var jwt = require('jsonwebtoken');

describe('Auth middleware', function () {

	var fakeRequest, fakeResponse, fakeNext;
	var sandbox, resJsonStub, resStatusStub, verifyStub;

	beforeEach(function (done) {
		sandbox = sinon.sandbox.create();
		verifyStub = sandbox.stub(jwt, 'verify');
		fakeRequest = {
			headers: {}
		};

		resJsonStub = sandbox.stub();
		resStatusStub = sandbox.stub();
		fakeResponse = {
			status: resStatusStub,
			json: resJsonStub
		}
		resStatusStub.returns(fakeResponse);
		fakeNext = sandbox.stub();
		done();
	});
	afterEach(function () {
		sandbox.restore();
	});

	it('should return a 401 if no token header present', function () {
		AuthMiddleware.requireValidToken(fakeRequest, fakeResponse, fakeNext);

		expect(resStatusStub.firstCall.args[0]).to.equal(401);
		expect(resJsonStub.firstCall.args[0]).to.have.property('error', 'Missing auth token');

	});

	it('should return a 400 if invalid token header present', function () {

		fakeRequest.headers.authorization = 'This wont work';
		verifyStub.yields({
			message: 'invalid'
		}, null);
		AuthMiddleware.requireValidToken(fakeRequest, fakeResponse, fakeNext);
		expect(resStatusStub.firstCall.args[0]).to.equal(400);
		expect(resJsonStub.firstCall.args[0]).to.have.property('error', 'Invalid auth token');

	});

	it('should call next after setting user property on request object if valid token exists', function () {
		var userObject = {firstName: 'test'};
		fakeRequest.headers.authorization = 'This wont work';
		verifyStub.yields(null, { user: userObject});
		AuthMiddleware.requireValidToken(fakeRequest, fakeResponse, fakeNext);
		expect(fakeNext.called).to.equal(true);
		expect(fakeRequest).to.have.property('user', userObject)
		expect(resStatusStub.called).to.equal(false);
		expect(resJsonStub.called).to.equal(false);
	});

});

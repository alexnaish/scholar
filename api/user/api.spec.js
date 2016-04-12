var helpers = require('../../test/setup/functions');
var app = require('../index');
var UserModel = require('./model');
var _ = require('lodash');
var sinon = require('sinon');
var expect = require('chai').expect;
var request = require('supertest')(app);

describe('Users API', function () {
	var assets = [{
		username: 'test1',
		firstName: 'first1',
		lastName: 'last1',
		email: 'test1@mail.com',
		password: 'test2'
	}, {
		username: 'test-2',
		firstName: 'first2',
		lastName: 'last2',
		email: 'test2@mail.com',
		password: 'test3'
	}, {
		username: 'test-3',
		firstName: 'first3',
		lastName: 'last3',
		email: 'test3@mail.com',
		password: 'test4'
	}];
	var insertedAssets;

	before(function (done) {
		helpers.removeAssets(UserModel, {}, function () {
			helpers.insertAssets(UserModel, assets, function (results) {
				insertedAssets = results;
				done();
			});
		});
	});

	after(function (done) {
		helpers.removeAssets(UserModel, {}, function () {
			done();
		});
	});

	it('/api/user should return 200 and a list of users with the correct fields', function (done) {

		request.get('/api/user')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.not.equal(null);
				var failure;
				var correctFormat = _.every(res.body, function (result) {
					var isValid = Object.keys(result).length === 4 && result.hasOwnProperty("_id") && result.hasOwnProperty("firstName") && result.hasOwnProperty("lastName") && result.hasOwnProperty("email");
					if (!isValid) {
						failure = result;
					}
					return isValid;
				});
				expect(correctFormat).to.equal(true, 'Object structure differed from expected. Returned: ' + JSON.stringify(failure));
				expect(res.body.length).to.equal(insertedAssets.length, 'Different number of returned results');
				done();
			});
	});

	it('/api/user should return a 500 and a standard error if something goes wrong', function (done) {
		var UserService = require('./service');
		var errorStub = sinon.stub(UserService, 'find').yields({
			message: 'who cares'
		}, null);

		request.get('/api/user')
			.expect('Content-Type', /json/)
			.expect(500)
			.end(function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.not.equal(null);
				expect(res.body).to.have.property('error', 'Internal Server Error');
				UserService.find.restore();
				done();
			});
	});

	it('/api/user/:id should return a 200 and a JSON object with the user information', function (done) {
		var specificUser = _.find(insertedAssets, {
			username: 'test-3'
		});
		request.get('/api/user/' + specificUser._id)
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.not.equal(null);
				expect(Object.keys(res.body).length).to.equal(5);
				expect(res.body).to.have.property('_id', specificUser._id.toString());
				expect(res.body).to.have.property('username', specificUser.username);
				expect(res.body).to.have.property('firstName', specificUser.firstName);
				expect(res.body).to.have.property('lastName', specificUser.lastName);
				expect(res.body).to.have.property('email', specificUser.email);
				expect(res.body).to.not.have.property('password');
				done();
			});
	});

	it('/api/user/:id should return a 404 and a standard error message', function (done) {
		request.get('/api/user/123123123123123123123123')
			.expect('Content-Type', /json/)
			.expect(404)
			.end(function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.not.equal(null);
				expect(res.body).to.have.property('error', 'No user found');
				done();
			});
	});

	it('/api/user/:id should return a 500 and a standard error if something goes wrong', function (done) {
		var UserService = require('./service');
		var errorStub = sinon.stub(UserService, 'findOne').yields({
			message: 'who cares'
		}, null);

		request.get('/api/user/123123123123123123123123')
			.expect('Content-Type', /json/)
			.expect(500)
			.end(function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.not.equal(null);
				expect(res.body).to.have.property('error', 'Internal Server Error');
				UserService.findOne.restore();
				done();
			});
	});

	it('/api/user/:id/avatar should return a 200x200 SVG image', function (done) {
		var specificUser = _.find(insertedAssets, {
			username: 'test-3'
		});
		request.get('/api/user/' + specificUser._id + '/avatar')
			.expect(200)
			.end(function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.not.equal(null);
				expect(res.text).to.include('<svg');
				expect(res.text).to.include('viewBox="0 0 200 200"');
				expect(res.text).to.include('</svg>');
				done();
			});
	});

});

var helpers = require('../../test/setup/functions');
var app = require('../index');
var UserModel = require('./model');
var _ = require('lodash');
var sinon = require('sinon');
var expect = require('chai').expect;
var request = require('supertest')(app);

describe.only('Users API', function () {
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

	// after(function (done) {
	// 	helpers.removeAssets(UserModel, {}, function () {
	// 		done();
	// 	});
	// });

	it('/api/user should return 200 and a list of users with the correct fields', function (done) {

		request.get('/api/user')
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function (err, res) {
				expect(err).to.equal(null);
				expect(res).to.not.equal(null);
                var failure;
				var correctFormat = _.every(res.body, function (result) {
                    var isValid = Object.keys(result).length === 4
                                    && result.hasOwnProperty("_id")
                                    && result.hasOwnProperty("firstName")
                                    && result.hasOwnProperty("lastName")
                                    && result.hasOwnProperty("email");
                    if(!isValid) {
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
        var errorStub = sinon.stub(UserService, 'find').yields({message: 'who cares'}, null);

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

});

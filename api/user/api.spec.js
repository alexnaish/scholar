var helpers = require('../../test/setup/functions');
var app = require('../index');
var UserModel = require('./model');
var UserService = require('./service');
var _ = require('lodash');
var sinon = require('sinon');
var jwt = require('jsonwebtoken');
var config = require('config');
var expect = require('chai').expect;
var request = require('supertest')(app);

describe('Users API', function () {
	var assets = [{
		username: 'test-1',
		firstName: 'first1',
		lastName: 'last1',
		email: 'test1@mail.com',
		password: 'test2test2'
	}, {
		username: 'test-2',
		firstName: 'first2',
		lastName: 'last2',
		email: 'test2@mail.com',
		password: '$2a$10$m/woUV57PjN/w/Af0P3RLOiGJ3Q91j3BYhSSMg4q5enrXduWl5EIO'
	}, {
		username: 'test-3',
		firstName: 'first3',
		lastName: 'last3',
		email: 'test3@mail.com',
		password: 'test4test4'
	}, {
		username: 'update-me',
		firstName: 'update',
		lastName: 'please',
		email: 'update@mail.com',
		password: 'update4update4'
	}];
	var insertedAssets;
	var generatedToken;
	before(function (done) {
		generatedToken = jwt.sign({}, config.app.secret);
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

	describe('GET', function () {

		it('/api/user should return 200 and a list of users with the correct fields', function (done) {

			request.get('/api/user')
				.set('Authorization', 'Bearer '+generatedToken)
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
			var errorStub = sinon.stub(UserService, 'find').yields({
				message: 'who cares'
			}, null);

			request.get('/api/user')
				.set('Authorization', 'Bearer '+generatedToken)
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
				.set('Authorization', 'Bearer '+generatedToken)
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
				.set('Authorization', 'Bearer '+generatedToken)
				.expect('Content-Type', /json/)
				.expect(404)
				.end(function (err, res) {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res.body).to.have.property('error', 'User not found');
					done();
				});
		});

		it('/api/user/:id should return a 500 and a standard error if something goes wrong', function (done) {
			var errorStub = sinon.stub(UserService, 'findOne').yields({
				message: 'who cares'
			}, null);

			request.get('/api/user/123123123123123123123123')
				.set('Authorization', 'Bearer '+generatedToken)
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
				.set('Authorization', 'Bearer '+generatedToken)
				.expect('Content-Type', /image\/svg/)
				.expect(200)
				.end(function (err, res) {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res.headers).to.have.property('cache-control', 'public, max-age=31557600');
					done();
				});
		});

		it('/api/user/:id/avatar should return a 404 if no user found', function (done) {
			request.get('/api/user/123123123123123123123123/avatar')
				.expect(404)
				.end(function (err, res) {
					expect(err).to.equal(null);
					done();
				});
		});

		it('/api/user/:id/avatar should return a 500 and a standard error if something goes wrong', function (done) {
			var errorStub = sinon.stub(UserService, 'avatar').yields({
				message: 'who cares'
			}, null);

			request.get('/api/user/123123123123123123123123/avatar')
				.set('Authorization', 'Bearer '+generatedToken)
				.expect('Content-Type', /json/)
				.expect(500)
				.end(function (err, res) {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res.body).to.have.property('error', 'Internal Server Error');
					UserService.avatar.restore();
					done();
				});
		});

	});

	describe('POST', function () {

		it('/api/user should return 201 and create a new user', function (done) {

			var validUser = {
				username: 'inserted1',
				firstName: 'inserted1',
				lastName: 'inserted1',
				email: 'inserted1@mail.com',
				password: 'insertedPassword'
			};

			request.post('/api/user')
				.set('Authorization', 'Bearer '+generatedToken)
				.send(validUser)
				.expect('Content-Type', /json/)
				.expect(201)
				.end(function (err, res) {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res.body).to.have.property('_id');
					expect(res.body).to.have.property('username');
					expect(res.body).to.have.property('firstName');
					expect(res.body).to.have.property('lastName');
					expect(res.body).to.have.property('email');
					expect(res.body).to.not.have.property('password');
					UserModel.findOne({
						email: validUser.email
					}, function (err, result) {
						expect(result).to.not.equal(null)
						expect(result.password).to.not.equal(validUser.password, 'Password should be hashed now')
						done();
					});
				});
		});

		it('/api/user should return 400 if payload is missing required data', function (done) {
			request.post('/api/user')
				.set('Authorization', 'Bearer '+generatedToken)
				.send({})
				.expect('Content-Type', /json/)
				.expect(400)
				.end(function (err, res) {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res.body).to.have.property('error', 'Must contain required fields');
					done();
				});
		});

		it('/api/user should return 400 if payload fails validation', function (done) {
			request.post('/api/user')
				.set('Authorization', 'Bearer '+generatedToken)
				.send({
					username: 'some!thing!invalid#here()',
					password: 'test',
					firstName: 'test',
					lastName: 'test',
					email: 'test@test.com'
				})
				.expect('Content-Type', /json/)
				.expect(400)
				.end(function (err, res) {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res.body.error).to.contain('Must pass validation');
					done();
				});
		});

		it('/api/user should return 409 if user email already taken', function (done) {
			var specificUser = _.find(insertedAssets, {
				username: 'test-1'
			});
			request.post('/api/user')
				.set('Authorization', 'Bearer '+generatedToken)
				.send(specificUser)
				.expect('Content-Type', /json/)
				.expect(409)
				.end(function (err, res) {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res.body).to.have.property('error', 'User already exists');
					done();
				});
		});

		it('/api/user should return standard 500 if a fetch error occurs', function (done) {
			var validUser = {
				username: 'inserted2',
				firstName: 'inserted2',
				lastName: 'inserted2',
				email: 'inserted2@mail.com',
				password: 'insertedPassword'
			};
			sinon.stub(UserService, 'findOne').yields({
				message: 'who cares'
			}, null);

			request.post('/api/user')
				.set('Authorization', 'Bearer '+generatedToken)
				.send(validUser)
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

		it('/api/user should return standard 500 if a create error occurs', function (done) {
			var validUser = {
				username: 'inserted2',
				firstName: 'inserted2',
				lastName: 'inserted2',
				email: 'inserted2@mail.com',
				password: 'insertedPassword'
			};

			var errorStub = sinon.stub(UserService, 'create').yields({
				message: 'who cares'
			}, null);

			request.post('/api/user')
				.set('Authorization', 'Bearer '+generatedToken)
				.send(validUser)
				.expect('Content-Type', /json/)
				.expect(500)
				.end(function (err, res) {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res.body).to.have.property('error', 'Internal Server Error');
					UserService.create.restore();
					done();
				});
		});

	});

	describe('PUT', function () {

		it('/api/user/:id should return updated user and 200 status if user successfully updated', function (done) {
			var specificUser = _.find(insertedAssets, {
				username: 'update-me'
			});
			var updatedLastName = 'ThisShouldUpdate';
			specificUser.lastName = updatedLastName;
			request.put('/api/user/' + specificUser._id)
				.set('Authorization', 'Bearer '+generatedToken)
				.send(specificUser)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function (err, res) {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res.body).to.have.property('lastName', updatedLastName);
					expect(res.body).to.not.have.property('password');
					done();
				});
		});

		it('/api/user/:id should return a 400 status if data is not valid', function (done) {
			var specificUser = _.find(insertedAssets, {
				username: 'update-me'
			});
			request.put('/api/user/' + specificUser._id)
				.set('Authorization', 'Bearer '+generatedToken)
				.send({})
				.expect('Content-Type', /json/)
				.expect(400)
				.end(function (err, res) {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res.body).to.have.property('error', 'Must contain required fields');
					done();
				});
		});

		it('/api/user/:id should return a 404 status if user not found', function (done) {
			var specificUser = _.find(insertedAssets, {
				username: 'update-me'
			});
			request.put('/api/user/123123123123123123123123')
				.set('Authorization', 'Bearer '+generatedToken)
				.send(specificUser)
				.expect('Content-Type', /json/)
				.expect(404)
				.end(function (err, res) {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res.body).to.have.property('error', 'User not found');
					done();
				});
		});

		it('/api/user/:id should return a standard 500 if error', function (done) {
			var specificUser = _.find(insertedAssets, {
				username: 'update-me'
			});

			sinon.stub(UserService, 'update').yields({
				message: 'who cares'
			}, null);

			request.put('/api/user/' + specificUser._id)
				.set('Authorization', 'Bearer '+generatedToken)
				.send(specificUser)
				.expect('Content-Type', /json/)
				.expect(500)
				.end(function (err, res) {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					expect(res.body).to.have.property('error', 'Internal Server Error');
					UserService.update.restore();
					done();
				});
		});


	});

	describe('DELETE', function () {

		it('/api/user/:id should remove the user and return a 200 status code', function (done) {
			var specificUser = _.find(insertedAssets, {
				username: 'test-1'
			});
			request.delete('/api/user/' + specificUser._id)
				.set('Authorization', 'Bearer '+generatedToken)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function (err, res) {
					expect(err).to.equal(null);
					expect(res).to.not.equal(null);
					UserModel.findOne({
						_id: specificUser._id
					}, function (err, result) {
						expect(err).to.equal(null);
						expect(result).to.equal(null);
						done();
					});
				});
		});

		it('/api/user/:id should return a 404 if no user found', function (done) {
			request.delete('/api/user/123123123123123123123123')
				.set('Authorization', 'Bearer '+generatedToken)
				.expect('Content-Type', /json/)
				.expect(404)
				.end(function (err, res) {
					expect(err).to.equal(null);
					expect(res.body).to.have.property('error', 'User not found');
					done();
				});
		});

		it('/api/user/:id should return a standard 500 if lookup fails', function (done) {

			sinon.stub(UserService, 'findOne').yields({
				message: 'who cares'
			}, null);

			request.delete('/api/user/123123123123123123123123')
				.set('Authorization', 'Bearer '+generatedToken)
				.expect('Content-Type', /json/)
				.expect(500)
				.end(function (err, res) {
					expect(err).to.equal(null);
					expect(res.body).to.have.property('error', 'Internal Server Error');
					UserService.findOne.restore();
					done();
				});
		});

		it('/api/user/:id should return a standard 500 if deletion fails', function (done) {
			var specificUser = _.find(insertedAssets, {
				username: 'test-2'
			});
			sinon.stub(UserService, 'delete').yields({
				message: 'who cares'
			}, null);

			request.delete('/api/user/' + specificUser._id)
				.set('Authorization', 'Bearer '+generatedToken)
				.expect('Content-Type', /json/)
				.expect(500)
				.end(function (err, res) {
					expect(err).to.equal(null);
					expect(res.body).to.have.property('error', 'Internal Server Error');
					UserService.delete.restore();
					done();
				});
		});

	});

	describe('GENERATE TOKEN', function () {

		it('/user/token should generate a JWT token for a valid login', function (done) {
			var specificUser = _.find(insertedAssets, {
				username: 'test-2'
			});
			request.post('/api/user/token')
				.set('Authorization', 'Bearer '+generatedToken)
				.send({
					username: specificUser.username,
					password: 'test'
				})
				.expect('Content-Type', /json/)
				.expect(201)
				.end(function (err, res) {
					expect(err).to.equal(null);
					expect(res.body).to.have.property('token');
					var components = res.body.token.split('.');
					expect(components.length).to.equal(3);
					done();
				});
		});

		it('/user/token should return a 401 and error message if invalid details supplied', function (done) {

			request.post('/api/user/token')
				.set('Authorization', 'Bearer '+generatedToken)
				.send({
					username: 'madeupuser',
					password: 'test'
				})
				.expect('Content-Type', /json/)
				.expect(401)
				.end(function (err, res) {
					expect(err).to.equal(null);
					expect(res.body).to.have.property('error', 'Incorrect credentials');
					done();
				});
		});

		it('/user/token should return a standard 500 if an error occurs', function (done) {
			sinon.stub(UserService, 'checkLogin').yields({message: 'some error'}, null);

			request.post('/api/user/token')
				.set('Authorization', 'Bearer '+generatedToken)
				.send({
					username: 'someValue',
					password: 'test'
				})
				.expect('Content-Type', /json/)
				.expect(500)
				.end(function (err, res) {
					expect(err).to.equal(null);
					expect(res.body).to.have.property('error', 'Internal Server Error');
					UserService.checkLogin.restore();
					done();
				});
		});


	});

});

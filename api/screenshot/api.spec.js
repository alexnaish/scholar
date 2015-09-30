var helpers = require('../../test/setup/functions'),
    app = require('../index'),
    BaselineModel = require('../baseline/model'),
    CandidateModel = require('../candidate/model'),
    DiffModel = require('../diff/model'),
    expect = require('chai').expect,
    request = require('supertest')(app);


describe('Screenshot API', function () {

    after(function (done) {
        helpers.removeAssets(BaselineModel, {}, function () {
            helpers.removeAssets(CandidateModel, {}, function () {
                helpers.removeAssets(DiffModel, {}, function () {
                    done();
                });
            });
        });
    });

    it('POST /api/screenshot/:name save baseline image if new id', function (done) {

        var testName = 'test-image-name';
        var payload = {
            imageData: 'someMagicBase64Value'
        };

        request.post('/api/screenshot/' + testName)
            .send(payload)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                expect(err).to.equal(null);
                expect(res).to.not.equal(null);
                done();
            });
    });

    it('POST /api/screenshot/:name compare against baseline image if existing id', function (done) {
        done();
    });

    it('POST /api/screenshot/:name/promote/:id should promote a candidate to baseline', function (done) {
        done();
    });

    it('DEL /api/screenshot/:name/:diffId should delete diff and its candidate', function (done) {
        done();
    });

});

var sinon = require('sinon'),
    ImageService = require('./service'),
    resemble = require('../lib/resemble'),
    expect = require('chai').expect;

describe('Image Service', function () {

    var sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('compareImages', function (done) {

        var data = require('../../test/setup/samples/1by1');

        ImageService.compareImages(data, data, function (diffData) {
            expect(diffData).to.have.property('isSameDimensions');
            expect(diffData).to.have.property('dimensionDifference');
            expect(diffData).to.have.property('misMatchPercentage');
            expect(diffData).to.have.property('analysisTime');
            expect(diffData).to.have.property('getDiffImage');
            done();
        });
    });

    it('generateImage', function () {

        var setStub = sinon.stub();
        var statusStub = sinon.stub();
        var sendStub = sinon.stub();

        var res = {
            set: setStub,
            send: sendStub
        };

        res.status = statusStub.returns(res);

        ImageService.generateImage(res, 'someImageData');
        expect(setStub.called).to.equal(true);
        expect(statusStub.called).to.equal(true);
        expect(sendStub.called).to.equal(true);
    });

});

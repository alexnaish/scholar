'use strict';
const BaselineService = require('../baseline/service');
const CandidateService = require('../candidate/service');
const DiffService = require('../diff/service');
const sinon = require('sinon');
const SnapshotService = require('./service');
const expect = require('chai').expect;

describe('Screenshot Service', function () {

    let sandbox;

    let diffRemoveStub, candidateRemoveStub, baselineRemoveStub;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        diffRemoveStub = sandbox.stub(DiffService, 'remove').yields(null);
        candidateRemoveStub = sandbox.stub(CandidateService, 'remove').yields(null);
        baselineRemoveStub = sandbox.stub(BaselineService, 'remove').yields(null);
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('saveAndCompare', function (done) {
        done();
    });

    it('promoteCandidateToBaseline', function (done) {
        done();
    });

    it('deleteSnapshot returns a 404 and a blank object if diff doesnt exist', function (done) {

        let findStub = sandbox.stub(DiffService, 'findOne').yields(null, null);

        SnapshotService.deleteSnapshot('someDiffId', function (statusCode, data) {
            expect(findStub.called).to.equal(true);
            expect(statusCode).to.equal(404);
            expect(data).to.be.empty;
            done();
        });

    });

    it('extractMetadata should return a mapped metadata object from the headers passed in', function () {
        let browser = 'Chrome';
        let resolution = '1280x720';

        let headers = {
            'content-type': 'application/json',
            'x-scholar-meta-browser': browser,
            'x-scholar-meta-resolution': resolution,
            'connection': 'close'
        };

        let metadata = SnapshotService.extractMetadata(headers);
        expect(metadata.browser).to.equal(browser);
        expect(metadata.resolution).to.equal(resolution);
        expect(metadata).to.have.all.keys(['browser', 'resolution']);
    });

    it('extractMetadata should transform a the header value if a transform property is set', function () {
        let browser = 'Chrome';
        let resolution = '1280x720';
        let labels = 'some, test, string';

        let headers = {
            'x-scholar-meta-browser': browser,
            'x-scholar-meta-resolution': resolution,
            'x-scholar-meta-labels': labels
        };

        let metadata = SnapshotService.extractMetadata(headers);
        expect(metadata.browser).to.equal(browser);
        expect(metadata.resolution).to.equal(resolution);
        expect(metadata.labels).to.not.equal(labels);
        expect(metadata.labels.length).to.equal(3);
        expect(metadata.labels).to.include.members(['some', 'test', 'string']);
    });

    it('extractMetadata should set metadata to undefined if no headers passed in', function () {
        let headers = null;

        let metadata = SnapshotService.extractMetadata(headers);
        expect(metadata.browser).to.equal(undefined);
        expect(metadata.resolution).to.equal(undefined);
    });

    describe('removeAllScreenshots', () => {

        let testBaseline = {
            _id: 'someIdHere',
            name: 'test',
            meta: {
                browser: 'chrome'
            }
        };

        it('should attempt to remove candidates with the same name and browser as the baseline passed in', () => {

            SnapshotService.removeAllScreenshots(testBaseline, () => {
                expect(candidateRemoveStub.calledOnce).to.equal(true);
                let arg = candidateRemoveStub.firstCall.args[0];
                expect(arg).to.have.property('name', testBaseline.name);
                expect(arg).to.have.property('meta.browser', testBaseline.meta.browser);
            });

        });

        it('should attempt to remove diffs with the same name and browser as the baseline passed in', () => {

            SnapshotService.removeAllScreenshots(testBaseline, () => {
                expect(diffRemoveStub.calledOnce).to.equal(true);
                let arg = diffRemoveStub.firstCall.args[0];
                expect(arg).to.have.property('name', testBaseline.name);
                expect(arg).to.have.property('meta.browser', testBaseline.meta.browser);
            });

        });

        it('should attempt to remove the baseline passed in', () => {
            SnapshotService.removeAllScreenshots(testBaseline, () => {
                expect(baselineRemoveStub.calledOnce).to.equal(true);
                let arg = baselineRemoveStub.firstCall.args[0];
                expect(arg).to.have.property('_id', testBaseline._id);
            });
        });

        it('should not attempt to remove the baseline if an error occurs when attempting to remove candidates', () => {

            candidateRemoveStub.yields({message: 'AN ERROR OCCURED'}, null);
            SnapshotService.removeAllScreenshots(testBaseline, (err) => {
                expect(baselineRemoveStub.called).to.equal(false);
                expect(err).to.not.equal(null);
            });

        });

        it('should not attempt to remove the baseline if an error occurs when attempting to remove diffs', () => {
            diffRemoveStub.yields({message: 'AN ERROR OCCURED'}, null);
            SnapshotService.removeAllScreenshots(testBaseline, (err) => {
                expect(baselineRemoveStub.called).to.equal(false);
                expect(err).to.not.equal(null);
            });
        });

        it('should handle multiple errors', () => {
            diffRemoveStub.yields({message: 'A DIFF ERROR OCCURED'}, null);
            candidateRemoveStub.yields({message: 'A CANDIDATE ERROR OCCURED'}, null);

            SnapshotService.removeAllScreenshots(testBaseline, (err) => {
                expect(baselineRemoveStub.called).to.equal(false);
                expect(err).to.not.equal(null);
            });
        });

    });


});

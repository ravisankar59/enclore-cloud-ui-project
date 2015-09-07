var _ = require('lodash');
var Spec = require('./selectSpecs');
var config = require('./selectSpecs.config');
var expect = require('chai').expect;
var path = require('path');

var basePath = path.resolve(__dirname, '../stories/');
var changedFile = '/changedFile.js';

function formatPath(pathName) {
    return pathName + changedFile;
}

function formatPattern(pattern) {
    return path.join(basePath, pattern);
}

describe('Test configured patterns', function () {
    // Test each
    function makeTest(object, testPath) {
        if (_.isString(object)) {
            var testFile = formatPath(testPath);
            var pattern =  formatPattern(object);

            it('should return [\''  + object + '\'] when given [\'' + testFile + '\']', function () {
                var specs = Spec.selectSpecs([testFile], []);
                expect(specs).to.be.eql([pattern]);
            });
        }
        else {
            _.each(object, function(value, key) {
                var mergePath = testPath ? (testPath + '/' + key) : key;
                makeTest(value, mergePath);
            });
        }
    }

    makeTest(config.specPatterns);

    it('should return [\'' + config.defaultSpecPattern + '\'] when given [\'' + changedFile + '\']', function () {
        var specs = Spec.selectSpecs([changedFile], []);
        var pattern = formatPattern(config.defaultSpecPattern);
        expect(specs).to.be.eql([pattern]);
    });

    it('should properly reduce duplicate patterns', function () {
        var changedFileList = _.map([
            'app/scripts/cbs',
            'test/api-mocks/requests/cbs',
            'test/pages/cbs'
        ], formatPath);
        var patternList = _.map([
            'cbs/**/*.js'
        ], formatPattern);

        var specs = Spec.selectSpecs(changedFileList, []);
        expect(specs).to.be.eql(patternList);
    });

    it('should properly reduce catch all patterns', function () {
        var changedFileList = _.map([
            'app/scripts/cbs',
            'test/api-mocks/requests/support'
        ], formatPath);
        var patternList = _.map([
            '**/*.js'
        ], formatPattern);

        var specs = Spec.selectSpecs(changedFileList, []);
        expect(specs).to.be.eql(patternList);
    });

    it('should properly list multiple patterns for multiple, non-duplicate files', function () {
        var changedFileList = _.map([
            'app/scripts/cbs',
            'test/api-mocks/requests/databases',
            'test/pages/cdn'
        ], formatPath);
        var patternList = _.map([
            'cbs/**/*.js',
            'dbaas/**/*.js',
            'cdn/**/*.js'
        ], formatPattern);

        var specs = Spec.selectSpecs(changedFileList, []);
        expect(specs).to.be.eql(patternList);
    });
});

describe('Test keyword patterns', function () {
    function makeTest(keywordPatterns) {
        _.each(keywordPatterns, function (object, keyword) {
            if (keyword === '%noall%') {
                return true;
            }
            var pattern = formatPattern(object);

            it('should return [\''  + object + '\'] when given [\'' + keyword + '\']', function () {
                var specs = Spec.selectSpecs([], [keyword]);
                expect(specs).to.be.eql([pattern]);
            });
        });
    }

    makeTest(config.keywordPatterns);

    it('should properly list multiple patterns for multiple keywords', function () {
        var keywordList = [
            '%cbs%',
            '%cdn%',
            '%dbaas%'
        ];

        var patternList = _.map([
            'cbs/**/*.js',
            'cdn/**/*.js',
            'dbaas/**/*.js'
        ], formatPattern);

        var specs = Spec.selectSpecs([], keywordList);
        expect(specs).to.be.eql(patternList);
    });

    it('should properly reduce the %all% keyword', function () {
        var keywordList = [
            '%cbs%',
            '%cdn%',
            '%dbaas%',
            '%all%'
        ];

        var patternList = _.map([
            '**/*.js'
        ], formatPattern);

        var specs = Spec.selectSpecs([], keywordList);
        expect(specs).to.be.eql(patternList);
    });

    it('should properly handle the %noall% keyword', function () {
        var keywordList = [
            '%cbs%',
            '%cdn%',
            '%dbaas%',
            '%all%',
            '%noall%'
        ];

        var patternList = _.map([
            'cbs/**/*.js',
            'cdn/**/*.js',
            'dbaas/**/*.js'
        ], formatPattern);

        var specs = Spec.selectSpecs([], keywordList);
        expect(specs).to.be.eql(patternList);
    });
});

describe('Test both patterns', function () {
    it('should work with both files and keywords', function () {
        var changedFileList = _.map([
            'app/scripts/cbs',
            'test/api-mocks/requests/cdn'
        ], formatPath);

        var keywordList = [
            '%dbaas%',
        ];

        var patternList = _.map([
            'cbs/**/*.js',
            'cdn/**/*.js',
            'dbaas/**/*.js'
        ], formatPattern);

        var specs = Spec.selectSpecs(changedFileList, keywordList);
        expect(specs).to.be.eql(patternList);
    });

    it('should reduce with both files and keywords', function () {
        var changedFileList = _.map([
            'app/scripts/cbs',
            'test/api-mocks/requests/cdn'
        ], formatPath);

        var keywordList = [
            '%dbaas%',
            '%cdn%',
            '%cbs%'
        ];

        var patternList = _.map([
            'cbs/**/*.js',
            'cdn/**/*.js',
            'dbaas/**/*.js'
        ], formatPattern);

        var specs = Spec.selectSpecs(changedFileList, keywordList);
        expect(specs).to.be.eql(patternList);
    });

    it('should reduce with both files and the %all% keyword', function () {
        var changedFileList = _.map([
            'app/scripts/cbs',
            'test/api-mocks/requests/cdn'
        ], formatPath);

        var keywordList = [
            '%dbaas%',
            '%cdn%',
            '%all%'
        ];

        var patternList = _.map([
            '**/*.js'
        ], formatPattern);

        var specs = Spec.selectSpecs(changedFileList, keywordList);
        expect(specs).to.be.eql(patternList);
    });

    it('should reduce with both an unmatched file and keywords', function () {
        var changedFileList = _.map([
            '',
            'test/api-mocks/requests/cdn'
        ], formatPath);

        var keywordList = [
            '%dbaas%',
            '%cdn%',
            '%cbs%'
        ];

        var patternList = _.map([
            '**/*.js'
        ], formatPattern);

        var specs = Spec.selectSpecs(changedFileList, keywordList);
        expect(specs).to.be.eql(patternList);
    });

    it('should reduce with both an unmatched file and %noall% keyword', function () {
        var changedFileList = _.map([
            '',
            'test/api-mocks/requests/cbs'
        ], formatPath);

        var keywordList = [
            '%cdn%',
            '%dbaas%',
            '%noall%'
        ];

        var patternList = _.map([
            'cbs/**/*.js',
            'cdn/**/*.js',
            'dbaas/**/*.js'
        ], formatPattern);

        var specs = Spec.selectSpecs(changedFileList, keywordList);
        expect(specs).to.be.eql(patternList);
    });
});

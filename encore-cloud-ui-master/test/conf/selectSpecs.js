/**
 * Get a list of spec files matching the list of changed files in this PR
 * @module selectSpec
 */

/**
 * Dependencies
 */
//var _ = require('lodash');
var path = require('path');
var _ = require('lodash');
var config = require('./selectSpecs.config');

/**
 * Convenience function to convert heirarchical object to flat paths. Iterates through
 * the tree recursively flattening each branch.
 * @private
 * @param {Object.<Object>} specPatterns - The associative list of spec patterns/paths
 * @param {String} prefix - The prefix path, mostly used on recursive calls
 * @return {Object.<String>}
 */
function buildSpecPatterns(specPatterns, prefix) {
    return _.reduce(specPatterns, function (acc, value, key) {
        var mergePrefix = prefix ? (prefix + '/' + key) : key;

        if(_.isString(value)) {
            acc[mergePrefix] = value;
        }
        else {
            _.merge(acc, buildSpecPatterns(value, mergePrefix));
        }

        return acc;
    }, {});
}

/**
 * Associates a list of changed files with spec files in a pattern tree by
 * testing if each filename contains any of the specPatterns.  This function
 * makes use of buildSpecPatterns as a convenience function.
 * @private
 * @param {Array.<string>} changedFiles - The list of changed files in this PR
 * @return {Array.<string>}
 */
function getSpecsByMatrix(changedFiles) {
    var specPatterns = buildSpecPatterns(config.specPatterns);
    var specList = [];

    _.each(changedFiles, function (changedFile) {
        var pattern = _.find(specPatterns, function (value, key) {
            return (changedFile.indexOf(key) === 0);
        });

        if (pattern) {
            specList.push(pattern);
        }
        else {
            specList.push(config.defaultSpecPattern);
        }
    });

    return specList;
}

/**
 * Get a list of spec files based on keywords found in the commit message by testing
 * if each keyword is present in the keywordPatterns list.
 * @private
 * @param {Array.<string>} keywords - The list of keywords in the PR's commit message
 * @return {Array.<string>}
 */
function getSpecsByKeywords(keywords) {
    var specList = [];

    _.each(keywords, function (keyword) {
        var pattern = config.keywordPatterns[keyword];

        if (pattern) {
            specList.push(pattern);
        }
    });

    return specList;
}

/**
 * Reduce the list of specs to avoid duplication.  First uniquify the list, then
 * resolve the %noall% pattern, and finally reduce if the %all% pattern exists.
 * @private
 * @param {Array.<string>} specs - The list of spec patterns that we want to reduce
 * @return {Array.<string>}
 */
function reduceSpecs(specs) {
    specs = _.uniq(specs);

    if (_.contains(specs, '-**/*.js')) {
        specs = _.without(specs, '**/*.js','-**/*.js');
    }
    if (_.contains(specs, '**/*.js')) {
        specs = ['**/*.js'];
    }

    return specs;
}

/**
 * Transform the list of specs to include the test path.
 * @private
 * @param {Array.<string>} specs - The list of spec patterns that we want to trasnform
 * @return {Array.<string>}
 */
function addBasepathToSpecs(specs) {
    return _.map(specs, function (spec) {
        return path.join(config.basePath, spec);
    });
}

/**
 * Entry point for the module
 * @param {Array.<string>} changedFiles - The list of changed files in this PR
 * @param {Array.<string>} keywords - The list of keywords in the PR's commit message
 * @return {Array.<string>}
 */
function selectSpecs(changedFiles, keywords) {
    var specs = [config.defaultSpecPattern]; // Default if there's no keywords/changedFiles

    if (changedFiles || keywords) {
        specs = getSpecsByMatrix(changedFiles);
        specs = _.union(specs, getSpecsByKeywords(keywords));
        specs = reduceSpecs(specs);
    }

    specs = addBasepathToSpecs(specs);
    return specs;
}

module.exports = {
    selectSpecs: selectSpecs
};

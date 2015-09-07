// CloudUIReporter - Spec file for Cloud UI
// Generates screenshots on failures, uses the spec console log, and xunit reports.
// XUnit code based on https://github.com/peerigon/xunit-file

/* jshint ignore:start */

/**
 * Module dependencies.
 */

var mocha  = require('mocha'),
    Spec   = mocha.reporters.Spec,
    Base   = mocha.reporters.Base,
    fs     = require('fs-extra'),
    path   = require('path'),
    Entities = require('html-entities').AllHtmlEntities,
    entities = new Entities(),
    screenshotPath = 'test/screenshots/',
    xunitPath = 'test/xunit';

/**
 * Helper functions
 */
function processTest(test) {
    var attrs = {
        classname: test.parent.fullTitle(),
        name: test.title,
        time: test.duration ? test.duration / 1000 : 0
    };

    var testTag = null;

    if (test.state == 'failed') {
        var err = { message: entities.encode(String(test.err.message)) };
        var stack = cdata(test.err.stack);

        testTag = tag('failure', err, false, stack);
    } else if (test.pending) {
        delete attrs.time;
        testTag = tag('skipped', {}, true);
    }

    return tag('testcase', attrs, !testTag, testTag);
}

function tag(name, attrs, close, content) {
    var end = (!content && close) ? '/>' : '>',
        pairs = [],
        tag;

    for (var key in attrs) {
        pairs.push(key + '="' + entities.encode(String(attrs[key])) + '"');
    }

    tag = '<' + name + (pairs.length ? ' ' + pairs.join(' ') : '') + end;
    if (content) tag += content + '</' + name + end;
    return tag;
}

function cdata(str) {
    return '<![CDATA[' + entities.encode(String(str)) + ']]>';
}

function saveScreenshot(data, filename) {
    filename = filename.replace(/\W+/g,'_') + '.png';
    var filepath = path.resolve(screenshotPath, filename);

    var stream = fs.createOutputStream(filepath);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
};

function saveXUnit(data, filename) {
    filename = filename.replace(/\W+/g,'_') + '.xml';
    var filepath = path.resolve(xunitPath, filename);

    fs.outputFileSync(filepath, data);
}

function CloudUIReporter(runner) {
    Spec.call(this, runner);

    CloudUIXUnit.call(this, runner);

    runner.on('fail', function(test){
        browser.takeScreenshot().then(function (png) {
            saveScreenshot(png, test.fullTitle());
        });
    });
}

function CloudUIXUnit(runner) {
    var stats = this.stats,
        tests = [],
        self = this,
        suiteTitle = runner.suite.fullTitle();
        firstSuite = runner.suite.suites[0];

    // Guard against empty spec file
    suiteTitle = suiteTitle || (firstSuite && firstSuite.fullTitle());

    if(!suiteTitle) {
        return true;
    }

    runner.on('pass', function(test){
        tests.push(test);
    });

    runner.on('fail', function(test){
        tests.push(test);
    });

    runner.on('pending', function(test) {
        tests.push(test);
    });

    runner.on('end', function(){

        var content = tests.map(processTest).join('\n');
        var suite = tag('testsuite', {
            name: suiteTitle,
            tests: stats.tests,
            failures: stats.failures,
            errors: stats.failures,
            skipped: stats.tests - stats.failures - stats.passes,
            timestamp: (new Date).toUTCString(),
            time: stats.duration / 1000
        }, true, content);

        var xml = tag('testsuites', {}, false, suite);

        saveXUnit(xml, suiteTitle);
    });
}

/**
 * Inherit from `Base.prototype`.
 */

CloudUIReporter.prototype.__proto__ = Base.prototype;
CloudUIXUnit.prototype.__proto__ = Base.prototype;

exports = module.exports = CloudUIReporter;


/* jshint ignore:end */

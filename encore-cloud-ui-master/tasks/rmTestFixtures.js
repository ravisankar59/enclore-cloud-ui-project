process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
var _ = require('lodash');
var promise = require('bluebird');
var tf = require('../test/pages/test-fixtures/api');
var util = require('./test-automation/util');

module.exports = function (grunt) {
    var done;
    grunt.registerTask('remove-fixtures',
        'Removes all test fixtures from staging',
        removeFixtures);

    function removeFixtures () {
        env = util.getEnvironment(grunt.option('env'));
        removeAll = grunt.option('remove-all');
        base = require('./test-automation/baseFixture');
        done = this.async();
        var tasks = getTasks();

        var results = _.map(tasks, function (task) {
            return task();
        });

        promise.all(results)
            .then(outputResults)
            .error(function (err) {
                grunt.log.error('Error removing fixtures: ' + err);
            });

    }

    function getTasks () {
        var tasks = getTeardownComponents();
        // remove snapshots before volumes
        if (_.contains(tasks, 'volumes')) {
            tasks.push('snapshots');
        }

       tasks = _.transform(tasks, function (result, task) {
            var fixtures = require('./test-automation/components/' + task);
            fixtures = base(fixtures);
            result[task] = fixtures.teardown;
        }, {});

        if (_.has(tasks, 'snapshots')) {
            // remove snapshots prior to removing volumes
            var volumeTeardown = tasks['volumes'];
            var snapshotTeardown = tasks['snapshots'];
            tasks['volumes'] = function () {
                return snapshotTeardown().then(function () {
                    return volumeTeardown();
                });
            }
            delete tasks['snapshots'];
        }

        return tasks;
    }

    function getTeardownComponents() {
        var defaultBuild = [
            'firstgen',
            'nextgen',
            'volumes',
            'snapshots',
            'databases',
            'loadbalancers',
            'networks'
        ];
        var teardownOpts = grunt.option('fixtures');

        if (!_.isUndefined(teardownOpts)) {
            return teardownOpts.split(' ');
        }

        return defaultBuild;
    }

    function outputResults (components) {
        // #TODO Add better fixture reporting
        grunt.log.writeln('Fixtures Removed');
        done();
    }
};

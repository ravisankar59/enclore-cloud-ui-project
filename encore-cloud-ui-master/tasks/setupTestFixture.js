process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
var _ = require('lodash');
var promise = require('bluebird');
var tf = require('../test/pages/test-fixtures/api');
var util = require('./test-automation/util');

module.exports = function (grunt) {
    var done;
    grunt.registerTask('setup-fixtures',
        'Sets up staging for e2e testing',
        setupFixtures);

    function setupFixtures () {
        env = util.getEnvironment(grunt.option('env'));
        base = require('./test-automation/baseFixture');
        removeAll = false;
        done = this.async();
        var tasks = getTasks();

        var results = _.map(tasks, function (task) {
            return task();
        })

        promise.all(results)
            .then(outputResults)
            .error(function (err) {
                grunt.log.writeln('Error Building: ' + err);
            });
    }

    function getTasks () {
        var tasks = getBuildComponents();
        // build nextgen servers
        if (_.contains(tasks, 'loadbalancers')) {
            tasks.push('nextgen');
        }
        if (_.contains(tasks, 'snapshots')) {
            tasks.push('volumes');
        }

       tasks = _.transform(tasks, function (result, task) {
            var fixtures = require('./test-automation/components/' + task);
            fixtures = base(fixtures);
            result[task] = fixtures.build;
        }, {});

        if (_.has(tasks, 'snapshots')) {
            // build volumes prior to building snapshots
            var volumeBuild = tasks['volumes'];
            var snapshotBuild = tasks['snapshots'];
            tasks['snapshots'] = function () {
                return volumeBuild().then(function () {
                    return snapshotBuild();
                });
            }
            delete tasks['volumes'];
        }

        return tasks;
    }

    function getBuildComponents() {
        var defaultBuild = [
            'firstgen',
            'nextgen',
            'volumes',
            'snapshots',
            'databases',
            'loadbalancers',
            'networks'
        ];
        var buildOpts = grunt.option('fixtures');

        if (!_.isUndefined(buildOpts)) {
            return buildOpts.split(' ');
        }

        return defaultBuild;
    }

    function outputResults (components) {
        _.each(components, function (compBuild) {
            compBuild.fixtures.then(function (fixtures) {
                _.each(fixtures, function (fixture) {
                    grunt.log.writeln(fixture.status);
                });
            });
        });

        done();
    }
};

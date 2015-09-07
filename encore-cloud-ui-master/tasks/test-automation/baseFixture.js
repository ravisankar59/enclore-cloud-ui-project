var _ = require('lodash');
var promise = require('bluebird');
var tf = require('../../test/pages/test-fixtures/api');
var fxUtil = require('./fixtureUtil');
var url = require('./url');

module.exports = function generateFixture (fixtureOpts) {
    // This function creates the build and teardown functions
    // for a test fixture (i.e. servers, volumes, networks)

    function buildFixtures () {
        // Creates Fixtures and waits for them to become available
        var tasks = [
            fxUtil.fetchComponents(fixtureOpts.url),
            promise.resolve(fixtureOpts.fixtures)
        ];

        return promise.all(tasks).then(function (data) {
            var currentFixtures = data[0];
            var fixtures = data[1];

            // filter out DELETED load balancers
            if (fixtureOpts.type == 'Load Balancers') {
                currentFixtures = _.filter(currentFixtures, function(fixture) {
                    return (fixture.status.toLowerCase() != 'deleted');
                });
            }
            var createOpts = {
                type: fixtureOpts.type,
                fixtures: fixtures,
                currentFixtures: currentFixtures,
                url: fixtureOpts.url,
                nameKey: fixtureOpts.nameKey,
            };
            var waitOpts = {
                type: fixtureOpts.type,
                url: fixtureOpts.url,
                fixtures: fixtures,
                nameKey: fixtureOpts.nameKey,
                timeout: fixtureOpts.timeout
            };

            return fxUtil.createFixtures(createOpts).then(function (component) {
                return fxUtil.waitForActiveComponents(waitOpts).then(function (buildComponents) {
                    var rebuild = _.clone(fixtureOpts);
                    rebuild.status = fxUtil.status.rebuild;
                    rebuild.fixtures = _.where(buildComponents.fixtures, { status: 'error' });
                    if (!_.isEmpty(rebuild.fixtures) && rebuild.retries > 0) {
                        rebuild.retries--;
                        return fxUtil.rebuildFixtures(rebuild);
                    } else {
                        return promise.resolve(component);
                    }
                });
            });
        });
    }

    function teardownFixtures () {
        return fxUtil.fetchComponents(fixtureOpts.url).then(function (currentComponents) {

            // filter out DELETED load balancers
            if (fixtureOpts.type == 'Load Balancers') {
                currentComponents = _.filter(currentComponents, function(fixture) {
                    return (fixture.status.toLowerCase() != 'deleted');
                });
            }

            // Removes Fixtures and waits for removal to complete
            var removeOpts = {
                fixtures: currentComponents,
                url: fixtureOpts.url,
                nameKey: fixtureOpts.nameKey
            };

            // removeAll set as global in tasks/rmTestFixtures.js
            if (!removeAll) {
                removeOpts.fixtures = _.filter(removeOpts.fixtures, function (fixture) {
                    var fixtureName = fixture[fixtureOpts.nameKey];
                    return (String(fixtureName).indexOf('auto-') === 0);
                });
            }

            // Filter to ensure that we only try to remove test fixtures that failed to build
            if (fixtureOpts.status === fxUtil.status.rebuild) {
                removeOpts.fixtures = _.filter(removeOpts.fixtures, function (fixture) {
                    return _.find(fixtureOpts.fixtures, _.pick(fixture, fixtureOpts.nameKey));
                });
            }

            return fxUtil.removeFixtures(removeOpts).then(function (data) {
                var waitOpts = {
                    type: fixtureOpts.type,
                    url: fixtureOpts.url,
                    fixtures: removeOpts.fixtures,
                    nameKey: fixtureOpts.nameKey,
                    timeout: fixtureOpts.timeout
                };

                return fxUtil.waitForComponentsRemoval(waitOpts);
            });
        });
    }

    return {
        build: buildFixtures,
        teardown: teardownFixtures
    };
};

var _ = require('lodash');
var moment = require('moment');
var promise = require('bluebird');
var tf = require('../../test/pages/test-fixtures/api');
// 'env' is set in the setup/teardown scripts for staging/prod
var api = require('../../test/api-helper/api-helper')(env);
var util = require('./util');

module.exports = fxUtil = {
    componentCheckInterval: (30 * 1000),

    createFixtures: function createFixtures (opts) {
        // Creates fixtures based on values passed in the opts object
        // opts.nameKey: the value of the key containing the components
        //               name from the API
        // opts.url: component url for CRUD functions
        // opts.currentFixtures: Currently built test fixtures
        // opts.fixtures: Fixtures to be built
        var createdFixtures = promise.map(opts.fixtures, function(fixture) {
            var query = {};
            var fixtureName = fixture[opts.nameKey];
            query[opts.nameKey] = fixtureName;
            var currentFixture = _.find(opts.currentFixtures, query);
            var needsFixtureBuilt = _.isUndefined(currentFixture);
            if (needsFixtureBuilt) {
                var fixtureName = fixture[opts.nameKey]
                var request = {
                    url: opts.url,
                    method: 'POST',
                    body: JSON.stringify(_.omit(fixture, 'status'))
                };

                util.log('creating ' + fixtureName)
                return api(request).then(function success (res) {
                    return promise.resolve({
                        fixtureName: fixtureName,
                        statusCode: res.statusCode,
                        status: (_.isEqual(res.statusCode, 200)) ?
                            fixtureName + ' built' :
                            fixtureName + ' failed to build'
                    });
                });
            } else {
                var fixtureStatus = currentFixture[opts.nameKey] + ' is currently in ' + currentFixture.status + ' status';
                return promise.resolve({
                    fixtureName: currentFixture[opts.nameKey],
                    statusCode: 'n/a',
                    status: fixtureStatus
                });
            }
        }, { concurrent: 1 });

        return promise.resolve({
            type: opts.type,
            fixtures: createdFixtures
        });
    },

    removeFixtures: function removeFixtures (opts) {
        // Removes fixtures based on opts object
        // opts.fixtures: Fixtures to be removed
        // opts.nameKey: the value of the key containing the components
        //               name from the API
        // opts.url: component url for CRUD functions

        var results = promise.map(opts.fixtures, function (component) {
            var fixtureName = component[opts.nameKey]
            var removeOpts = {
                url: opts.url + String(component.id),
                method: 'DELETE'
            };

            util.log('removing ' + fixtureName);
            return api(removeOpts).then(function success (res) {
                var componentStatus = (res.statusCode == 200) ?
                    fixtureName + ' successfully removed':
                    'failed to remove ' + fixtureName;
                return {
                    componentName: fixtureName,
                    code: res.statusCode,
                    status: componentStatus,
                    body: res.body
                };
            }, function error (err) {
                util.log(err);
                return err;
            });
        }, { concurrent: 1 });

        return promise.resolve(results);
    },

    rebuildFixtures: function (componentConfig) {
        util.log('Attempting to rebuild fixtures in error state');
        var component = base(componentConfig);
        return component.teardown().then(function () {
            return component.build();
        });
    },

    fetchComponents: function fetchComponents (url) {
        // Fetches all componets
        var opts = {
            url: url,
            method: 'GET'
        };

        return api(opts).then(function success (res) {
            try {
                var body = JSON.parse(res.body);
                var components = body[_.first(_.keys(body))];
                return components;
            }
            catch (e) {
                return fxUtil.fetchComponents(url);
            }
        }, function error (err) {
            return fxUtil.fetchComponents(url);
        });
    },

    waitForComponents: function (checkFunction, opts) {
        // Waits for checkFunction to succeed on the given components
        // opts.url: url to get components
        // opts.type: type of fixture being built
        // opts.fixtures: fixtures that should have been built
        // opts.nameKey: name of the key that correlates with the components name
        // opts.timeout: timeout in ms

        return new promise(function (resolve, reject) {
            var elapsed = 0;
            var intervalID;
            var wait = function () {
                if (elapsed >= opts.timeout) {
                    var errStr = 'waiting for ' + opts.type + ' timed out after ' + (opts.timeout/1000) + ' s';
                    util.log(errStr);
                    clearInterval(intervalID);
                    return resolve(errStr);
                }

                fxUtil.fetchComponents(opts.url).then(function (currentFixtures) {
                    // filter out DELETED load balancers
                    if (opts.type == 'Load Balancers') {
                        currentFixtures = _.filter(currentFixtures, function(fixture) {
                            return (fixture.status.toLowerCase() != 'deleted');
                        });
                    }

                    opts.currentFixtures = currentFixtures;

                    opts.fixtures = _.map(opts.fixtures, function (fixture) {
                        var query = {};
                        query[opts.nameKey] = fixture[opts.nameKey];
                        var builtFixture = _.find(currentFixtures, query);
                        fixture.status = (_.isUndefined(builtFixture)) ? 'error' : (builtFixture.status || 'unknown').toLowerCase();
                        return fixture;
                    });
                    var ready = checkFunction(opts);

                    if (!_.contains(ready, false)) {
                        clearInterval(intervalID);
                        return resolve(opts);
                    }

                    var remainingComponents = _.filter(ready, function (isComponentReady) {
                        return isComponentReady === false;
                    });

                    elapsed += fxUtil.componentCheckInterval;
                    util.log('waiting for ' + remainingComponents.length + ' ' + opts.type + ' fixtures (' + (elapsed/1000) + ' s)');
                });
            }

            intervalID = setInterval(wait, fxUtil.componentCheckInterval);
        });
    },

    waitForActiveComponents: function (opts) {
        // Wraps waitForComponents, waits for created components to go live
        var areFixturesReady = function (opts) {
            // Returns an array representing the status of fixtures
            // true = ready, false = not ready, error = fixture built in error status
            return _.map(opts.fixtures, function (fixture) {
                var isOK = _.contains(['active', 'available', 'unknown'], fixture.status);
                if (_.contains(fixture.status, 'error')) {
                    return 'error';
                }

                return isOK;
            });
        };

        return fxUtil.waitForComponents(areFixturesReady, opts);
    },

    waitForComponentsRemoval: function (opts) {
        // Wraps waitForComponents, waits for created components to be removed
        var areFixturesRemoved = function (opts) {
            // Returns an array representing the status of fixtures
            // true = removed, false = not removed
            return _.map(opts.fixtures, function (fixture) {
                var query = {};
                query[opts.nameKey] = fixture[opts.nameKey];
                var currentFixture = _.find(opts.currentFixtures, query);
                return _.isUndefined(currentFixture);
            });
        };

        return fxUtil.waitForComponents(areFixturesRemoved, opts);
    },

    status: {
        rebuild: 'rebuilding'
    }
};

var baseApi = require('../baseApi');
var url = require('./lbaasUrls');

function fetchLbaas (api, opts) {
    var d = protractor.promise.defer();
    var req = {
        method: 'GET',
        url: url.getLoadBalancers(opts)
    };

    api(req).then(d.fulfill, d.reject);

    return d.promise;
}

function wait (api, lbName, status) {
    var intervalID;
    var fetch = fetchLbaas;
    var d = protractor.promise.defer();

    var check = function (lbName, status) {
        fetch(api).then(function (data) {
            var body = baseApi.bodyParse(data);
            if (body.error) {
                clearInterval(intervalID);
                d.reject({ error: 'Issues waiting | ' + JSON.stringify(body.error) });
            } else {
                var lbaas = _.find(body.loadBalancers, { name: lbName });
                if (_.isEmpty(lbaas)) {
                    clearInterval(intervalID);
                    d.reject({ error: 'Issues waiting | Unable to find load balancer' });
                }
                if (lbaas.status === status) {
                    clearInterval(intervalID);
                    d.fulfill();
                }
            }
        });
    };

    intervalID = setInterval(function () {
        check(lbName, status);
    }, 5000);

    return d.promise;
}

var lbaasApi = {
    getLoadBalancer: function (lbName, opts) {
        var d = this.deferred();
        var api = this.api;
        var err = 'Unable to fetch load balancer: ' + lbName;

        fetchLbaas(api, opts).then(function success (data) {
            var body = baseApi.bodyParse(data);
            if (body.error) {
                return d.reject({ error: err });
            }
            var lb = _.find(body.loadBalancers, { name: lbName });
            d.fulfill(lb);
        }, function error () {
            d.reject({ error: err });
        });

        return d.promise;
    },

    getConnectionThrottling: function (lbName, opts) {
        opts = opts || {};
        var d = this.deferred();
        var api = this.api;
        var err = 'Unable to fetch load balancer connection throttling: ' + lbName;

        lbaasApi.getLoadBalancer(lbName).then(function (lb) {
            opts.id = lb.id;
            var req = {
                method: 'GET',
                url: url.connectionThrottling(opts)
            };

            api(req).then(function (data) {
                var body = baseApi.bodyParse(data);
                if (body.error) {
                    d.reject(err);
                } else {
                    d.fulfill(body.connectionThrottle);
                }
            });
        });
        return d.promise;
    },

    getHealthMonitor: function (lbName, opts) {
        opts = opts || {};
        var d = this.deferred();
        var api = this.api;
        var err = 'Unable to fetch load balancer health monitor: ' + lbName;

        lbaasApi.getLoadBalancer(lbName).then(function (lb) {
            opts.id = lb.id;
            var req = {
                method: 'GET',
                url: url.healthMonitoring(opts)
            };

            api(req).then(function (data) {
                var body = baseApi.bodyParse(data);
                if (body.error) {
                    d.reject(err);
                } else {
                    d.fulfill(body.healthMonitor);
                }
            });
        });
        return d.promise;
    },

    toggleConnectionThrottling: function (opts, enableThrottling) {
        var d = this.deferred();
        var api = this.api;
        lbaasApi.getConnectionThrottling(opts.name).then(function (connectionThrottling) {

            var isInDesiredState = _.isEmpty(connectionThrottling) && !enableThrottling;

            if (isInDesiredState) {
                return d.fulfill('ready');
            }

            var req = {
                url: url.connectionThrottling(opts)
            };

            if (enableThrottling) {
                req.method = 'PUT';
                req.body = '{"maxConnections":1,"minConnections":1,"maxConnectionRate":1,"rateInterval":1}';
            } else {
                req.method = 'DELETE';
                req.body = '{}';
            }

            var errStr = 'Unable to toggle connection throttling status';
            api(req).then(function success (data) {
                var body = baseApi.bodyParse(data);
                if (body.error) {
                    return d.reject({ error: errStr + ': ' + JSON.stringify(body.error)});
                }
                d.fulfill('connection throttling toggled');
            }, function error () {
                d.reject({ error: errStr });
            });
        });

        return d.promise;
    },

    toggleHealthMonitoring: function (opts, enableMonitoring) {
        var d = this.deferred();
        var api = this.api;
        lbaasApi.getHealthMonitor(opts.name).then(function (healthMonitor) {

            var isInDesiredState = _.isEmpty(healthMonitor) && !enableMonitoring;

            if (isInDesiredState) {
                return d.fulfill('ready');
            }

            var req = {
                url: url.healthMonitoring(opts)
            };

            var body = {
                type: 'HTTP',
                delay: 10,
                timeout: 5,
                attemptsBeforeDeactivation: 2,
                path: '/',
                statusRegex: '/$/'
            };

            if (enableMonitoring) {
                req.method = 'PUT';
                req.body = JSON.stringify(body);
            } else {
                req.method = 'DELETE';
            }

            var errStr = 'Unable to toggle health monitoring status';
            api(req).then(function success (data) {
                var body = baseApi.bodyParse(data);
                if (body.error) {
                    return d.reject({ error: errStr + ': ' + JSON.stringify(body.error) });
                }
                d.fulfill('Health monitor toggled');
            }, function error () {
                d.reject({ error: errStr });
            });
        });

        return d.promise;
    },

    toggleConnectionLogging: function (opts, enableLogging) {
        var d = this.deferred();
        var loggingUrl = url.connectionLogging(opts);
        var req = {
            method: 'PUT',
            url: loggingUrl,
            body: JSON.stringify({ enabled: enableLogging })
        };

        var errStr = 'Unable to toggle connection logging status';
        this.api(req).then(function (data) {
            var body = baseApi.bodyParse(data);
            if (body.error) {
                return d.reject({ error: errStr + ': ' + JSON.stringify(body.error) });
            }
            d.fulfill('connection logging toggled');
        }, function error () {
            d.reject({ error: errStr });
        });

        return d.promise;
    },

    setConnectionLogging: function (lbName, enableLogging) {
        var d = this.deferred();
        var tasks = [
            lbaasApi.waitForActiveLoadBalancer(lbName),
            lbaasApi.getLoadBalancer(lbName)
        ];

        protractor.promise.all(tasks).then(function (data) {
            var lb = data[1];
            lbaasApi.toggleConnectionLogging({ id: lb.id }, enableLogging).then(function () {
                lbaasApi.waitForActiveLoadBalancer(lbName).then(function () {
                    d.fulfill('Connection Logging Set Successfully');
                });
            });
        });

        return d.promise;
    },

    setConnectionThrottling: function (lbName, enableThrottling) {
        var d = this.deferred();
        var tasks = [
            lbaasApi.waitForActiveLoadBalancer(lbName),
            lbaasApi.getLoadBalancer(lbName)
        ];

        protractor.promise.all(tasks).then(function (data) {
            var lb = data[1];
            lbaasApi.toggleConnectionThrottling(lb, enableThrottling).then(function () {
                lbaasApi.waitForActiveLoadBalancer(lbName).then(function () {
                    d.fulfill('ready');
                });
            });
        });
        return d.promise;
    },

    setHealthMonitoring: function (lbName, enableMonitoring) {
        var d = this.deferred();
        var tasks = [
            lbaasApi.waitForActiveLoadBalancer(lbName),
            lbaasApi.getLoadBalancer(lbName),
        ];

        protractor.promise.all(tasks).then(function (data) {
            var lb = data[1];
            lbaasApi.toggleHealthMonitoring(lb, enableMonitoring).then(function () {
                lbaasApi.waitForActiveLoadBalancer(lbName).then(d.fulfill);
            });
        });
        return d.promise;
    },

    waitForActiveLoadBalancer: function (lbName, status) {
        status = status || 'ACTIVE';
        var api = this.api;

        return wait(api, lbName, status);
    }
};

module.exports = baseApi.initialize(lbaasApi);

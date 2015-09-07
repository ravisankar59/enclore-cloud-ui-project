// var expect = require('chai').use(require('chai-as-promised')).expect;
var async = require('async');
var moment = require('moment');
var _ = require('lodash');
var loginPage = require('../pages/login.page');
var ptor = browser;
var routes = [
    '/cloud/hub_cap/servers',
    '/cloud/hub_cap/servers/ORD/6b2af55b-2e3a-43d7-bfe6-758ea39126c4',
    '/cloud/hub_cap/servers/create',
    '/cloud/hub_cap/cbs/volumes',
    '/cloud/hub_cap/cbs/volumes/ORD/5b11fb4b-3ac8-4da0-ad6e-5b35e6df6a39',
    '/cloud/hub_cap/cbs/volumes/create',
    '/cloud/hub_cap/cbs/snapshots',
    '/cloud/hub_cap/databases/instances',
    '/cloud/hub_cap/databases/instances/STAGING/432e170c-7cbd-4144-8da0-6d0a4c705ace',
    '/cloud/hub_cap/databases/instances/create',
    '/cloud/hub_cap/loadbalancers',
    '/cloud/hub_cap/loadbalancers/STAGING/59247',
    '/cloud/hub_cap/loadbalancers/create',
    '/cloud/hub_cap/networks',
    '/cloud/hub_cap/networks/create'
];

function getPerfMetrics (url) {
    ptor.get(url);
    return ptor.waitForAngular().then(function () {

        var angularDone = moment().valueOf();

        function getTimings() {
            return window.performance;
        }
        var timings = ptor.executeScript(getTimings);

        return timings.then(function (data) {
            var timing = data.timing;
            var redirect = timing.redirectEnd - timing.redirectStart;
            var cacheCheckedAfter = timing.fetchStart - timing.navigationStart;
            var dns = timing.domainLookupEnd - timing.domainLookupStart;
            var tcp = timing.connectEnd - timing.connectStart;
            var unload = timing.unloadEventEnd - timing.unloadEventStart;
            var request = timing.responseStart - timing.requestStart;
            var response = timing.responseEnd - timing.responseStart;
            var dom = timing.domComplete - timing.domLoading;
            var onLoad = timing.loadEventEnd - timing.loadEventStart;
            var duration = timing.loadEventEnd - timing.navigationStart;
            var ngload = angularDone - timing.loadEventEnd;

            var perfTimings = {
                redirect: redirect,
                cacheCheckedAfter: cacheCheckedAfter,
                dns: dns,
                tcp: tcp,
                unload: unload,
                request: request,
                response: response,
                dom: dom,
                onLoad: onLoad,
                duration: duration,
                ngload: ngload
            };

            return {
                url: url,
                timing: perfTimings
            };
        });
    });
}

function averageTimings (endpoint, callback) {
    var times = 10;
    async.times(times, function (n, cb) {
        getPerfMetrics(endpoint).then(function (meterics) {
            cb(null, meterics);
        });
    },
    function (err, results) {
        var timings = _.map(results, function (result) {
            return result.timing;
        });
        var accumulator = timings.shift();
        var average = _.reduce(timings, function (result, metric) {
            _.each(_.keys(result), function (key) {
                result[key] += metric[key];
            });
            return result;
        }, accumulator);

        average = _.transform(average, function (result, value, key) {
            result[key] = value/times;
            return result;
        }, {});

        var data = {
            url: endpoint,
            averages: average,
            results: results
        };

        callback(null, data);
    });
}

function testEndpoints (endpoints) {
    // async.mapSeries can be changed to .map if run against a grid for faster testing
    async.mapSeries(endpoints, averageTimings,
    function done (err, results) {
        _.each(results, function log (result) {
            console.dir(result);
        });
    });
}

describe('Encore Cloud UI - Page Load Timing Test', function () {

    before(function () {
    });

    it('should not cross a thresshold on load times', function () {
        loginPage.login();
        testEndpoints(routes);
    });

});

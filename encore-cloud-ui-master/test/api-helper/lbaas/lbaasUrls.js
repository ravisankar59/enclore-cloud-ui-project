function defaultOpts (opts) {
    opts = opts || {};
    _.defaults(opts, {
        region: (_.contains(browser.baseUrl, 'staging'))? 'STAGING' : 'ORD',
        user: browser.params.user,
    });

    return opts;
}

module.exports = {
    getLoadBalancers: function (opts) {
        opts = defaultOpts(opts);

        var base = browser.baseUrl;
        return base + '/api/cloud/users/' + opts.user + '/lbaas/' + opts.region + '/';
    },

    connectionThrottling: function (opts) {
        opts = defaultOpts(opts);
        var base = browser.baseUrl;
        return base + '/api/cloud/users/' + opts.user + '/lbaas/' +
               opts.region + '/' + opts.id + '/connectionthrottle';
    },

    connectionLogging: function (opts) {
        opts = defaultOpts(opts);
        var base = browser.baseUrl;
        return base + '/api/cloud/users/' + opts.user + '/lbaas/' +
               opts.region + '/' + opts.id + '/connectionlogging';
    },

    healthMonitoring: function (opts) {
        opts = defaultOpts(opts);
        var base = browser.baseUrl;
        return base + '/api/cloud/users/' + opts.user + '/lbaas/' +
               opts.region + '/' + opts.id + '/healthmonitor';
    },
};

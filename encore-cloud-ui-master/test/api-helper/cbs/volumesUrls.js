
module.exports = {
    getVolumes: function (opts) {
        opts = opts || {};
        _.defaults(opts, {
            region: 'ORD',
            user: browser.params.user,
        });
        var base = browser.baseUrl;
        return base + '/api/cloud/users/' + opts.user + '/block_storage/' + opts.region + '/volumes/';
    },

    deleteVolume: function (opts) {
        _.defaults(opts, {
            region: 'ORD',
            user: browser.params.user,
        });
        var base = browser.baseUrl;
        return base + '/api/cloud/users/' + opts.user +
        '/block_storage/' + opts.region + '/volumes/' + opts.id;
    }
};

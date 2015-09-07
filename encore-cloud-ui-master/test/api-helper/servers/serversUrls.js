var firstgen = {
    getServer: function (opts) {
        opts = opts || {};
        _.defaults(opts, {
            user: browser.params.user
        });
        var base = browser.baseUrl;
        return base + '/api/cloud/users/' + opts.user + '/firstgen/servers/';
    },

    serverUpdate: function  (opts) {
        return firstgen.getServer(opts) + opts.id;
    },

    serverAction: function (opts) {
        return firstgen.getServer(opts) + opts.id + '/action/' + opts.action;
    },

    reboot: function (opts) {
        opts = opts || {};
        opts.action = 'reboot';
        return firstgen.serverAction(opts);
    },

    backup: function (opts) {
        return firstgen.serverUpdate(opts) + '/backup_schedule';
    },

    rescue: function (opts) {
        opts = opts || {};
        opts.action = 'rescue';
        return firstgen.serverAction(opts);
    },

    unrescue: function (opts) {
        opts = opts || {};
        opts.action = 'unrescue';
        return firstgen.serverAction(opts);
    },

    resize: function (opts) {
        opts = opts || {};
        opts.action = 'resize';
        return firstgen.serverAction(opts);
    },

    revertResize: function (opts) {
        opts = opts || {};
        opts.action = 'revert_resize';
        return firstgen.serverAction(opts);
    },

    verifyResize: function (opts) {
        opts = opts || {};
        opts.action = 'confirm_resize';
        return firstgen.serverAction(opts);
    }

};

var nextgen = {
    getServer: function (opts) {
        opts = opts || {};
        _.defaults(opts, {
            region: 'ORD',
            user: browser.params.user
        });
        var base = browser.baseUrl;
        return base + '/api/cloud/users/' + opts.user + '/servers/' + opts.region + '/';
    },

    novaAuthentication: function () {
        var base = ptor.baseUrl;
        return base + '/api/cloud/admin/nova/authenticate';
    },

    attachVolume: function (opts) {
        opts = opts || {};
        _.defaults(opts, {
            region: 'ORD',
            user: browser.params.user
        });
        var base = browser.baseUrl;
        return base + '/api/cloud/users/' + opts.user + '/servers/' +
               opts.region + '/' + opts.serverId + '/volume_attachments';
    },

    detachVolume: function (opts) {
        opts = opts || {};
        _.defaults(opts, {
            region: 'ORD',
            user: browser.params.user
        });
        var base = browser.baseUrl;
        return base + '/api/cloud/users/' + opts.user + '/servers/' +
               opts.region + '/' + opts.serverId + '/volume_attachments/' +
               opts.volumeId;
    },

    unrescueServer: function (opts) {
        opts = opts || {};
        _.defaults(opts, {
            region: 'ORD',
            user: browser.params.user
        });
        var base = browser.baseUrl;
        return base + '/api/cloud/users/' + opts.user + '/servers/' + opts.region + '/' +
               opts.id + '/action/unrescue';
    },

    rescueServer: function (opts) {
        opts = opts || {};
        _.defaults(opts, {
            region: 'ORD',
            user: browser.params.user
        });
        var base = browser.baseUrl;
        return base + '/api/cloud/users/' + opts.user + '/servers/' + opts.region + '/' +
               opts.id + '/action/rescue';
    },

    resizeServer: function (opts) {
        opts = opts || {};
        _.defaults(opts, {
            region: 'ORD',
            user: browser.params.user
        });
        var base = browser.baseUrl;
        return base + '/api/cloud/users/' + opts.user + '/servers/' + opts.region + '/' +
               opts.id + '/action/resize';
    },

    revertServerResize: function (opts) {
        opts = opts || {};
        _.defaults(opts, {
            region: 'ORD',
            user: browser.params.user
        });
        var base = browser.baseUrl;
        return base + '/api/cloud/users/' + opts.user + '/servers/' + opts.region + '/' +
               opts.id + '/action/revert_resize';
    },

    verifyServerResize: function (opts) {
        opts = opts || {};
        _.defaults(opts, {
            region: 'ORD',
            user: browser.params.user
        });
        var base = browser.baseUrl;
        return base + '/api/cloud/users/' + opts.user + '/servers/' + opts.region + '/' +
               opts.id + '/action/confirm_resize';
    },

    suspendServer: function (opts) {
        opts = opts || {};
        _.defaults(opts, {
            region: 'ORD',
            user: ptor.params.user
        });
        var base = ptor.baseUrl;
        return base + '/api/cloud/users/' + opts.user + '/nova/' + opts.region + '/' +
               opts.id + '/suspend';
    },

    unsuspendServer: function (opts) {
        opts = opts || {};
        _.defaults(opts, {
            region: 'ORD',
            user: ptor.params.user
        });
        var base = ptor.baseUrl;
        return base + '/api/cloud/users/' + opts.user + '/nova/' + opts.region + '/' +
               opts.id + '/unsuspend';
    },

    addIpServer: function (opts) {
        opts = opts || {};
        _.defaults(opts, {
            region: 'ORD',
            user: ptor.params.user
        });
        var base = ptor.baseUrl;
        return base + '/api/cloud/users/' + opts.user + '/nova/' + opts.region + '/' +
               opts.id + '/add-ip';
    },

    removeIpServer: function (opts) {
        opts = opts || {};
        _.defaults(opts, {
            region: 'ORD',
            user: ptor.params.user
        });
        var base = ptor.baseUrl;
        return base + '/api/cloud/users/' + opts.user + '/nova/' + opts.region + '/' +
               opts.id + '/remove-ip';
    }
};

module.exports = {
    firstgen: firstgen,
    nextgen: nextgen
};

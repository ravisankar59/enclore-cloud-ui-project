/*jshint camelcase: false */
var baseApi = require('../baseApi');
var url = require('./serversUrls');

function fetchServers (api, opts) {
    opts = opts || {};
    var d = protractor.promise.defer();
    var req = {
        method: 'GET',
        url: url.firstgen.getServer(opts)
    };
    api(req).then(d.fulfill, d.reject);

    return d.promise;
}

var firstGenServersApi = {

    getServer: function (serverName, opts) {
        opts = opts || {};
        var d = this.deferred();
        var api = this.api;
        var err = new Error('Unable to fetch server: ' + serverName);
        fetchServers(api, opts).then(function (data) {
            var body = baseApi.bodyParse(data);
            var server = _.find(body.servers, { name: serverName });
            if (_.isEmpty(server)) {
                return d.reject(err);
            }
            d.fulfill(server);
        }, function error (err) {
            d.reject(err);
        });

        return d.promise;
    },

    updateServer: function (serverName, update, opts) {
        opts = opts || {};
        var d = this.deferred();
        var api = this.api;
        firstGenServersApi.getServer(serverName).then(function (server) {
            if (server.status !== 'ACTIVE') {
                throw new Error('Server ' + serverName + ' not in ACTIVE status');
            }
            opts.id = server.id;
            var req = {
                method: 'PUT',
                url: url.firstgen.serverUpdate(opts),
                body: JSON.stringify(update)
            };
            api(req).then(function success (data) {
                d.fulfill(data.body);
            }, function error () {
                var err = new Error('Unable to update server: ' + serverName);
                d.reject(err);
            });
        });

        return d.promise;
    },

    serverAction: function (serverName, action, opts) {
        opts = opts || {};
        var d = this.deferred();
        var api = this.api;
        firstGenServersApi.getServer(serverName).then(function (server) {
            if (server.status !== 'ACTIVE') {
                throw new Error('Server ' + serverName + ' not in ACTIVE status');
            }
            opts.id = server.id;
            var req = {
                method: 'POST',
                url: url.firstgen.serverUpdate(opts),
                body: JSON.stringify(action)
            };
            api(req).then(function success (data) {
                d.fulfill(data.body);
            }, function error () {
                var err = new Error('Unable to complete server action "' + action + '" on ' + serverName);
                d.reject(err);
            });
        });

        return d.promise;
    },

    changePassword: function (serverName, password) {
        return firstGenServersApi.updateServer(serverName, { admin_pass: password });
    },

    changeName: function (serverName, newName) {
        return firstGenServersApi.updateServer(serverName, { name: newName });
    },

    disableBackup: function (serverName, opts) {
        opts = opts || {};
        var d = this.deferred();
        var api = this.api;
        firstGenServersApi.getServer(serverName).then(function (server) {
            opts.id = server.id;
            var req = {
                method: 'DELETE',
                url: url.firstgen.backup(opts),
            };
            api(req).then(function success (data) {
                d.fulfill(data.body);
            },function error () {
                var err = new Error('Unable to disable backup on ' + serverName);
                d.reject(err);
            });
        });
        return d.promise;
    },

    enableBackup: function (serverName, opts) {
        opts = opts || {};
        _.defaults(opts, {
            body: {
                daily: 'H_0000_0200',
                weekly: 'DISABLED',
                enabled: true
            }
        });
        var d = this.deferred();
        var api = this.api;
        firstGenServersApi.getServer(serverName).then(function (server) {
            opts.id = server.id;
            var req = {
                method: 'POST',
                url: url.firstgen.backup(opts),
                body: JSON.stringify(opts.body)
            };

            api(req).then(function success (data) {
                d.fulfill(data.body);
            }, function error () {
                var err = new Error('Unable to enable backup on ' + serverName);
                d.reject(err);
            });
        });

        return d.promise;
    },

    rescueServer: function (serverName, opts) {
        var d = this.deferred();
        firstGenServersApi.rescue_(serverName, opts).then(function () {
            return firstGenServersApi.waitForActiveServer(serverName, 'RESCUE').then(function () {
                return d.fulfill('Server currently in rescue status');
            });
        });
        return d.promise;
    },

    rescue_: function (serverName, opts) {
        opts = opts || {};
        var d = this.deferred();
        var api = this.api;
        firstGenServersApi.getServer(serverName).then(function (server) {
            var rescueStatuses = [
                'RESCUE',
                'RESCUING',
                'PREP_RESCUE'
            ];

            if (_.contains(rescueStatuses, server.status.toUpperCase())) {
                return d.fulfill('Server rescued');
            }

            opts.id = server.id;
            var req = {
                method: 'POST',
                url: url.firstgen.rescue(opts),
            };

            api(req).then(function success (data) {
                d.fulfill(data.body);
            }, function error () {
                var err = new Error('Unable to rescue server: ' + serverName);
                d.reject(err);
            });
        });
        return d.promise;
    },

    resizeServer: function (serverName, opts) {
        var d = this.deferred();
        firstGenServersApi.resize_(serverName, opts).then(function () {
            return firstGenServersApi.waitForActiveServer(serverName, 'VERIFY_RESIZE').then(function () {
                return d.fulfill('Server currently in "VERIFY_RESIZE" status');
            });
        });
        return d.promise;
    },

    resize_: function (serverName, opts) {
        opts = opts || {};
        _.defaults(opts, {
            body: { flavor: '2' }
        });
        var d = this.deferred();
        var api = this.api;
        firstGenServersApi.getServer(serverName).then(function (server) {
            var resizeStatuses = [
                'VERIFY_RESIZE',
                'PREP_RESIZE',
                'RESIZE'
            ];

            if (_.contains(resizeStatuses, server.status.toUpperCase())) {
                return d.fulfill('Server resizing');
            } else if (server.status !== 'ACTIVE') {
                throw new Error('Server ' + serverName + ' not in ACTIVE status');
            }

            opts.id = server.id;
            var req = {
                method: 'POST',
                url: url.firstgen.resize(opts),
                body: JSON.stringify(opts.body)
            };

            api(req).then(function success (data) {
                d.fulfill(data.body);
            }, function error () {
                var err = new Error('Unable to resize server: ' + serverName);
                d.reject(err);
            });

        });
        return d.promise;
    },

    verifyResize: function (serverName, opts) {
        opts = opts || {};
        _.defaults(opts, {
            body: { flavor: '2' }
        });
        var d = this.deferred();
        var api = this.api;
        firstGenServersApi.getServer(serverName).then(function (server) {
            if (server.status !== 'VERIFY_RESIZE') {
                throw new Error('Server ' + serverName + ' not in VERIFY_RESIZE status');
            }
            opts.id = server.id;
            var req = {
                method: 'POST',
                url: url.firstgen.verifyResize(opts),
                body: JSON.stringify(opts.body)
            };

            api(req).then(function success (data) {
                firstGenServersApi.waitForActiveServer(serverName).then(function () {
                    d.fulfill(data.body);
                });
            }, function error () {
                d.reject(new Error('Unable to verify resize on ' + serverName));
            });
        });
        return d.promise;
    },

    waitForActiveServer: function (serverName, status) {
        status = status || 'ACTIVE';
        var d = this.deferred();
        var intervalId;
        var fetch = fetchServers;
        var api = this.api;
        var check = function (serverName, status) {
            fetch(api).then(function (data) {
                var body = baseApi.bodyParse(data);
                if (body.error) {
                    d.reject(new Error('Issues waiting | ' + body.error.message));
                } else {
                    var server = _.find(body.servers, { name: serverName });
                    if (_.isEmpty(server)) {
                        d.reject(new Error('Issues waiting | Unable to find server'));
                    }
                    if (server.status === status) {
                        clearInterval(intervalId);
                        d.fulfill(server);
                    }
                }
            });
        };

        intervalId = setInterval(function () {
            check(serverName, status);
        }, 5000);

        return d.promise;
    }

};

module.exports = baseApi.initialize(firstGenServersApi);

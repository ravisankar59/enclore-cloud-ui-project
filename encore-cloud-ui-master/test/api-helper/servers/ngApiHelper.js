/* jshint camelcase: false */
var baseApi = require('../baseApi');
var url = require('./serversUrls');
var creds = require('../../../test/secrets').credentials;

function fetchServers (api, opts) {
    var d = protractor.promise.defer();
    var req = {
        method: 'GET',
        url: url.nextgen.getServer(opts)
    };
    api(req).then(d.fulfill, d.reject);

    return d.promise;
}

var nextGenServersApi = {

    getServer: function (serverName, opts) {
        opts = opts || {};
        var d = this.deferred();
        var api = this.api;
        var errStr = 'unable to fetch server';
        fetchServers(api, opts).then(function success (data) {
            var body = baseApi.bodyParse(data);
            if (body.error) {
                d.reject(new Error(errStr + ' | ' + body.error.message));
            } else {
                var server = _.find(body.servers, { name: serverName });
                if (_.isEmpty(server)) {
                    d.reject(new Error(errStr));
                }
                d.fulfill(server);
            }
        });

        return d.promise;
    },

    adminAuth: function (opts) {
        var api = this.api;

        opts = opts || {};

        var username = opts.username || _.first(_.keys(creds));
        var password = opts.password || creds[username];
        var regions = [opts.region || 'ORD'];

        var body = {
            username: username,
            password: password,
            regions: regions
        };

        var request = {
            method: 'POST',
            url: url.nextgen.novaAuthentication(),
            body: JSON.stringify(body)
        };

        var errStr = 'Unable to authenticate: ';
        return api(request).then(function success (data) {
            var body = baseApi.bodyParse(data);
            if (body.error) {
                throw new Error(errStr + ' | ' + body.error.message);
            } else {
                return body.access;
            }
        }, function error () {
            throw new Error(errStr);
        });
    },

    unsuspendServer: function (serverName, opts) {
        var d = this.deferred();

        nextGenServersApi.unsuspend_(serverName, opts).then(function () {
            nextGenServersApi.waitForActiveServer(serverName, 'ACTIVE').then(function () {
                d.fulfill('Server currently in active status');
            });
        });

        return d.promise;
    },

    unsuspend_: function (serverName, opts) {
        opts = opts || {};
        var d = this.deferred();
        var api = this.api;
        nextGenServersApi.getServer(serverName).then(function (server) {
            var unsuspendStatuses = [
                'ACTIVE',
                'RESUMING'
            ];

            var taskState = server.task_state || server.vm_state || '';
            if (_.contains(unsuspendStatuses, taskState.toUpperCase())) {
                return d.fulfill('Server is being unsuspended');
            }
            opts.id = server.id;
            opts.region = server.region;
            opts.user = ptor.user;

            nextGenServersApi.adminAuth(opts).then(function (regionMap) {
                opts.region = regionMap[opts.region].adminRegion;

                var req = {
                    method: 'POST',
                    url: url.nextgen.unsuspendServer(opts),
                    body: JSON.stringify(opts)
                };
                var errStr = 'Unable to unsuspend server: ' + serverName;
                return api(req).then(function success (data) {
                    var body = baseApi.bodyParse(data);
                    if (body.error) {
                        throw new Error(errStr + ' | ' + body.error.message);
                    } else {
                        return d.fulfill(data);
                    }
                }, function error () {
                    throw new Error(errStr);
                });
            });
        });

        return d.promise;
    },

    suspendServer: function (serverName, opts) {
        var d = this.deferred();

        nextGenServersApi.suspend_(serverName, opts).then(function () {
            nextGenServersApi.waitForActiveServer(serverName, 'SUSPENDED').then(function () {
                d.fulfill('Server currently in suspended status');
            });
        });

        return d.promise;
    },

    suspend_: function (serverName, opts) {
        opts = opts || {};
        var d = this.deferred();
        var api = this.api;
        nextGenServersApi.getServer(serverName).then(function (server) {
            var suspendStatuses = [
                'SUSPENDED',
                'SUSPENDING'
            ];

            var taskState = server.task_state || server.vm_state || '';
            if (_.contains(suspendStatuses, taskState.toUpperCase())) {
                return d.fulfill('Server is being suspended');
            }
            opts.id = server.id;
            opts.region = server.region;
            opts.user = ptor.user;

            nextGenServersApi.adminAuth(opts).then(function (regionMap) {
                opts.region = regionMap[opts.region].adminRegion;

                var req = {
                    method: 'POST',
                    url: url.nextgen.suspendServer(opts),
                    body: JSON.stringify(opts)
                };
                var errStr = 'Unable to suspend server: ' + serverName;
                return api(req).then(function success (data) {
                    var body = baseApi.bodyParse(data);
                    if (body.error) {
                        throw new Error(errStr + ' | ' + body.error.message);
                    } else {
                        return d.fulfill(data);
                    }
                }, function error () {
                    throw new Error(errStr);
                });
            });
        });

        return d.promise;
    },

    addServerIp: function (serverName, opts) {
        var d = this.deferred();

        nextGenServersApi.addIp_(serverName, opts).then(function (server) {
            var addresses = _.pick(server,'addresses');
            nextGenServersApi.waitForServerChange(serverName, addresses).then(function (serverNew) {
                var addressesNew = _.pluck(serverNew['addresses'], 'ip_address');
                var addressesOld = _.pluck(server['addresses'], 'ip_address');
                d.fulfill(_.difference(addressesNew, addressesOld));
            });
        });

        return d.promise;
    },

    addIp_: function (serverName, opts) {
        opts = opts || {};
        var d = this.deferred();
        var api = this.api;
        nextGenServersApi.getServer(serverName).then(function (server) {
            opts.id = server.id;
            opts.region = server.region;
            opts.user = ptor.user;

            nextGenServersApi.adminAuth(opts).then(function (regionMap) {
                var body = {networkId: '00000000-0000-0000-0000-000000000000'};
                opts.region = regionMap[opts.region].adminRegion;

                var req = {
                    method: 'POST',
                    url: url.nextgen.addIpServer(opts),
                    body: JSON.stringify(body)
                };

                var errStr = 'Unable to add IP to server: ' + serverName;
                return api(req).then(function success (data) {
                    var body = baseApi.bodyParse(data);
                    if (body.error) {
                        throw new Error(errStr + ' | ' + body.error.message);
                    } else {
                        return d.fulfill(server);
                    }
                }, function error () {
                    throw new Error(errStr);
                });
            });
        });

        return d.promise;
    },

    removeServerIp: function (serverName, opts) {
        var d = this.deferred();

        nextGenServersApi.removeIp_(serverName, opts).then(function (server) {
            var addresses = _.pick(server,'addresses');
            nextGenServersApi.waitForServerChange(serverName, addresses).then(function (serverNew) {
                var addressesNew = _.pluck(serverNew['addresses'], 'ip_address');
                var addressesOld = _.pluck(server['addresses'], 'ip_address');
                d.fulfill(_.difference(addressesNew, addressesOld));
            });
        });

        return d.promise;
    },

    removeIp_: function (serverName, opts) {
        opts = opts || {};
        var d = this.deferred();
        var api = this.api;
        nextGenServersApi.getServer(serverName).then(function (server) {
            opts.id = server.id;
            opts.region = server.region;
            opts.user = ptor.user;

            nextGenServersApi.adminAuth(opts).then(function (regionMap) {
                opts.region = regionMap[opts.region].adminRegion;

                var address = _.pick(opts,'address');
                var req = {
                    method: 'POST',
                    url: url.nextgen.removeIpServer(opts),
                    body: JSON.stringify(address)
                };
                var errStr = 'Unable to remove IP from server: ' + serverName;

                return api(req).then(function success (data) {
                    var body = baseApi.bodyParse(data);
                    if (body.error) {
                        throw new Error(errStr + ' | ' + body.error.message);
                    } else {
                        return d.fulfill(server);
                    }
                }, function error () {
                    throw new Error(errStr);
                });
            });
        });

        return d.promise;
    },

    unrescueServer: function (serverName, opts) {
        opts = opts || {};
        var d = this.deferred();
        var api = this.api;
        var errStr = 'Unable to unrescue server: ' + serverName + '. ';
        nextGenServersApi.getServer(serverName).then(function (server) {
            if (server.status !== 'RESCUE') {
                throw new Error(errStr + 'Server not in RESCUED status');
            }

            if (server.task_state === 'UNRESCUING') {
                d.fulfill('Server being unrescued');
            }

            opts.id = server.id;
            var body = {};
            var req = {
                method: 'POST',
                url: url.nextgen.unrescueServer(opts),
                body: JSON.stringify(body)
            };

            api(req).then(function success (data) {
                var body = baseApi.bodyParse(data);
                if (body.error) {
                    var err = new Error(errStr + ' | ' + body.error.message);
                    d.reject(err);
                } else {
                    d.fulfill(server);
                }
            }, function error () {
                var err = new Error(errStr);
                d.reject(err);
            });
        });

        return d.promise;
    },

    rescueServer: function (serverName, opts) {
        var d = this.deferred();

        nextGenServersApi.rescue_(serverName, opts).then(function () {
            nextGenServersApi.waitForActiveServer(serverName, 'RESCUE').then(function () {
                d.fulfill('Server currently in rescue status');
            });
        });

        return d.promise;
    },

    rescue_: function (serverName, opts) {
        opts = opts || {};
        var d = this.deferred();
        var api = this.api;
        nextGenServersApi.getServer(serverName).then(function (server) {
            var rescueStatuses = [
                'RESCUE',
                'RESCUED',
                'RESCUING',
                'PREP_RESCUE'
            ];

            var taskState = server.task_state || server.vm_state || '';
            if (_.contains(rescueStatuses, taskState.toUpperCase())) {
                return d.fulfill('Server is being rescued');
            }
            opts.id = server.id;
            var req = {
                method: 'POST',
                url: url.nextgen.rescueServer(opts)
            };
            var errStr = 'Unable to rescue server: ' + serverName;
            return api(req).then(function success (data) {
                var body = baseApi.bodyParse(data);
                if (body.error) {
                    throw new Error(errStr + ' | ' + body.error.message);
                } else {
                    return d.fulfill(data);
                }
            }, function error () {
                throw new Error(errStr);
            });
        });

        return d.promise;
    },

    resizeServer: function (serverName, opts) {
        var d = this.deferred();

        nextGenServersApi.resize_(serverName, opts).then(function () {
            nextGenServersApi.waitForActiveServer(serverName, 'VERIFY_RESIZE').then(function () {
                d.fulfill('Server currently in VERIFY_RESIZE status');
            });
        });

        return d.promise;
    },

    resize_: function (serverName, opts) {
        opts = opts || {};
        var d = this.deferred();
        var api = this.api;
        var errStr = 'Unable to resize server: ' + serverName + '. ';
        nextGenServersApi.getServer(serverName).then(function (server) {

            var resizeStates = [
                'RESIZE_MIGRATING',
                'RESIZE_FINISH',
                'RESIZED',
                'VERIFY_RESIZE'
            ];

            var taskState = server.task_state || server.vm_state || server.status || '';
            if (_.contains(resizeStates, taskState.toUpperCase())) {
                return d.fulfill('server is being resized');
            }
            if (server.status !== 'ACTIVE') {
                throw new Error(errStr + 'Server not in ACTIVE status');
            }
            opts.id = server.id;
            opts.body = opts.body || { flavor: '3' };
            var req = {
                method: 'POST',
                url: url.nextgen.resizeServer(opts),
                body: JSON.stringify(opts.body)
            };
            api(req).then(function success (data) {
                var body = baseApi.bodyParse(data);
                if (body.error) {
                    var err = new Error(errStr + ' | ' + body.error.message);
                    d.reject(err);
                } else {
                    d.fulfill(server);
                }
            }, function error () {
                var err = new Error(errStr);
                d.reject(err);
            });
        });
        return d.promise;
    },

    revertServerResize: function (serverName, opts) {
        opts = opts || {};
        var d = this.deferred();
        var api = this.api;
        var errStr = 'Unable to revert server resize: ' + serverName;
        nextGenServersApi.getServer(serverName).then(function (server) {
            if (server.status !== 'VERIFY_RESIZE') {
                throw new Error(errStr + ' | Server not in VERIFY_RESIZE status');
            }
            opts.id = server.id;
            var req = {
                method: 'POST',
                url: url.nextgen.revertServerResize(opts)
            };
            api(req).then(function success (data) {
                var body = baseApi.bodyParse(data);
                if (body.error) {
                    throw new Error(errStr);
                } else {
                    d.fulfill(body);
                }
            }, function error () {
                throw new Error(errStr);
            });
        });

        return d.promise;
    },

    verifyServerResize: function (serverName, opts) {
        opts = opts || {};
        var d = this.deferred();
        var api = this.api;
        var errStr = 'Unable to verify server resize: ' + serverName;
        nextGenServersApi.getServer(serverName).then(function (server) {
            if (server.status !== 'VERIFY_RESIZE') {
                throw new Error(errStr + 'Server not in VERIFY_RESIZE status');
            }
            opts.id = server.id;
            var req = {
                method: 'POST',
                url: url.nextgen.verifyServerResize(opts)
            };
            api(req).then(function success (data) {
                var body = baseApi.bodyParse(data);
                if (body.error) {
                    throw new Error(errStr);
                }
                d.fulfill(server);
            }, function error () {
                throw new Error(errStr);
            });
        });

        return d.promise;
    },

    waitForActiveServer: function (serverName, status) {
        status = status || 'ACTIVE';
        var d = this.deferred();
        var api = this.api;
        var intervalId;
        var fetch = fetchServers;
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
    },

    waitForServerChange: function (serverName, opts) {
        var d = this.deferred();
        var api = this.api;
        var intervalId;
        var fetch = fetchServers;

        var check = function (serverName, opts) {
            fetch(api).then(function (data) {
                var body = JSON.parse(data.body);
                if (body.error) {
                    d.reject(new Error('Issues waiting | ' + body.error.message));
                } else {
                    var delta = {};
                    var server = {};

                    server = _.find(body.servers, { name: serverName });
                    if (_.isEmpty(server)) {
                        d.reject(new Error('Issues waiting | Unable to find server'));
                    }

                    delta = _.reduce(opts, function (obj, value, key) {
                        if (!_.isEqual(value, server[key])) {
                            obj[key] = server[key];
                        }
                        return obj;
                    }, {});

                    if (!_.isEmpty(delta)) {
                        clearInterval(intervalId);
                        d.fulfill(delta);
                    }
                }
            });
        };

        intervalId = setInterval(function () {
            check(serverName, opts);
        }, 5000);

        return d.promise;
    }
};

module.exports = baseApi.initialize(nextGenServersApi);

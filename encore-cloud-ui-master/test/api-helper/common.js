/*jshint camelcase: false */
var baseApi = require('./baseApi');
var servers = require('./servers/serversApiHelper');
var serversUrls = require('./servers/serversUrls');
var volumes = require('./cbs/volumesApiHelper');

var common = {

    attachVolumeToServer: function (volumeName, serverName, devicePath) {
        var d = this.deferred();

        try {
            common.attach_(volumeName, serverName, devicePath).then(function () {
                volumes.waitForActiveVolume(volumeName, 'in-use').then(function () {
                    d.fulfill('attached volume');
                });
            });
        } catch (e) { // This will retry a semi-common failure case
            if (e instanceof SyntaxError) {
                return common.attachVolumeToServer(volumeName, serverName, devicePath);
            }
        }

        return d.promise;
    },

    attach_: function (volumeName, serverName, devicePath) {
        var d = this.deferred();
        var api = this.api;
        // find the volume and server and wait for components to be active
        var tasks = [
            volumes.getVolume(volumeName),
            servers.nextgen.getServer(serverName),
        ];

        protractor.promise.all(tasks).then(function (data) {
            var volume = data[0];
            var server = data[1];
            if (volume.status === 'in-use') {
                d.fulfill('Already attached');
                return;
            }
            volumes.waitForActiveVolume(volumeName).then(function () {
                var opts = {
                    serverId: server.id
                };
                var url = serversUrls.nextgen.attachVolume(opts);
                var body = {
                    volume_id: volume.id,
                    device: (devicePath ? devicePath : '/dev/xvdb')
                };

                var req = {
                    method: 'POST',
                    url: url,
                    body: JSON.stringify(body)
                };

                api(req).then(function success (data) {
                    if (data.statusCode !== 200) {
                        d.reject(new Error('Unable to detach volume, status code: ' + data.statusCode ));
                    } else {
                        var body = baseApi.bodyParse(data);
                        if (body.error) {
                            var err = new Error('Unable to attach volume: ' + ' | ' + body.error.message);
                            d.reject(err);
                        } else {
                            d.fulfill(data);
                        }
                    }
                }, function error (err) {
                    d.reject(new Error('Unable to attach volume: ' + err));
                });
            });
        });

        return d.promise;
    },

    detachVolumeFromServer: function (volumeName, serverName) {
        var d = this.deferred();
        var api = this.api;
        var tasks = [
            volumes.getVolume(volumeName),
            servers.nextgen.getServer(serverName)
        ];

        protractor.promise.all(tasks).then(function (data) {
            var volume = data[0];
            var server = data[1];
            if (_.isEmpty(volume.attachments)) {
                d.fulfill('No attachments');
                return;
            }
            var attachInfo = _.find(volume.attachments, { server_id: server.id });
            var opts = {
                serverId: attachInfo.server_id,
                volumeId: attachInfo.volume_id
            };
            var url = serversUrls.nextgen.detachVolume(opts);

            var req = {
                method: 'DELETE',
                url: url
            };

            api(req).then(function success (data) {
                if (data.statusCode !== 200) {
                    d.reject(new Error('Unable to detach volume, status code: ' + data.statusCode ));
                } else {
                    d.fulfill('detached volume');
                }
            }, function error (err) {
                d.reject(new Error('Unable to detach volume: ' + err));
            });
        });
        return d.promise;
    }
};

module.exports = baseApi.initialize(common);

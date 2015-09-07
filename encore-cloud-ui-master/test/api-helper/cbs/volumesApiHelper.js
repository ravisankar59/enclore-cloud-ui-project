/*jshint camelcase: false */
var baseApi = require('../baseApi');
var url = require('./volumesUrls');

function fetchVolumes (api, opts) {
    var d = protractor.promise.defer();
    var req = {
        method: 'GET',
        url: url.getVolumes(opts),
    };

    api(req).then(d.fulfill, d.reject);
    return d.promise;
}

var volumesApi = {
    getVolume: function (volumeName, opts) {
        var d = this.deferred();
        var api = this.api;
        var err = new Error('Unable to fetch volume: ' + volumeName);
        fetchVolumes(api, opts).then(function (data) {
            var body = baseApi.bodyParse(data);
            if (body.error) {
                return d.reject(err);
            }
            var volume = _.find(body.volumes, { display_name: volumeName });
            if (_.isEmpty(volume)) {
                d.reject(err);
            }
            d.fulfill(volume);
        }, function () {
            d.reject(err);
        });
        return d.promise;
    },

    deleteVolume: function (volumeName, opts) {
        var d = this.deferred();
        var api = this.api;
        volumesApi.getVolume(volumeName).then(function (volume) {
            opts = opts || {};
            opts.id = volume.id;
            var req = {
                method: 'DELETE',
                url: url.deleteVolume(opts)
            };

            var errStr = 'Unable to delete volume: ' + volumeName;
            api(req).then(function success (data) {
                var body = baseApi.bodyParse(data);
                if (body.error) {
                    d.reject(new Error(errStr + ' | ' + body.error.message));
                } else {
                    d.fulfill(volumeName + ' removed.');
                }
            }, function error () {
                d.reject(new Error(errStr));
            });
        });

        return d.promise;
    },

    waitForActiveVolume: function (volumeName, status) {
        status = status || 'available';
        var d = this.deferred();
        var api = this.api;
        var intervalId;
        var fetch = fetchVolumes;
        var check = function (volumeName, status) {
            fetch(api).then(function (data) {
                var body = baseApi.bodyParse(data);
                if (body.error) {
                    clearInterval(intervalId);
                    d.reject(new Error('Issues waiting | ' + body.error.message));
                } else {
                    var volume = _.find(body.volumes, { display_name: volumeName });
                    if (_.isEmpty(volume)) {
                        clearInterval(intervalId);
                        d.reject(new Error('Issues waiting | Unable to find volume'));
                    }
                    else if (volume.status === status) {
                        clearInterval(intervalId);
                        d.fulfill(volume);
                    }
                }
            });
        };

        intervalId = setInterval(function () {
            check(volumeName, status);
        }, 5000);

        return d.promise;
    }
};

module.exports = baseApi.initialize(volumesApi);

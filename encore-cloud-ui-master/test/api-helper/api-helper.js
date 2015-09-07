process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
var req = require('request');
var ptor = require('protractor');
var _ = require('lodash');
var creds = require('../../test/secrets').credentials;

var APIHelper = {
    token: {},
    identityUrl: '',
    getToken: function getToken () {
        var d = ptor.promise.defer();
        var username = _.first(_.keys(creds));
        var password = creds[username];
        var body = {
            auth: {
                'RAX-AUTH:domain': {
                    name: 'Rackspace'
                },
                passwordCredentials: {
                    username: username,
                    password: password
                }
            }
        };

        var request = {
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        req.post(APIHelper.identityUrl, request, function (err, res, data) {
            if (err) {
                return d.reject(err);
            }

            if (res.statusCode === 200) {
                data = JSON.parse(data);
                APIHelper.token = { 'X-Auth-Token': data.access.token.id };
                d.fulfill(data);
            }
        });

        return d.promise;
    },

    api: function api(request) {
        if (_.isEmpty(APIHelper.token)) {
            return APIHelper.getToken().then(function success () {
                return APIHelper.api(request);
            }, function error (err) {
                throw new Error('Unable to get x-auth-token: ' + JSON.stringify(err));
            });
        }
        var d = ptor.promise.defer();
        request.headers = request.headers || {};
        _.merge(request.headers, APIHelper.token);
        req(request, function (err, data) {
            if (err) {
                return d.reject(err);
            }
            d.fulfill(data);
        });
        return d.promise;
    },

    initialize: function init (env) {
        APIHelper.identityUrl = 'https://staging.identity-internal.api.rackspacecloud.com/v2.0/tokens';
        if (_.contains(['production', 'preprod'], env)) {
            APIHelper.identityUrl = 'https://identity-internal.api.rackspacecloud.com/v2.0/tokens';
        }
        return APIHelper.api;
    }
};

module.exports = APIHelper.initialize;

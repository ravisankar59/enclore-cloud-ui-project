var api = require('./api-helper');

module.exports = {
    initialize: function (apiWrapper) {
        var api_ = api(browser.params.env);
        var flow = protractor.promise.controlFlow();
        var inject = {
            deferred: protractor.promise.defer,
            api: api_
        };

        _.each(apiWrapper, function (val, key) {
            apiWrapper[key] = function () {
                var args = arguments;
                return flow.execute(function () {
                    return val.apply(inject, args);
                });
            };
        });
        return apiWrapper;
    },

    bodyParse: function (res) {
        var body;
        try {
            body = JSON.parse(res.body);
        }
        catch (e) {
            body = { error: 'Unable to parse response. Error Code: ' + e };
        }

        return body;
    }
};

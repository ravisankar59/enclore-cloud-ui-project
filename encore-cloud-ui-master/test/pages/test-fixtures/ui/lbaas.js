var buildObject = require('../helpers.js').buildObject;

function buildLoadBalancers () {
    var loadBalancers = [
        'lbChangeName',
        'lbChangeNameSuccess',
        'lbDelete',
        'lbDeleteDetails',
        'lbLogging',
        'lbThrottling',
        'lbHealthMonitoring',
        'lbOverviewLogging',
        'lbOverviewThrottling',
        'lbOverviewHealthMonitoring'
    ];

    return buildObject(loadBalancers, function (loadBalancerName) {
        var loadBalancerBody = {};

        loadBalancerBody[loadBalancerName] = {
            get: function () {
                return {
                    name: 'auto-' + loadBalancerName
                };
            }
        };
        return loadBalancerBody;
    });
}

module.exports = buildLoadBalancers();

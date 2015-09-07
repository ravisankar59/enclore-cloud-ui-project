var _ = require('lodash');

function buildVolumes () {

    var loadBalancers = [
        'lbChangeName',
        'lbDelete',
        'lbDeleteDetails',
        'lbLogging',
        'lbThrottling',
        'lbHealthMonitoring',
        'lbOverviewLogging',
        'lbOverviewThrottling',
        'lbOverviewHealthMonitoring'
    ];

    return _.reduce(loadBalancers, function (obj, loadBalancerName) {
        obj[loadBalancerName] = {
            name: 'auto-' + loadBalancerName,
            virtualIps: [{
                type: 'PUBLIC'
            }],
            protocol: 'HTTP',
            port: 80,
            algorithm: 'RANDOM',
            timeout: 30,
            nodes: []
        };
        return obj;
    }, {});
}

module.exports = buildVolumes();

module.exports.lbaasDetails = {
    name: 'auto-lbaasDetails',
    virtualIps: [{
        type: 'PUBLIC'
    }],
    protocol: 'HTTP',
    port: 80,
    algorithm: 'RANDOM',
    timeout: 30,
    nodes: [{
        address: '10.178.8.213',
        port: 80,
        condition: 'ENABLED'
    },
    {
        address: '111.111.11.1',
        port: 80,
        condition: 'ENABLED'
    }]
};

module.exports.httpLbaas = {
    name: 'httpLbaas',
    virtualIps: [{
        type: 'PUBLIC'
    }],
    protocol: 'HTTP',
    port: 80,
    algorithm: 'RANDOM',
    timeout: 30,
    nodes: []
};

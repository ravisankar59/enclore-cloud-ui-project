var _ = require('lodash');

function buildNetworks () {

    var networks = [
        'networkTest'
    ];

    return _.reduce(networks, function (obj, networkName) {
        obj[networkName] = {
            'cidr': '192.168.10.0/24',
            'label': 'auto-' + networkName
        };
        return obj;
    }, {});
}

module.exports = buildNetworks();

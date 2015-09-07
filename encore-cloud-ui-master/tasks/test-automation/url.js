var _ = require('lodash');
// 'env' is set in the setup/teardown scripts for staging/prod
var base = 'https://encore.rackspace.com';
if (_.contains(['preprod', 'staging'], env)) {
      base = 'https://' + env + '.encore.rackspace.com';
}

var endpoints = {
    'https://staging.encore.rackspace.com': {
        nextGenServers: base + '/api/cloud/users/hub_cap/servers/ORD/', 
        firstGenServers: base + '/api/cloud/users/hub_cap/firstgen/servers/', 
        volumes: base + '/api/cloud/users/hub_cap/block_storage/ORD/volumes/',
        snapshots: base + '/api/cloud/users/hub_cap/block_storage/ORD/snapshots/',
        databases: base + '/api/cloud/users/hub_cap/dbaas/STAGING/instances/',
        loadbalancers: base + '/api/cloud/users/hub_cap/lbaas/STAGING/',
        networks: base + '/api/cloud/users/hub_cap/networks/ORD/'
    },

    'https://preprod.encore.rackspace.com': {
        nextGenServers: base + '/api/cloud/users/hub_cap/servers/ORD/', 
        firstGenServers: base + '/api/cloud/users/hub_cap/firstgen/servers/', 
        volumes: base + '/api/cloud/users/hub_cap/block_storage/ORD/volumes/',
        snapshots: base + '/api/cloud/users/hub_cap/block_storage/ORD/snapshots/',
        databases: base + '/api/cloud/users/hub_cap/dbaas/ORD/instances/',
        loadbalancers: base + '/api/cloud/users/hub_cap/lbaas/ORD/',
        networks: base + '/api/cloud/users/hub_cap/networks/ORD/'
    },

    'https://encore.rackspace.com': {
        nextGenServers: base + '/api/cloud/users/hub_cap/servers/ORD/', 
        firstGenServers: base + '/api/cloud/users/hub_cap/firstgen/servers/',
        volumes: base + '/api/cloud/users/hub_cap/block_storage/ORD/volumes/',
        snapshots: base + '/api/cloud/users/hub_cap/block_storage/ORD/snapshots/',
        databases: base + '/api/cloud/users/hub_cap/dbaas/ORD/instances/',
        loadbalancers: base + '/api/cloud/users/hub_cap/lbaas/ORD/',
        networks: base + '/api/cloud/users/hub_cap/networks/ORD/'
    }
};

module.exports = endpoints[base] || endpoints['https://staging.encore.rackspace.com'];

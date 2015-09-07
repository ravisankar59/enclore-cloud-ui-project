angular.module('encore.svcs.cloud.config')
    .factory('CLOUD_URL_BASE', function ($routeParams) {
        return '/cloud/' + $routeParams.accountNumber + '/' + $routeParams.user;
    })
    .factory('CLOUD_URL', function (CLOUD_URL_BASE) {
        return {
            servers: CLOUD_URL_BASE + '/servers',
            images: CLOUD_URL_BASE + '/images',
            volumes: CLOUD_URL_BASE + '/cbs/volumes',
            snapshots: CLOUD_URL_BASE + '/cbs/snapshots',
            databases: CLOUD_URL_BASE + '/databases/instances',
            loadbalancers: CLOUD_URL_BASE + '/loadbalancers',
            networks: CLOUD_URL_BASE + '/networks',
            cdn: CLOUD_URL_BASE + '/cdn/services',
            heat: CLOUD_URL_BASE + '/heat'
        };
    })
    .constant('API_URL_BASE', '/api/cloud')
    .constant('NEXTGEN_FLAVOR_CLASS_TITLES', [
        { id: 'io', title: 'I/O' },
        { id: 'performance1', title: 'Performance 1' },
        { id: 'performance2', title: 'Performance 2' }
    ])
    .constant('PRODUCT_VERSIONS', {
        'Cloud Block Storage': 'beta',
        'Load Balancers': 'alpha'
    });
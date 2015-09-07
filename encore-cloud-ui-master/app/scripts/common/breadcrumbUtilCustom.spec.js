describe('Service: BreadcrumbUtil', function () {
    var breadcrumbUtil;
    var locationInfo = { path: '' };
    var locationMock = function () {
        return {
            path: function () {
                return locationInfo.path;
            },
            port: sinon.stub(),
            absUrl: function () { return 'abc';  },
            hash: sinon.stub()
        };
    };

    var mockRoutePaths = {
        'badRoute': {
            pathName: 'Bad',
            detailName: 'NoName'
        },
        'uriRoute': {
            uri: '/:bad/uri'
        },
	    'slashRoute': {
            uri: '/:bad/:bad2/servers:optional?',
            pathName: 'Slash',
            detailName: 'SlashEnding'
        },
        'serversList': {
            uri: '/:accountNumber/:user/servers',
            pathName: 'Servers',
            detailName: 'Overview'
        },
        'serverCreate': {
            uri: '/:accountNumber/:user/servers/create/:imageId?',
            parent: 'serversList',
            detailName: 'Create New Server'
        },
        'imagesList': {
            uri: '/:accountNumber/:user/images',
            pathName: 'Images',
            detailName: 'Overview'
        },
        'imagesNextGen': {
            uri: '/:accountNumber/:user/images/:region/:imageid',
            parent: 'imagesList',
            detailName: 'Image Details'
        },
        'firstGenDetails': {
            uri: '/:accountNumber/:user/servers/firstgen/:serverid',
            parent: 'serversList',
            detailName: 'Server Details'
        },
        'nextGenDetails': {
            uri: '/:accountNumber/:user/servers/:region/:serverid',
            parent: 'serversList',
            detailName: 'Server Details'
        },
        'volumeCreate': {
            uri: '/:accountNumber/:user/cbs/volumes/create',
            parent: 'volumesList',
            detailName: 'Create New Volume'
        },
        'volumesList': {
            uri: '/:accountNumber/:user/cbs/volumes',
            pathName: 'Cloud Block Storage',
            detailName: 'All Volumes'
        },
        'volumeDetails': {
            uri: '/:accountNumber/:user/cbs/volumes/:region/:volumeid',
            parent: 'volumesList',
            detailName: 'Volume Details'
        },
        'snapshotsList': {
            uri: '/:accountNumber/:user/cbs/snapshots',
            pathName: 'Cloud Block Storage',
            detailName: 'All Snapshots'
        },
        'instanceList': {
            uri: '/:accountNumber/:user/databases/instances',
            pathName: 'Instances',
            detailName: 'All Database Instances'
        },
        'instanceDetails': {
            uri: '/:accountNumber/:user/databases/instances/:region/:instanceid',
            parent: 'instanceList',
            detailName: 'Instance Details'
        },
        'instanceCreate': {
            uri: '/:accountNumber/:user/databases/instances/create',
            parent: 'instanceList',
            detailName: 'Create'
        },
        'loadBalancerList': {
            uri: '/:accountNumber/:user/loadbalancers',
            pathName: 'Load Balancers',
            detailName: 'All Load Balancers'
        },
        'loadBalancerDetails': {
            uri: '/:accountNumber/:user/loadbalancers/:region/:loadbalancerid',
            parent: 'loadBalancerList',
            detailName: 'Load Balancer Details'
        },
        'loadBalancerHistoricalUsage': {
            uri: '/:accountNumber/:user/loadbalancers/:region/:loadbalancerid/historicalusage',
            parent: 'loadBalancerDetails',
            detailName: 'Historical Usage'
        },
        'loadBalancerCreate': {
            uri: '/:accountNumber/:user/loadbalancers/create',
            parent: 'loadBalancerList',
            detailName: 'Create Load Balancer'
        },
        'networksList': {
            uri: '/:accountNumber/:user/networks',
            pathName: 'Networks',
            detailName: 'All Networks'
        },
        'networkCreate': {
            uri: '/:accountNumber/:user/networks/create',
            parent: 'networksList',
            detailName: 'Create Network'
        }
    };

    var mockProductVersions = {
        'Servers': 'alpha',
        'Images': 'alpha',
        'Cloud Block Storage': 'alpha',
        'Instances': 'beta',
        'Load Balancers': 'alpha',
        'Networks': 'beta'
    };

    beforeEach(function () {
        module('encore.svcs.cloud.common');
        module(function ($provide) {
            $provide.factory('$route', function () {
                return {
                    current: { pathParams: { accountNumber: '323676', user: 'hub_cap',
                        region: 'STAGING', loadbalancerid: '57361' }}
                };
            });
            $provide.factory('$location', locationMock);
            $provide.factory('$routeParams', function () {
                return {
                    accountNumber: '323676',
                    user: 'hub_cap',
                    region: 'STAGING',
                    loadbalancerid: '57361'
                };
            });
            $provide.constant('ROUTE_PATHS', mockRoutePaths);
            $provide.constant('PRODUCT_VERSIONS', mockProductVersions);
        });

        inject(function (BreadcrumbUtilCustom) {
            breadcrumbUtil = BreadcrumbUtilCustom;
        });
    });

    it('should not generate breadcrumbs when it can\'t match a route', function () {
        locationInfo.path = '/stuff/things';
        var breadcrumbs = breadcrumbUtil.setup('cloud');
        expect(breadcrumbs).to.be.undefined;
    });

    it('should not generate breadcrumbs when it can\'t match a route', function () {
        locationInfo.path = '/bad/uri';
        var breadcrumbs = breadcrumbUtil.setup('cloud');
        expect(breadcrumbs).to.be.undefined;
    });

    it('should return the correct non-prefixed serverCreate breadcrumbs', function () {
        locationInfo.path = '/323676/hub_cap/servers/create';
        var breadcrumbs = breadcrumbUtil.setup();
        expect(breadcrumbs[0].path).to.equal('/323676/hub_cap');
        expect(breadcrumbs[1].path).to.equal('/323676/hub_cap/servers');
        expect(breadcrumbs[1].name).to.equal('Servers');
        expect(breadcrumbs[2].name).to.equal('Create New Server');
    });

    it('should return the correct serversList breadcrumbs', function () {
        locationInfo.path = '/323676/hub_cap/servers';
        var breadcrumbs = breadcrumbUtil.setup('cloud');
        expect(breadcrumbs[0].path).to.equal('/cloud/323676/hub_cap');
        expect(breadcrumbs[1].path).to.equal('/cloud/323676/hub_cap/servers');
        expect(breadcrumbs[1].name).to.equal('Servers');
        expect(breadcrumbs[2].name).to.equal('Overview');

    });

    it('should return the correct serverCreate breadcrumbs', function () {
        locationInfo.path = '/323676/hub_cap/servers/create';
        var breadcrumbs = breadcrumbUtil.setup('cloud');
        expect(breadcrumbs[0].path).to.equal('/cloud/323676/hub_cap');
        expect(breadcrumbs[1].path).to.equal('/cloud/323676/hub_cap/servers');
        expect(breadcrumbs[1].name).to.equal('Servers');
        expect(breadcrumbs[2].name).to.equal('Create New Server');
    });

    it('should return the correct volumesList breadcrumbs', function () {
        locationInfo.path = '/323676/hub_cap/cbs/volumes';
        var breadcrumbs = breadcrumbUtil.setup('cloud');
        expect(breadcrumbs[0].path).to.equal('/cloud/323676/hub_cap');
        expect(breadcrumbs[1].path).to.equal('/cloud/323676/hub_cap/cbs/volumes');
        expect(breadcrumbs[1].name).to.equal('Cloud Block Storage');
        expect(breadcrumbs[2].name).to.equal('All Volumes');
    });
    it('should return the correct volumeCreate breadcrumbs', function () {
        locationInfo.path = '/323676/hub_cap/cbs/volumes/create';
        var breadcrumbs = breadcrumbUtil.setup('cloud');
        expect(breadcrumbs[0].path).to.equal('/cloud/323676/hub_cap');
        expect(breadcrumbs[1].path).to.equal('/cloud/323676/hub_cap/cbs/volumes');
        expect(breadcrumbs[1].name).to.equal('Cloud Block Storage');
        expect(breadcrumbs[2].name).to.equal('Create New Volume');
    });
    it('should return the correct snapshotsList breadcrumbs', function () {
        locationInfo.path = '/323676/hub_cap/cbs/snapshots';
        var breadcrumbs = breadcrumbUtil.setup('cloud');
        expect(breadcrumbs[0].path).to.equal('/cloud/323676/hub_cap');
        expect(breadcrumbs[1].path).to.equal('/cloud/323676/hub_cap/cbs/snapshots');
        expect(breadcrumbs[1].name).to.equal('Cloud Block Storage');
        expect(breadcrumbs[2].name).to.equal('All Snapshots');
    });
    it('should return the correct instanceList breadcrumbs', function () {
        locationInfo.path = '/323676/hub_cap/databases/instances';
        var breadcrumbs = breadcrumbUtil.setup('cloud');
        expect(breadcrumbs[0].path).to.equal('/cloud/323676/hub_cap');
        expect(breadcrumbs[1].path).to.equal('/cloud/323676/hub_cap/databases/instances');
        expect(breadcrumbs[1].name).to.equal('Instances');
        expect(breadcrumbs[2].name).to.equal('All Database Instances');
    });
    it('should return the correct instanceCreate breadcrumbs', function () {
        locationInfo.path = '/323676/hub_cap/databases/instances/create';
        var breadcrumbs = breadcrumbUtil.setup('cloud');
        expect(breadcrumbs[0].path).to.equal('/cloud/323676/hub_cap');
        expect(breadcrumbs[1].path).to.equal('/cloud/323676/hub_cap/databases/instances');
        expect(breadcrumbs[1].name).to.equal('Instances');
        expect(breadcrumbs[2].name).to.equal('Create');
    });
    it('should return the correct loadBalancerList breadcrumbs', function () {
        locationInfo.path = '/323676/hub_cap/loadbalancers';
        var breadcrumbs = breadcrumbUtil.setup('cloud');
        expect(breadcrumbs[0].path).to.equal('/cloud/323676/hub_cap');
        expect(breadcrumbs[1].path).to.equal('/cloud/323676/hub_cap/loadbalancers');
        expect(breadcrumbs[1].name).to.equal('Load Balancers');
        expect(breadcrumbs[2].name).to.equal('All Load Balancers');
    });
    it('should return the correct loadBalancer details breadcrumbs', function () {
        locationInfo.path = '/323676/hub_cap/loadbalancers/STAGING/57361';
        var breadcrumbs = breadcrumbUtil.setup('cloud');
        expect(breadcrumbs[0].path).to.equal('/cloud/323676/hub_cap');
        expect(breadcrumbs[0].name).to.equal('User hub_cap');

        expect(breadcrumbs[1].path).to.equal('/cloud/323676/hub_cap/loadbalancers');
        expect(breadcrumbs[1].name).to.equal('Load Balancers');

        expect(breadcrumbs[2].name).to.equal('Load Balancer Details');
    });
    it('should return the correct loadBalancer historical usage breadcrumbs', function () {
        locationInfo.path = '/323676/hub_cap/loadbalancers/STAGING/57361/historicalusage';
        var breadcrumbs = breadcrumbUtil.setup('cloud');
        expect(breadcrumbs[0].path).to.equal('/cloud/323676/hub_cap');
        expect(breadcrumbs[0].name).to.equal('User hub_cap');

        expect(breadcrumbs[1].path).to.equal('/cloud/323676/hub_cap/loadbalancers');
        expect(breadcrumbs[1].name).to.equal('Load Balancers');

        expect(breadcrumbs[2].path).to.equal('/cloud/323676/hub_cap/loadbalancers/STAGING/57361');
        expect(breadcrumbs[2].name).to.equal('Load Balancer Details');

        expect(breadcrumbs[3].name).to.equal('Historical Usage');
    });
    it('should return the correct loadBalancerCreate breadcrumbs', function () {
        locationInfo.path = '/323676/hub_cap/loadbalancers/create';
        var breadcrumbs = breadcrumbUtil.setup('cloud');
        expect(breadcrumbs[0].path).to.equal('/cloud/323676/hub_cap');
        expect(breadcrumbs[0].name).to.equal('User hub_cap');
        expect(breadcrumbs[1].path).to.equal('/cloud/323676/hub_cap/loadbalancers');
        expect(breadcrumbs[1].name).to.equal('Load Balancers');
    });
    it('should return the correct networksList breadcrumbs', function () {
        locationInfo.path = '/323676/hub_cap/networks';
        var breadcrumbs = breadcrumbUtil.setup('cloud');
        expect(breadcrumbs[0].path).to.equal('/cloud/323676/hub_cap');
        expect(breadcrumbs[1].path).to.equal('/cloud/323676/hub_cap/networks');
        expect(breadcrumbs[1].name).to.equal('Networks');
        expect(breadcrumbs[2].name).to.equal('All Networks');
    });
    it('should return the correct networkCreate breadcrumbs', function () {
        locationInfo.path = '/323676/hub_cap/networks/create';
        var breadcrumbs = breadcrumbUtil.setup('cloud');
        expect(breadcrumbs[0].path).to.equal('/cloud/323676/hub_cap');
        expect(breadcrumbs[1].path).to.equal('/cloud/323676/hub_cap/networks');
        expect(breadcrumbs[1].name).to.equal('Networks');
        expect(breadcrumbs[2].name).to.equal('Create Network');
    });
});

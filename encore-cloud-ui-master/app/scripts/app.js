'use strict';

angular.module('encore', ['encore.svcs.cloud.common', 'encore.svcs.cloudControl']);
angular.module('servers', ['encore', 'cbs', 'networks',
                           'encore.svcs.encore', 'encore.svcs.cloud.servers', 'rxReachLink', 'rxCloudControlLink']);
angular.module('cbs', ['encore', 'encore.svcs.cloud.servers', 'encore.svcs.cloud.cbs']);
angular.module('networks', ['encore', 'encore.svcs.cloud.networks']);
angular.module('databases', ['encore', 'encore.svcs.cloud.dbaas']);
angular.module('loadbalancers', ['encore', 'encore.svcs.cloud.servers', 'rxDateRange']);
angular.module('images', ['encore', 'encore.svcs.cloud.servers', 'encore.svcs.cloud.image']);
angular.module('cdn', ['encore', 'encore.svcs.cloud.cdn']);
angular.module('heat', ['ngRoute', 'encore.ui.rxEnvironment',
                        'encore.ui.rxNotify', 'encore.svcs.cloud.common', 'encore.ui.rxSession']);
angular.module('backup', ['encore.svcs.cloud', 'ngRoute', 'encore.ui.rxEnvironment', 'encore.ui.rxNotify',
    'encore.svcs.cloud.common', 'encore.ui.rxSession']);

angular.module('cloud',
    ['encore.svcs.cloud.config', 'ngRoute', 'ngResource', 'ui.bootstrap', 'encore.ui', 'encore.ui.rxModalAction',
        'servers', 'cbs', 'networks', 'databases', 'loadbalancers', 'networks', 'images', 'encore.svcs.cloud.common',
        'encore.svcs.supportService', 'cdn', 'heat', 'backup'])
    .constant('ROUTE_PATHS', {
        // SERVERS
        'listServers': {
            uri: '/:accountNumber/:user/servers',
            pathName: 'Servers',
            detailName: 'Overview'
        },
        'createServer': {
            uri: '/:accountNumber/:user/servers/create/:imageRegion?/:imageId?',
            parent: 'listServers',
            detailName: 'Create New Server'
        },
        'showFirstGenServer': {
            uri: '/:accountNumber/:user/servers/firstgen/:serverId',
            parent: 'listServers',
            detailName: 'Server Details'
        },
        'showNextGenServer': {
            uri: '/:accountNumber/:user/servers/:region/:serverId',
            parent: 'listServers',
            detailName: 'Server Details'
        },
        // SERVER IMAGES
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
        // BLOCK STORAGE VOLUMES
        'createVolume': {
            uri: '/:accountNumber/:user/cbs/volumes/create',
            parent: 'listVolumes',
            detailName: 'Create New Volume'
        },
        'listVolumes': {
            uri: '/:accountNumber/:user/cbs/volumes',
            pathName: 'Cloud Block Storage',
            detailName: 'All Volumes'
        },
        'showVolume': {
            uri: '/:accountNumber/:user/cbs/volumes/:region/:volumeid',
            parent: 'listVolumes',
            detailName: 'Volume Details'
        },
        // BLOCK STORAGE SNAPSHOTS
        'listSnapshots': {
            uri: '/:accountNumber/:user/cbs/snapshots',
            pathName: 'Cloud Block Storage',
            detailName: 'All Snapshots'
        },
        'showSnapshot': {
            uri: '/:accountNumber/:user/cbs/snapshots/:region/:snapshotid',
            parent: 'listSnapshots',
            detailName: 'Snapshot Details'
        },
        // DATABASES
        'listInstances': {
            uri: '/:accountNumber/:user/databases/instances',
            pathName: 'Instances',
            detailName: 'All Database Instances'
        },
        'showInstance': {
            uri: '/:accountNumber/:user/databases/instances/:region/:instanceid',
            parent: 'listInstances',
            detailName: 'Instance Details'
        },
        'instanceCreate': {
            uri: '/:accountNumber/:user/databases/instances/create',
            parent: 'listInstances',
            detailName: 'Create'
        },
        // LOAD BALANCERS
        'listLoadBalancers': {
            uri: '/:accountNumber/:user/loadbalancers',
            pathName: 'Load Balancers',
            detailName: 'All Load Balancers'
        },
        'showLoadBalancer': {
            uri: '/:accountNumber/:user/loadbalancers/:region/:loadbalancerid',
            parent: 'listLoadBalancers',
            detailName: 'Load Balancer Details'
        },
        'loadBalancerHistoricalUsage': {
            uri: '/:accountNumber/:user/loadbalancers/:region/:loadbalancerid/historicalusage',
            parent: 'showLoadBalancer',
            detailName: 'Historical Usage'
        },
        'createLoadBalancer': {
            uri: '/:accountNumber/:user/loadbalancers/create',
            parent: 'listLoadBalancers',
            detailName: 'Create Load Balancer'
        },
        // NETWORKS
        'listNetworks': {
            uri: '/:accountNumber/:user/networks',
            pathName: 'Networks',
            detailName: 'All Networks'
        },
        'createNetwork': {
            uri: '/:accountNumber/:user/networks/create',
            parent: 'listNetworks',
            detailName: 'Create Network'
        },
        // CDN
        'cdnListServices': {
            uri: '/:accountNumber/:user/cdn/services',
            pathName: 'CDN Services',
            detailName: 'All CDN Services'
        },
        'cdnShowService': {
            uri: '/:accountNumber/:user/cdn/services/:serviceId',
            parent: 'cdnListServices',
            detailName: 'CDN Service Details'
        },
        'showHeat': {
            uri: '/:accountNumber/:user/heat',
            pathName: 'Cloud Orchestration (Heat)',
            detailName: 'Heat'
        },
        'showBackup': {
            uri: '/:accountNumber/:user/backup',
            pathName: 'Cloud Backup'
        },
        'cloudMonitoring': {
            uri: '/monitoring/:accountNumber/:user',
            pathName: 'Cloud Monitoring'
        },
        'cloudFiles': {
            uri: '/files/:accountNumber/:user',
            pathName: 'Cloud Files'
        }
    })
    .config(function ($routeProvider, $locationProvider, $httpProvider, $windowProvider, ROUTE_PATHS) {
        $routeProvider
            .when('/home', {
                templateUrl: 'views/home/home.html'
            })
            // Servers
            .when(ROUTE_PATHS.listServers.uri, {
                templateUrl: 'views/servers/ListServers.html',
                controller: 'ListServersCtrl'
            })
            .when(ROUTE_PATHS.createServer.uri, {
                templateUrl: 'views/servers/CreateServer.html',
                controller: 'CreateServerCtrl'
            })
            .when(ROUTE_PATHS.imagesList.uri, {
                templateUrl: 'views/images/ListImages.html',
                controller: 'ListImagesCtrl'
            })
            .when(ROUTE_PATHS.imagesNextGen.uri, {
                templateUrl: 'views/images/ShowImage.html',
                controller: 'ShowNextGenImageCtrl'
            })
            .when(ROUTE_PATHS.showFirstGenServer.uri, {
                templateUrl: 'views/servers/ShowServer.html',
                controller: 'ShowFirstGenServerCtrl'
            })
            .when(ROUTE_PATHS.showNextGenServer.uri, {
                templateUrl: 'views/servers/ShowServer.html',
                controller: 'ShowNextGenServerCtrl'
            })
            // Cloud Block Storage
            .when(ROUTE_PATHS.listVolumes.uri, {
                templateUrl: 'views/cbs/ListVolumes.html',
                controller: 'ListVolumesCtrl',
                title: 'Cloud Block Storage - Volumes'
            })
            .when(ROUTE_PATHS.showVolume.uri, {
                templateUrl: 'views/cbs/ShowVolume.html',
                controller: 'ShowVolumeCtrl',
                title: 'Cloud Block Storage - Volume Details'
            })
            .when(ROUTE_PATHS.createVolume.uri, {
                templateUrl: 'views/cbs/CreateVolume.html',
                controller: 'CreateVolumeCtrl'
            })
            .when(ROUTE_PATHS.listSnapshots.uri, {
                templateUrl: 'views/cbs/ListSnapshots.html',
                controller: 'ListSnapshotsCtrl',
                title: 'Cloud Block Storage - Snapshots'
            })
            .when(ROUTE_PATHS.showSnapshot.uri, {
                templateUrl: 'views/cbs/ShowSnapshot.html',
                controller: 'ShowSnapshotCtrl',
                title: 'Cloud Block Storage - Snapshot Details'
            })
            // DBaaS
            .when(ROUTE_PATHS.listInstances.uri, {
                templateUrl: 'views/dbaas/ListInstances.html',
                controller: 'ListInstancesCtrl',
                title: 'Databases - Instances'
            })
            .when(ROUTE_PATHS.instanceCreate.uri, {
                templateUrl: 'views/dbaas/CreateInstance.html',
                controller: 'CreateInstanceCtrl',
                title: 'Databases - Create Instance'
            })
            .when(ROUTE_PATHS.showInstance.uri, {
                templateUrl: 'views/dbaas/ShowInstance.html',
                controller: 'ShowInstanceCtrl',
                title: 'Databases - Instance Details'
            })
            // Load Balancers
            .when(ROUTE_PATHS.listLoadBalancers.uri, {
                templateUrl: 'views/lbaas/ListLoadBalancers.html',
                controller: 'ListLoadBalancersCtrl'
            })
            .when(ROUTE_PATHS.showLoadBalancer.uri, {
                templateUrl: 'views/lbaas/ShowLoadBalancer.html',
                controller: 'ShowLoadBalancerCtrl',
                title: 'Load Balancer Details'
            })
            .when(ROUTE_PATHS.createLoadBalancer.uri, {
                templateUrl: 'views/lbaas/CreateLoadBalancer.html',
                controller: 'CreateLoadBalancerCtrl'
            })
            .when(ROUTE_PATHS.loadBalancerHistoricalUsage.uri, {
                templateUrl: 'views/lbaas/ViewHistoricalUsage.html',
                controller: 'ViewHistoricalUsageCtrl',
                title: 'Historical Usage'
            })
            // Networks
            .when(ROUTE_PATHS.listNetworks.uri, {
                templateUrl: 'views/networks/ListNetworks.html',
                controller: 'ListNetworksCtrl'
            })
            .when(ROUTE_PATHS.createNetwork.uri, {
                templateUrl: 'views/networks/CreateNetwork.html',
                controller: 'CreateNetworkCtrl'
            })
            // CDN
            .when(ROUTE_PATHS.cdnListServices.uri, {
                templateUrl: 'views/cdn/ListServices.html',
                controller: 'ListServicesCtrl'
            })
            .when(ROUTE_PATHS.cdnShowService.uri, {
                templateUrl: 'views/cdn/ShowService.html',
                controller: 'ShowServiceCtrl'
            })
            .when(ROUTE_PATHS.showHeat.uri, {
                templateUrl: 'views/heat/ShowHeat.html',
                controller: 'ShowHeatCtrl'
            })
            .when(ROUTE_PATHS.showBackup.uri, {
                templateUrl: 'views/backup/ShowBackup.html',
                controller: 'ShowBackupCtrl'
            })
            // Cloud Monitoring
            // Redirect to Cloud Monitoring app by doing
            // a full browser refresh, so it has a chance to go
            // back to nginx to get routed. Cloud's Angular router
            // will cause an infinite loop.
            .when(ROUTE_PATHS.cloudMonitoring.uri, {
                redirectTo: function (params, path) {
                    $windowProvider.$get().location = '/cloud' + path;
                }
            })
            .when(ROUTE_PATHS.cloudFiles.uri, {
                redirectTo: function (params, path) {
                    $windowProvider.$get().location = '/cloud' + path;
                }
            })
            .otherwise({
                redirectTo: '/home'
            });

        $locationProvider.html5Mode(true).hashPrefix('!');
        $httpProvider.interceptors.push('TokenInterceptor'); //Injects auth token id into api calls
        $httpProvider.interceptors.push('UnauthorizedInterceptor'); //Redirects user to login page on 401
    }).run(function ($rootScope, $http, $window, $route, Auth, Environment,
            rxBreadcrumbsSvc, BreadcrumbUtilCustom, PRODUCT_VERSIONS) {
        $rootScope.$on('$routeChangeStart', function () {
            if (!Environment.isLocal() && !Auth.isAuthenticated()) {
                $window.location = '/login?redirect=' + $window.location.pathname;
                return;
            }
        });

        $rootScope.$on('$viewContentLoaded', function () {
            var breadcrumbs = BreadcrumbUtilCustom.setup('cloud');
            rxBreadcrumbsSvc.set(breadcrumbs);

        });

        $rootScope.PRODUCT_VERSIONS = PRODUCT_VERSIONS;

        // Forces JSON only
        $http.defaults.headers.common['Accept'] = 'application/json';

    });

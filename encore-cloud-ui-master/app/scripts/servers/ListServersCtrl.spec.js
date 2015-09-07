describe('Controller: ListServersCtrl', function () {
    var ctrl, httpBackend, notifySvc, cloudServerLoadersSvc;

    var nextGenServersHandler = {}, firstGenServersHandler, catalogServiceHandler;

    var nextGenServers = {
        ord: {
            servers: [
                { id: 'next-server1', name: 'NextGenServer1', region: 'ORD', status: 'ACTIVE' },
                { id: 'next-server2', name: 'NextGenServer2', region: 'ORD', status: 'ACTIVE' },
                { id: 'next-server3', name: 'NextGenServer3', region: 'ORD', status: 'ACTIVE' }
            ]
        },
        dfw: {
            servers: [
                { id: 'next-server1', name: 'NextGenServer1', region: 'ORD', status: 'ACTIVE' },
                { id: 'next-server2', name: 'NextGenServer2', region: 'ORD', status: 'ACTIVE' },
                { id: 'next-server3', name: 'NextGenServer3', region: 'ORD', status: 'ACTIVE' }
            ]
        }
    };

    var firstGenServers = {
        servers: [
            { id: 'first-server1', name: 'FirstGenServer1', region: 'DFW', status: 'ACTIVE' },
            { id: 'first-server2', name: 'FirstGenServer2', region: 'DFW', status: 'ACTIVE' },
            { id: 'first-server3', name: 'FirstGenServer3', region: 'DFW', status: 'ACTIVE' }
        ]
    };

    var validRouteParams = {
        'user': 'hub_cap',
        'accountNumber': '323676'
    };

    var serviceCatalogWithoutFirstGen = {
        endpoints: [{
            type: 'compute',
            region: 'ORD'
        }, {
            type: 'compute',
            region: 'DFW'
        }]
    };

    var serviceCatalogWithFirstGen = {
        endpoints: [{
            type: 'compute',
            region: 'ORD'
        }, {
            type: 'compute',
            region: 'DFW'
        }, {
            id: 'firstGenImage1',
            name: 'cloudServers',
            publicUrl: 'https://servers.api.staging.us.ccp.rackspace.net/v1.0/firstGenImage1',
            region: null,
            tenantId: '123456',
            type: 'compute'
        }]
    };

    var rxBreadcrumbsSvcMock = {
        set: sinon.spy()
    };

    var populateScope = function (routeParams) {
        var scope;
        module('encore.ui');
        module('encore.svcs.cloud.config');
        module('servers');

        inject(function ($controller, $rootScope, $httpBackend, rxNotify, CloudServerLoaders) {
            httpBackend = $httpBackend;

            nextGenServersHandler.ord = httpBackend.when('GET', '/api/cloud/users/hub_cap/servers/ORD');
            nextGenServersHandler.dfw = httpBackend.when('GET', '/api/cloud/users/hub_cap/servers/DFW');
            firstGenServersHandler = httpBackend.when('GET', '/api/cloud/users/hub_cap/firstgen/servers');
            catalogServiceHandler =  httpBackend.when('GET', '/api/cloud/users/hub_cap/service_catalog');

            scope = $rootScope.$new();
            notifySvc = rxNotify;
            cloudServerLoadersSvc = CloudServerLoaders;

            ctrl = $controller('ListServersCtrl', {
                $scope: scope,
                $routeParams: routeParams,
                rxBreadcrumbsSvc: rxBreadcrumbsSvcMock,
                CloudServerLoaders: cloudServerLoadersSvc
            });
        });
        return scope;

    };

    describe('Load Servers for User', function () {
        var scope;
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            nextGenServersHandler.ord.respond(nextGenServers.ord, {});
            nextGenServersHandler.dfw.respond(nextGenServers.dfw, {});
            firstGenServersHandler.respond(firstGenServers, {});
            catalogServiceHandler.respond(serviceCatalogWithFirstGen, {});
        });

        it('should have an empty list of servers', function () {
            expect(ctrl).to.exist;
            expect(scope.servers.length).to.eq(0);
        });

        it('should append servers as it receives them', function () {
            expect(scope.servers.length).to.eq(0);
            httpBackend.flush();
            expect(scope.servers.length).to.eq(12);
        });

        it('should display notifications on errors', function () {
            expect(scope.servers.length).to.eq(0);
            firstGenServersHandler.respond(400, {
            });
            nextGenServersHandler.dfw.respond(400, {
            });

            httpBackend.flush();
            expect(scope.servers.length).to.eq(3);

            expect(notifySvc.stacks.page).to.not.be.empty;
            expect(_.last(notifySvc.stacks.page).type).to.eq('error');
        });
    });

    describe('Load Servers for user without FirsGen in service catalog', function () {
        var scope;
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            nextGenServersHandler.ord.respond(nextGenServers.ord, {});
            nextGenServersHandler.dfw.respond(nextGenServers.dfw, {});
            firstGenServersHandler.respond(firstGenServers, {});
            catalogServiceHandler.respond(serviceCatalogWithoutFirstGen, {});
            sinon.spy(cloudServerLoadersSvc, 'loadFirstGenServers');
        });

        it('should append only NextGen servers as it receives them', function () {
            expect(scope.servers.length).to.eq(0);
            httpBackend.flush();
            expect(scope.servers.length).to.eq(6);
        });
    });

});

describe('Controller: ShowFirstGenServerCtrl', function () {
    var httpBackend, ctrl, q, location, firstgenservers, scope, server;

    var validRouteParams = {
        'user': 'uk_william',
        'accountNumber': '10323676',
        'serverId': '5ae2222c-b39d-4eeb-b4f8-eb9b97a89d1f',
        'region': 'LON'
    };

    var firstGenServerDetails = {
        'server': {
            'status': 'ACTIVE',
            'name': 'UK Server',
            'region': 'LON',
            'user_id': '295',
            'tenant_id': '10323676',
            'host_id': 'c9ad727ea68dbfa26c75414168ded823e3cbc53756b0fb884c0dec2d',
            'id': '5ae2222c-b39d-4eeb-b4f8-eb9b97a89d1f',
            'addresses': [
                {
                    'version': 4,
                    'ip_type': 'private',
                    'ip_address': '10.182.76.126'
                }, {
                    'version': 6,
                    'ip_type': 'public',
                    'ip_address': '2001:4801:7808:0052:07b4:0a0b:ff00:2917'
                }
            ]
        }
    };

    var populateScope = function (routeParams) {
        var scope;
        module('encore.ui');
        module('encore.svcs.cloud.config');
        module('servers');

        inject(function ($httpBackend, $controller, $rootScope, $q, $location, FirstGenServers) {
            httpBackend = $httpBackend;
            scope = $rootScope.$new();
            q = $q;
            location = $location;
            firstgenservers = FirstGenServers;

            sinon.spy(firstgenservers, 'get');

            ctrl = $controller('ShowFirstGenServerCtrl', {
                $scope: scope,
                $location: location,
                $routeParams: routeParams,
                $q: q,
                FirstGenServers: firstgenservers
            });

        });
        return scope;
    };

    beforeEach(function () {
        scope = populateScope(validRouteParams);
        server = firstGenServerDetails;

        /* jshint maxlen: false */
        httpBackend.whenGET('/api/cloud/users/uk_william/firstgen/servers/5ae2222c-b39d-4eeb-b4f8-eb9b97a89d1f').respond(server);
        httpBackend.whenGET('/api/cloud/users/uk_william/firstgen/servers/5ae2222c-b39d-4eeb-b4f8-eb9b97a89d1f/backup_schedule').respond({});
        httpBackend.flush();
    });

    describe('UK FirstGen Server Detail', function () {

        it('should load UK server', function () {
            expect(ctrl).to.exist;
            scope.loadServer();
            sinon.assert.called(firstgenservers.get);
        });

        it('should determine UK backstage link', function () {
            /* jshint maxlen: false */
            expect(scope.backstage).to.equal('https://uk-backstage.slicehost.com/slices/5ae2222c-b39d-4eeb-b4f8-eb9b97a89d1f');
        });
    });
});

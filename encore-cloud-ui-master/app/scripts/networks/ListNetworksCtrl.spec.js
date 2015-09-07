describe('Controller: ListNetworksCtrl', function () {
    var ctrl, httpBackend, notifySvc;
    var networks;

    var validRouteParams = {
        'user': 'hub_cap',
        'accountNumber': '323676'
    };

    var serviceCatalog = {
        endpoints: [{
            type: 'compute',
            region: 'ORD'
        }]
    };

    var networksHandler;

    var rxBreadcrumbsSvcMock = {
        set: sinon.spy()
    };
    var populateScope = function (routeParams) {
        var scope;
        module('encore.ui');
        module('encore.svcs.cloud.config');
        module('networks');

        inject(function ($controller, $rootScope, $httpBackend, rxNotify) {
            httpBackend = $httpBackend;
            networks = {
                networks: [{ id: '00000000-0000-0000-0000-000000000000', label: 'public' },
                    { id: '11111111-1111-1111-1111-111111111111', label: 'private' },
                    { id: '2993e407-5531-4ca8-9d2a-0d13b5cac904', label: 'abcdeg' }]
            };

            httpBackend.when('GET', '/api/cloud/users/hub_cap/service_catalog')
                .respond(serviceCatalog, {});

            networksHandler = httpBackend.when('GET', '/api/cloud/users/hub_cap/networks/ORD');

            scope = $rootScope.$new();

            notifySvc = rxNotify;

            ctrl = $controller('ListNetworksCtrl', {
                $scope: scope,
                $routeParams: routeParams,
                rxBreadcrumbsSvc: rxBreadcrumbsSvcMock
            });
        });
        return scope;

    };

    describe('Load Networks for User', function () {
        var scope;
        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        it('should have an empty list of networks', function () {
            expect(ctrl).to.exist;
            expect(scope.networks.length).to.eq(0);
        });

        it('should append networks as it receives them', function () {
            expect(scope.networks.length).to.eq(0);
            networksHandler.respond(networks, {});
            httpBackend.flush();
            expect(scope.networks.length).to.eq(3);
        });

        it('should display notifications on errors', function () {
            expect(scope.networks.length).to.eq(0);
            networksHandler.respond(400, {
            });
            httpBackend.flush();
            expect(scope.networks.length).to.eq(0);

            expect(notifySvc.stacks.page).to.not.be.empty;
            expect(_.first(notifySvc.stacks.page).type).to.eq('error');
        });
    });

    describe('Delete Networks for User', function () {
        var scope;
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            networksHandler.respond(networks, {});
            httpBackend.flush();
        });

        it('should show errors when a failed request happens to delete a network', function () {
            var url = '/api/cloud/users/hub_cap/networks/ORD/11111111-1111-1111-1111-111111111111';
            var handler = httpBackend.whenDELETE(url);
            handler.respond(400, {
                error: 'stuff'
            }, {});

            expect(scope.networks.length).to.eq(3);
            scope.deleteNetwork(scope.networks[1]);
            scope.$digest();
            httpBackend.flush();
            expect(scope.networks.length).to.eq(3);

            expect(notifySvc.stacks.page).to.not.be.empty;
            expect(_.first(notifySvc.stacks.page).type).to.eq('error');
        });

        it('should delete a network', function () {
            var url = '/api/cloud/users/hub_cap/networks/ORD/2993e407-5531-4ca8-9d2a-0d13b5cac904';
            var handler = httpBackend.whenDELETE(url);
            handler.respond(200, {
                error: 'stuff'
            }, {});
            networksHandler.respond({
                networks: networks.networks.slice(0, 2)
            }, {});

            expect(scope.networks.length).to.eq(3);

            // Delete network & load networks again
            scope.deleteNetwork(scope.networks[2]);
            scope.$digest();
            httpBackend.flush();

            expect(scope.networks.length).to.eq(2);
            expect(notifySvc.stacks.page).to.not.be.empty;
            expect(_.first(notifySvc.stacks.page).type).to.eq('success');
        });
    });

});

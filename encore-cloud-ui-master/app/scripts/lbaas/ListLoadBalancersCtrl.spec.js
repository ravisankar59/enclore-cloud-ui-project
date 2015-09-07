describe('Controller: ListLoadBalancersCtrl', function () {
    var ctrl, location, q;
    var validRouteParams = {
        'user': 'hub_cap',
        'accountNumber': '323676'
    };

    var rxBreadcrumbsSvcMock = {
        set: sinon.spy()
    };

    var lbaasSvc;

    var populateScope = function (routeParams) {
        var scope;
        module('encore.ui');
        module('encore.ui.rxNotify');
        module('encore.svcs.cloud.config');
        module('loadbalancers');

        inject(function ($controller, $rootScope, $location, $q, Lbaas) {
            scope = $rootScope.$new();
            location = $location;
            q = $q;
            lbaasSvc = Lbaas;
            sinon.spy(lbaasSvc, 'updateContentCaching');

            ctrl = $controller('ListLoadBalancersCtrl', {
                $scope: scope,
                $location: location,
                $routeParams: routeParams,
                Lbaas: lbaasSvc,
                rxBreadcrumbsSvc: rxBreadcrumbsSvcMock
            });
        });
        return scope;
    };

    describe('load balancer content caching', function () {
        var scope;
        var loadBalancer = { contentCaching: { 'enabled': true }};
        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        it('should make a call to Lbaas service', function () {
            expect(ctrl).to.exist;
            scope.toggleContentCaching(loadBalancer);
            sinon.assert.called(lbaasSvc.updateContentCaching);
        });
        /* jshint ignore:start */
        it('ipAddressTooltip should return the expected text ', function () {
            var param = [{
                ip_address: '10.10.10.10',
                version: 'IPV4'
            },
            {
                ip_address: '13003:4801:79d2:0000:07b4:0a0b:0000:0001',
                version: 'IPV6'
            }];
            var expectedString = 'IPV4:10.10.10.10\nIPV6:13003:4801:79d2:0000:07b4:0a0b:0000:0001\n';
            var response = scope.ipAddressTooltip(param);
            expect(response).equal(expectedString);
        });
        /* jshint ignore:end */
    });
});

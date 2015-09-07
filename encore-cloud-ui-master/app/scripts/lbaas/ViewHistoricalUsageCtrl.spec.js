describe('Controller: ViewHistoricalUsageCtrl', function () {
    var httpBackend, ctrl, q, lbaasSvc, status, tableBoilerplate, filter;
    var validRouteParams = {
        'user': 'hub_cap',
        'accountNumber': '323676',
        'loadbalancerid': '57361',
        'region': 'STAGING'
    };

    var loadBalancerDetails = {
        'loadBalancer': {
            'name': 'lbaasDetails1',
            'protocol': 'HTTP',
            'port': 80,
            'algorithm': 'RANDOM',
            'timeout': 30
        }
    };

    var historicalUsage = {
        'load_balancer_usage_records': [
            {
                'outgoing_transfer': 0,
                'ssl_mode': 'OFF',
                'start_time': '2015-07-24T10:18:24Z',
                'average_num_connections_ssl': 0,
                'incoming_transfer_ssl': 0,
                'num_vips': 1,
                'outgoing_transfer_ssl': 0,
                'end_time': '2015-07-24T11:00:00Z',
                'vip_type': 'PUBLIC',
                'incoming_transfer': 0,
                'average_num_connections': 0,
                'num_polls': 9,
                'id': 5644867
            }
        ]
    };

    var populateScope = function (routeParams) {
        var scope;
        module('encore.ui');
        module('loadbalancers');

        inject(function ($httpBackend, $controller, $rootScope, $q, Lbaas,
                         Status, TableBoilerplate, $filter) {

            httpBackend = $httpBackend;
            scope = $rootScope.$new();
            q = $q;
            lbaasSvc = Lbaas;
            status = Status;
            tableBoilerplate = TableBoilerplate;
            filter = $filter;

            sinon.spy(lbaasSvc, 'getLoadBalancer');
            sinon.spy(lbaasSvc, 'getHistoricalUsage');

            ctrl = $controller('ViewHistoricalUsageCtrl', {
                $scope: scope,
                $routeParams: routeParams,
                $q: q,
                Lbaas: lbaasSvc,
                Status: status,
                TableBoilerplate: tableBoilerplate,
                $filter: filter
            });
        });
        return scope;
    };

    describe('Historical Usage LoadBalancer', function () {
        var scope;
        beforeEach(function () {
            scope = populateScope(validRouteParams);

            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
            httpBackend.whenGET(/hub_cap\/lbaas\/STAGING\/57361\/usage\?end_time=.*/
                ).respond(200, historicalUsage);
            httpBackend.flush();
        });

        it('should have called getLoadBalancer of lbaasService', function () {
            sinon.assert.called(lbaasSvc.getLoadBalancer);
        });

        it('should have called getHistoricalUsage of lbaasService', function () {
            sinon.assert.called(lbaasSvc.getHistoricalUsage);
            expect(scope.loadBalancer).to.eql(loadBalancerDetails.loadBalancer);
        });

        it('should have match load balancer object from lbaasService', function () {
            expect(scope.loadBalancer).to.eql(loadBalancerDetails.loadBalancer);
        });

        it('should have match historical usage object from lbaasService', function () {
            expect(scope.historicalUsages).to.eql(historicalUsage['load_balancer_usage_records']);
        });

    });

});
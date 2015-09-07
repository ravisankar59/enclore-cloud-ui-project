describe('Controller: UnSuspendLoadBalancerModalCtrl', function () {
    var httpBackend, ctrl, q, lbaasSvc, status, modalInstance, rxNotifySvc;
    var validRouteParams = {
        'user': 'hub_cap',
        'accountNumber': '323676',
        'loadbalancerid': '57361',
        'region': 'STAGING'
    };

    var populateScope = function (routeParams) {
        var scope;
        module('encore.ui');
        module('loadbalancers');

        inject(function ($httpBackend, $controller, $rootScope, $q, Lbaas,
                         Status, rxNotify) {

            httpBackend = $httpBackend;
            scope = $rootScope.$new();
            q = $q;
            modalInstance = {
                dismiss: function () {}
            };
            lbaasSvc = Lbaas;
            rxNotifySvc = rxNotify;
            status = Status;

            sinon.spy(lbaasSvc, 'unSuspendLoadBalancer');
            sinon.spy(rxNotifySvc, 'clear');
            sinon.spy(status, 'setSuccessImmediate');

            ctrl = $controller('UnSuspendLoadBalancerModalCtrl', {
                $scope: scope,
                $routeParams: routeParams,
                $q: q,
                $modalInstance: modalInstance,
                Lbaas: lbaasSvc,
                rxNotify: rxNotifySvc,
                Status: status
            });
        });
        return scope;
    };

    describe('Unsuspend LoadBalancer', function () {
        var scope;
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            scope.loadBalancer = {
                status: 'ABC',
                id: '123'
            };

			httpBackend.whenDELETE('/api/cloud/users/hub_cap/lbaas/STAGING/57361/suspend').respond(200);

			scope.unSuspendLoadBalancer();
			httpBackend.flush();
        });

        it('should have called unsuspendloadbalancer of lbaasService', function () {
            sinon.assert.called(lbaasSvc.unSuspendLoadBalancer);
        });

        it('should have called clear method of rxnotify service', function () {
            sinon.assert.calledWith(rxNotifySvc.clear, 'modal');
        });

        it('should have set load balancer status to active', function () {
            expect(scope.loadBalancer.status).to.equal('ACTIVE');
        });

        it('should have called status service method', function () {
			sinon.assert.calledWith(status.setSuccessImmediate,
				'Unsuspending Load Balancer is complete for id: 123');
        });
    });

});
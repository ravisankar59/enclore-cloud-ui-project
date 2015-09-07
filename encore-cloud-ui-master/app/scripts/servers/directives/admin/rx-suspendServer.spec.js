describe('Controller: rx-SuspendServer', function () {
    var scope, httpBackend, ctrl, novaAdmin, nextGenAdmin, instanceMock, statusMock;

    var routeParams = {
        'user': 'admin',
        'accountNumber': '323676',
        'serverId': '4321',
        'region': 'ORD'
    };

    var server = {
        name: 'Test Server',
        id: 123,
        status: 'ACTIVE'
    };

    var fields = {
        password: 'pass'
    };

    var authResponse = {
        'access': {
            'ORD': {
                'adminRegion': 'preprod-ord-rackeradminapi'
            }
        }
    };

    beforeEach(function () {
        module('encore.ui');
        module('encore.svcs.cloud.config');
        module('servers');

        inject(function ($httpBackend, $controller, $rootScope, $route, $routeParams, NovaAdmin, NextGenAdmin) {
            httpBackend = $httpBackend;
            scope = $rootScope.$new();
            novaAdmin = NovaAdmin;
            nextGenAdmin = NextGenAdmin;
            scope.server = server;
            scope.fields = fields;

            var instanceApi = {
                close: function () {},
                dismiss: function () {}
            };
            instanceMock = sinon.mock(instanceApi);

            var statusApi = {
                setSuccessNext: function () {},
                setError: function () {}
            };
            statusMock = sinon.mock(statusApi);

            sinon.spy(novaAdmin, 'authenticate');
            sinon.spy(nextGenAdmin, 'suspend');
            sinon.spy(nextGenAdmin, 'unsuspend');

            ctrl = $controller('rxSuspendServerCtrl', {
                $scope: scope,
                $route: $route,
                $routeParams: routeParams,
                $modalInstance: instanceApi,
                NextGenAdmin: nextGenAdmin,
                Status: statusApi
            });
        });

        return scope;
    });

    it('should authenticate and suspend server', function () {
        expect(ctrl).to.exist;
        httpBackend.expectPOST('/api/cloud/admin/nova/authenticate').respond(200, authResponse);
        httpBackend.expectPOST('/api/cloud/users/admin/nova/preprod-ord-rackeradminapi/4321/suspend').respond(200, {});

        statusMock.expects('setSuccessNext').withArgs('Server is now suspending.');
        statusMock.expects('setError').never();

        scope.submit('suspend');
        expect(scope.submitStatus.loading).to.be.true;

        httpBackend.flush();
        expect(scope.submitStatus.loading).to.be.true;

        // Authenticate
        sinon.assert.calledWith(novaAdmin.authenticate, {});

        // Suspend Server
        var suspendParams = { id: '4321', region: 'preprod-ord-rackeradminapi', user: 'admin' };
        sinon.assert.calledWith(nextGenAdmin.suspend, suspendParams);
    });

    it('should authenticate and fail to suspend server', function () {
        expect(ctrl).to.exist;
        httpBackend.expectPOST('/api/cloud/admin/nova/authenticate').respond(200, authResponse);
        httpBackend.expectPOST('/api/cloud/users/admin/nova/preprod-ord-rackeradminapi/4321/suspend').respond(404, {});

        statusMock.expects('setSuccessNext').never();
        statusMock.expects('setError').withArgs('Error suspending server: ${message}');

        scope.submit('suspend');
        expect(scope.submitStatus.loading).to.be.true;

        httpBackend.flush();
        expect(scope.submitStatus.loading).to.be.true;

        // Authenticate
        sinon.assert.calledWith(novaAdmin.authenticate, {});

        // Suspend Server
        var suspendParams = { id: '4321', region: 'preprod-ord-rackeradminapi', user: 'admin' };
        sinon.assert.calledWith(nextGenAdmin.suspend, suspendParams);
    });

    it('should authenticate and unsuspend server', function () {
        expect(ctrl).to.exist;
        httpBackend.expectPOST('/api/cloud/admin/nova/authenticate').respond(200, authResponse);
        httpBackend.expectPOST('/api/cloud/users/admin/nova/preprod-ord-rackeradminapi/4321/unsuspend')
            .respond(200, {});

        statusMock.expects('setSuccessNext').withArgs('Server is now unsuspending.');
        statusMock.expects('setError').never();

        scope.submit('unsuspend');
        expect(scope.submitStatus.loading).to.be.true;

        httpBackend.flush();
        expect(scope.submitStatus.loading).to.be.true;

        // Authenticate
        sinon.assert.calledWith(novaAdmin.authenticate, {});

        // Unsuspend Server
        var unsuspendParams = { id: '4321', region: 'preprod-ord-rackeradminapi', user: 'admin' };
        sinon.assert.calledWith(nextGenAdmin.unsuspend, unsuspendParams);
    });

    it('should authenticate and fail to ununsuspend server', function () {
        expect(ctrl).to.exist;
        httpBackend.expectPOST('/api/cloud/admin/nova/authenticate').respond(200, authResponse);
        httpBackend.expectPOST('/api/cloud/users/admin/nova/preprod-ord-rackeradminapi/4321/unsuspend')
            .respond(404, {});

        statusMock.expects('setSuccessNext').never();
        statusMock.expects('setError').withArgs('Error unsuspending server: ${message}');

        scope.submit('unsuspend');
        expect(scope.submitStatus.loading).to.be.true;

        httpBackend.flush();
        expect(scope.submitStatus.loading).to.be.true;

        // Authenticate
        sinon.assert.calledWith(novaAdmin.authenticate, {});

        // Unsuspend Server
        var unsuspendParams = { id: '4321', region: 'preprod-ord-rackeradminapi', user: 'admin' };
        sinon.assert.calledWith(nextGenAdmin.unsuspend, unsuspendParams);
    });

    it('should fail to authenticate', function () {
        expect(ctrl).to.exist;
        httpBackend.expectPOST('/api/cloud/admin/nova/authenticate').respond(403, 'Forbidden');

        statusMock.expects('setSuccessNext').never();
        statusMock.expects('setError').never();

        scope.submit('suspend');
        expect(scope.submitStatus.loading).to.be.true;

        httpBackend.flush();
        expect(scope.submitStatus.loading).to.be.false;

        // Authenticate
        sinon.assert.calledWith(novaAdmin.authenticate, {});
    });

});

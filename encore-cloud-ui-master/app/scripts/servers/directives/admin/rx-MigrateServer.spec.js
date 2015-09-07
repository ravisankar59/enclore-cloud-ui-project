describe('Controller: rx-MigrateServer', function () {
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
            sinon.spy(nextGenAdmin, 'migrate');

            ctrl = $controller('rxMigrateServerCtrl', {
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

    it('should authenticate and migrate server', function () {
        expect(ctrl).to.exist;
        httpBackend.expectPOST('/api/cloud/admin/nova/authenticate').respond(200, authResponse);
        httpBackend.expectPOST('/api/cloud/users/admin/nova/preprod-ord-rackeradminapi/4321/migrate').respond(200, {});

        statusMock.expects('setSuccessNext').withArgs('Server is now migrating.');
        statusMock.expects('setError').never();

        scope.submit();
        expect(scope.submitStatus.loading).to.be.true;

        httpBackend.flush();
        expect(scope.submitStatus.loading).to.be.true;

        // Authenticate
        sinon.assert.calledWith(novaAdmin.authenticate, {});

        // Migrate Server
        var migrateParams = { id: '4321', region: 'preprod-ord-rackeradminapi', user: 'admin' };
        sinon.assert.calledWith(nextGenAdmin.migrate, migrateParams);
    });

    it('should authenticate and fail to migrate server', function () {
        expect(ctrl).to.exist;
        httpBackend.expectPOST('/api/cloud/admin/nova/authenticate').respond(200, authResponse);
        httpBackend.expectPOST('/api/cloud/users/admin/nova/preprod-ord-rackeradminapi/4321/migrate').respond(401, {});

        statusMock.expects('setSuccessNext').never();
        statusMock.expects('setError').withArgs('Error migrating server.');

        scope.submit();
        expect(scope.submitStatus.loading).to.be.true;

        httpBackend.flush();
        expect(scope.submitStatus.loading).to.be.true;

        // Authenticate
        sinon.assert.calledWith(novaAdmin.authenticate, {});

        // Migrate Server
        var migrateParams = { id: '4321', region: 'preprod-ord-rackeradminapi', user: 'admin' };
        sinon.assert.calledWith(nextGenAdmin.migrate, migrateParams);
    });

});

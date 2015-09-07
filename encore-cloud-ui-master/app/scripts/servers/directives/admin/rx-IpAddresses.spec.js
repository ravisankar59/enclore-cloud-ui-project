describe('Controller: rx-IpAddresses', function () {
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
            sinon.spy(nextGenAdmin, 'addPublicAddress');
            sinon.spy(nextGenAdmin, 'removeAddress');

            ctrl = $controller('rxIpAddressesCtrl', {
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

    it('should authenticate and add IP address', function () {
        expect(ctrl).to.exist;
        httpBackend.expectPOST('/api/cloud/admin/nova/authenticate').respond(200, authResponse);
        httpBackend.expectPOST('/api/cloud/users/admin/nova/preprod-ord-rackeradminapi/4321/add-ip').respond(200, {});

        statusMock.expects('setSuccessNext').withArgs('The IP address has been added to the server. ' +
                        'No manual provisioning will be necessary since the IP address has been configured on the ' +
                        'server. Please allow a few minutes for this change to take effect.');
        statusMock.expects('setError').never();

        scope.submitAddIp();
        expect(scope.submitStatus.loading).to.be.true;

        httpBackend.flush();

        // Authenticate
        sinon.assert.calledWith(novaAdmin.authenticate, {});

        // Add Address Params
        var addAddressParams = {
            id: '4321',
            region: 'preprod-ord-rackeradminapi',
            user: 'admin',
            networkId: '00000000-0000-0000-0000-000000000000'
        };
        sinon.assert.calledWith(nextGenAdmin.addPublicAddress, addAddressParams);
    });

    it('should authenticate and fail to add ip address', function () {
        expect(ctrl).to.exist;
        httpBackend.expectPOST('/api/cloud/admin/nova/authenticate').respond(200, authResponse);
        httpBackend.expectPOST('/api/cloud/users/admin/nova/preprod-ord-rackeradminapi/4321/add-ip').respond(400, {});

        statusMock.expects('setSuccessNext').never();
        statusMock.expects('setError');

        scope.submitAddIp();
        expect(scope.submitStatus.loading).to.be.true;

        httpBackend.flush();
        expect(scope.submitStatus.loading).to.be.true;

        // Authenticate
        sinon.assert.calledWith(novaAdmin.authenticate, {});

        // Add Address
        var addAddressParams = {
            id: '4321',
            region: 'preprod-ord-rackeradminapi',
            user: 'admin',
            networkId: '00000000-0000-0000-0000-000000000000'
        };
        sinon.assert.calledWith(nextGenAdmin.addPublicAddress, addAddressParams);
    });

    it('should authenticate and remove IP address', function () {
        expect(ctrl).to.exist;
        httpBackend.expectPOST('/api/cloud/admin/nova/authenticate').respond(200, authResponse);
        httpBackend.expectPOST('/api/cloud/users/admin/nova/preprod-ord-rackeradminapi/4321/remove-ip')
            .respond(200, {});

        // Remove Address Params
        var removeAddressParams = {
            id: '4321',
            region: 'preprod-ord-rackeradminapi',
            user: 'admin',
            address: '10.23.192.133'
        };

        statusMock.expects('setSuccessNext').withArgs('The IP address ' + removeAddressParams.address +
            ' has been removed from the server. Please allow a few minutes for this change to take effect.');
        statusMock.expects('setError').never();

        scope.submitRemoveIp(removeAddressParams.address);
        expect(scope.submitStatus.loading).to.be.true;

        httpBackend.flush();

        // Authenticate
        sinon.assert.calledWith(novaAdmin.authenticate, {});
        
        sinon.assert.calledWith(nextGenAdmin.removeAddress, removeAddressParams);
    });

    it('should authenticate and fail to remove ip address', function () {
        expect(ctrl).to.exist;
        httpBackend.expectPOST('/api/cloud/admin/nova/authenticate').respond(200, authResponse);
        httpBackend.expectPOST('/api/cloud/users/admin/nova/preprod-ord-rackeradminapi/4321/remove-ip')
            .respond(400, { 'error': { 'message': 'Address: Required field', 'code': 400, 'type': 'Bad Request' } });

        // Remove Address
        var removeAddressParams = {
            id: '4321',
            region: 'preprod-ord-rackeradminapi',
            user: 'admin',
            bad: '10.23.192.133'
        };

        statusMock.expects('setSuccessNext').never();
        statusMock.expects('setError');

        scope.submitRemoveIp(removeAddressParams.bad);
        expect(scope.submitStatus.loading).to.be.true;

        httpBackend.flush();
        expect(scope.submitStatus.loading).to.be.true;

        // Authenticate
        sinon.assert.calledWith(novaAdmin.authenticate, {});
    });

});

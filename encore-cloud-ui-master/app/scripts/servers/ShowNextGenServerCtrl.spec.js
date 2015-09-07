describe('Controller: ShowNextGenServerCtrl', function () {
    var httpBackend, ctrl, q, location, nextgenservers, rackConnectDeferred,
        scope, server, flavorDetails, attachments;

    var validRouteParams = {
        'user': 'hub_cap',
        'accountNumber': '323676',
        'serverId': '9ae1032c-b39d-4eeb-b4f8-eb9b97a89d1f',
        'region': 'ORD'
    };

    var nextGenServerDetails = {
        'server': {
            'status': 'ACTIVE',
            'name': 'Leonel Server',
            'region': 'ORD',
            'user_id': '295',
            'tenant_id': '323676',
            'flavor': {
                'name': '15 GB I/O v1',
                'id': 'io1-15'
            },
            'host_id': 'c9ad727ea68dbfa26c75414168ded823e3cbc53756b0fb884c0dec2d',
            'id': '9ae1032c-b39d-4eeb-b4f8-eb9b97a89d1f',
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

    var serverFlavorDetails = {
        'flavor': {
            'id': 'io1-15',
            'name': '15 GB I/O v1',
            'ram': 15360,
            'disk_size': 40,
            'data_disk': 150,
            'bandwidth': 1250,
            'flavor_disabled': false,
            'extra_specs': {
                'class': 'io1',
                'disk_io_index': '40',
                'number_of_data_disks': '1',
                'policy_class': 'io_flavor'
            }
        }
    };

    var rackConnectIps = {
        addresses: [{
            'id': '2d0f586b-37a7-4ae0-adac-2743d5feb450',
            'version': 4,
            'ip_type': 'public-rackconnect-server',
            'ip_address': '203.0.113.110',
            'isRackConnect': true
        }]
    };

    var populateScope = function (routeParams) {
        var scope;
        module('encore.ui');
        module('encore.ui.rxNotify');
        module('encore.svcs.cloud.config');
        module('servers');

        inject(function ($httpBackend, $controller, $rootScope, $q, $location, NextGenServers) {
            httpBackend = $httpBackend;
            scope = $rootScope.$new();
            q = $q;
            location = $location;
            nextgenservers = NextGenServers;

            sinon.spy(nextgenservers, 'get');
            sinon.spy(nextgenservers, 'getFlavor');

            rackConnectDeferred = $q.defer();

            var rackConnectApi = {
                getIpAddresses: function () {
                    return { $promise: rackConnectDeferred.promise };
                }
            };

            ctrl = $controller('ShowNextGenServerCtrl', {
                $scope: scope,
                $location: location,
                $routeParams: routeParams,
                $q: q,
                NextGenServers: nextgenservers,
                RackConnect: rackConnectApi
            });

        });
        return scope;
    };

    beforeEach(function () {
        scope = populateScope(validRouteParams);
        flavorDetails = serverFlavorDetails;
        server = nextGenServerDetails;
        attachments = {};
        rackConnectDeferred.resolve(rackConnectIps);

        /* jshint maxlen: false */
        httpBackend.whenGET('/api/cloud/users/hub_cap/servers/ORD/9ae1032c-b39d-4eeb-b4f8-eb9b97a89d1f').respond(server);
        httpBackend.whenGET('/api/cloud/users/hub_cap/servers/ORD/9ae1032c-b39d-4eeb-b4f8-eb9b97a89d1f/volume_attachments').respond(attachments);
        httpBackend.whenGET('/api/cloud/users/hub_cap/flavors/ORD/io1-15').respond(serverFlavorDetails);
        httpBackend.whenGET('/api/cloud/cloudcontrol/ORD/323676/servers/9ae1032c-b39d-4eeb-b4f8-eb9b97a89d1f/rackconnect').respond(rackConnectIps);
        httpBackend.flush();
    });

    describe('nextgen server load flavor', function () {
        var flavorId = nextGenServerDetails.server.flavor.id;

        it('should make a call to load 15GB I/O v1 flavor', function () {
            var getFlavorParams = { id: 'io1-15', region: 'ORD', user: 'hub_cap' };

            expect(ctrl).to.exist;
            scope.loadFlavorDetails(flavorId);
            sinon.assert.calledWith(nextgenservers.getFlavor, getFlavorParams);
        });
    });

    describe('Load server and get its flavor details', function () {
        it('populated the page with flavor data', function () {
            /* jshint camelcase: false */
            expect(scope.server.flavor.data_disk).to.equal(150);
            expect(scope.server.flavor.extra_specs.disk_io_index).to.equal('40');
        });
    });

    describe('NextGen Server Detail', function () {
        it('should determine if server has metadata', function () {
            expect(scope.hasMetadata(server)).to.be.false;
        });

        it('should load RackConnect IP addresses', function () {
            expect(scope.server.addresses.length).to.equal(3);
            expect(scope.server.addresses[2].isRackConnect).to.be.true;
        });
    });
});

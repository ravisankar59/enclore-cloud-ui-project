describe('Controller: CreateServerCtrl', function () {
    var ctrl, location, q, rxNotifySvc, rackConnectAccountSvc, rackConnectNetworksSvc, encoreSvc,
    cloudUsersSvc, statusSvc, cloudRegionsSvc, networkService;

    var validRouteParams = {
        'user': 'hub_cap',
        'accountNumber': 323676
    };

    var serviceCatalog = {
        endpoints: [{
            type: 'compute',
            region: 'ORD'
        }, {
            type: 'compute',
            region: 'DFW'
        }, { // This is to mimic the expected behavior in loadRegionsSuccess regarding firstGen endpoints
            type: 'compute',
            region: null
        }]
    };

    var rxBreadcrumbsSvcMock = {
        set: sinon.spy()
    };

    var httpBackend;

    var populateScope = function (routeParams) {
        var scope;
        module('encore');
        module('encore.ui');
        module('encore.svcs.cloud.config');
        module('servers');

        inject(function ($controller, $rootScope, $location, $q, $httpBackend, rxNotify, Encore, CloudUsers,
                        CloudRegions, Status, NetworkService, RackConnectAccountResource, RackConnectNetworkResource) {
            rxNotifySvc = rxNotify;
            scope = $rootScope.$new();
            httpBackend = $httpBackend;
            location = $location;
            q = $q;
            cloudRegionsSvc = CloudRegions;
            cloudUsersSvc = CloudUsers;
            encoreSvc = Encore;
            statusSvc = Status;
            rackConnectAccountSvc = RackConnectAccountResource;
            rackConnectNetworksSvc = RackConnectNetworkResource;
            networkService = NetworkService;

            ctrl = $controller('CreateServerCtrl', {
                $scope: scope,
                $location: location,
                $routeParams: routeParams,
                rxBreadcrumbsSvc: rxBreadcrumbsSvcMock,
                rxNotify: rxNotifySvc,
                CloudRegions: cloudRegionsSvc,
                Encore: encoreSvc,
                Status: statusSvc,
                CloudUsers: cloudUsersSvc,
                RackConnectAccount: rackConnectAccountSvc,
                RackConnectNetworks: rackConnectNetworksSvc,
                NetworkService: networkService,
            });

        });
        return scope;
    };

    describe('cancel the server creation', function () {
        var scope;
        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        it('should return the user to the servers page', function () {
            scope.cancel();
            expect(location.url()).to.eq('/323676/hub_cap/servers');
        });
    });

    describe('should include Disk I/O column for Performance', function () {
        var scope;

        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        var flavorGeneral = 'General';
        var flavorPerformance = 'Performance 1';
        var flavorPerformanceMock = {
                'label': 'Disk I/O',
                'key': '{{extra_specs.disk_io_index}}'
            };
        it('has a Disk I/O property for Performance', function () {
            scope.chooseFlavor(flavorGeneral);
            expect(scope.columns.NextGen.flavor).to.not.include(flavorPerformanceMock);
            scope.chooseFlavor(flavorPerformance);
            expect(scope.columns.NextGen.flavor).to.include(flavorPerformanceMock);
        });
    });

    describe('#isNextGen', function () {

        var scope;

        var serverInfo = {
            region: {
                type: 'NextGen'
            }
        };

        beforeEach(function () {
            scope = populateScope(validRouteParams);
            scope.serverInfo = serverInfo;
        });

        it('returns true if region is "NextGen"', function () {
            expect(scope.isNextGen()).to.be.true;
        });

        it('returns false if region is not "NextGen"', function () {
            scope.serverInfo.region.type = 'FirstGen';
            expect(scope.isNextGen()).to.be.false;
        });

        it('returns false if region is null', function () {
            scope.serverInfo.region.type = null;
            expect(scope.isNextGen()).to.be.false;
        });

    }); // isNextGen()

    describe('#flavorCheck', function () {

        var scope;

        var flavorClass = {
            id: 'standard',
            title: 'Standard'
        };

        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        describe('booting from local only', function () {

            it('sets bootLocalOnly for "standard" flavors', function () {
                scope.flavorCheck(flavorClass);
                expect(scope.bootLocalOnly).to.be.true;
            });

            it('sets boot source to "local" for "standard" flavors', function () {
                scope.flavorCheck(flavorClass);
                expect(scope.serverInfo.bootSource).to.equal('local');
            });

            it('sets bootFromVolumeOnly false for "standard" flavors', function () {
                scope.flavorCheck(flavorClass);
                expect(scope.bootFromVolumeOnly).to.be.false;
            });

        });

        describe('booting from volume only', function () {

            var volumeOnlyFlavors = ['compute', 'memory'];

            _.each(volumeOnlyFlavors, function (flavor) {

                it('sets bootFromVolumeOnly true for ' + flavor + ' flavor', function () {
                    flavorClass.id = flavor;
                    scope.flavorCheck(flavorClass);
                    expect(scope.bootFromVolumeOnly).to.be.true;
                });

                it('sets boot source to "new" for ' + flavor + ' flavor', function () {
                    flavorClass.id = flavor;
                    scope.flavorCheck(flavorClass);
                    expect(scope.serverInfo.bootSource).to.equal('new');
                });

                it('sets bootLocalOnly false for ' + flavor + ' flavor', function () {
                    flavorClass.id = flavor;
                    scope.flavorCheck(flavorClass);
                    expect(scope.bootLocalOnly).to.be.false;
                });

            });

        });

    }); // flavorCheck()

    describe('loadRegion', function () {
        var scope;

        var images = {
            images: [{ id: 'image-1', status: 'ACTIVE', metadata: { 'image_type': 'base' }},
                     { id: 'image-2', status: 'ACTIVE', metadata: { 'image_type': 'snapshot' }},
                     { id: 'image-3', status: 'ACTIVE', metadata: { 'image_type': 'base' }}]
        };

        var flavors = {
            flavors: [{ id: 'classic1-1', name: 'Classic 1' },
                      { id: 'io1-1', name: 'I/O 1' },
                      { id: 'test1-1', name: 'Test 1' },
                      { id: 'performance1-1', name: 'Performance 1' }]
        };

        var rackConnectAccountResponse = {
            'version': '3',
            'regions': ['DFW']
        };

        var rackConnectNetworks = { 'cloud_networks': [{ id: '123abc', cidr: '1.1.1.1/24', name: 'RC-CLOUD' }] };

        beforeEach(function () {
            // Add pre-selected image
            validRouteParams.imageId = 'image-2';
            validRouteParams.imageRegion = 'DFW';
            scope = populateScope(validRouteParams);

            httpBackend.when('GET', '/api/encore/users/hub_cap/account').respond({ name: 'Hub_cap' }, {});
            httpBackend.when('GET', '/api/cloud/users/hub_cap/service_catalog').respond(serviceCatalog, {});
            httpBackend.when('GET', '/api/cloud/users/hub_cap/networks/ORD').respond({}, {});
            httpBackend.when('GET', '/api/cloud/users/hub_cap/flavors/ORD').respond(flavors, {});
            httpBackend.when('GET', '/api/cloud/users/hub_cap/images/ORD').respond(images, {});
            httpBackend.when('GET', '/api/cloud/users/hub_cap/networks/DFW').respond({}, {});
            httpBackend.when('GET', '/api/cloud/users/hub_cap/flavors/DFW').respond(flavors, {});
            httpBackend.when('GET', '/api/cloud/users/hub_cap/images/DFW').respond(images, {});
            httpBackend.when('GET', '/api/cloud/cloudcontrol/hub_cap/323676/rackconnect_account')
                .respond(rackConnectAccountResponse, {});
            httpBackend.when('GET', '/api/cloud/cloudcontrol/DFW/323676/rackconnect/cloud_networks')
                .respond(rackConnectNetworks, {});
            httpBackend.when('GET', '/api/cloud/cloudcontrol/ORD/323676/rackconnect/cloud_networks').respond({}, {});

            httpBackend.flush();
        });

        it('should load images for the selected region', function () {
            expect(scope.images.rackspace.length).to.equal(2);
            expect(scope.images.saved.length).to.equal(1);
        });

        it('should display tab for pre-selected image', function () {
            expect(scope.server.image).to.equal('image-2');
            var type = scope.serverInfo.region.type;
            var savedImageTab = _.last(scope.imageTabs[type]);
            expect(savedImageTab.active).to.be.true;
        });

        it('should load flavors for the selected region', function () {
            expect(scope.flavors.hasOwnProperty('classic')).to.be.true;
            expect(scope.flavors.hasOwnProperty('io')).to.be.true;
            expect(scope.flavors.hasOwnProperty('test')).to.be.true;
            expect(scope.flavors.hasOwnProperty('performance1')).to.be.true;

            expect(scope.flavorClasses.length).to.equal(3);
        });

        it('should load rackconnect networks for RCv3 accounts', function () {
            expect(scope.rackConnect.networks.length).to.eq(1);
        });

        it('should not load rackconnect networks for RCv2 accounts', function () {
            scope.rackConnect.version = '2';
            scope.loadRegion();
            expect(scope.rackConnect.networks.length).to.eq(0);
        });

        it('should not load rackconnect networks for non-RackConnect accounts', function () {
            scope.rackConnect.version = null;
            scope.rackConnect.regions = [];
            scope.loadRegion();
            expect(scope.rackConnect.networks.length).to.eq(0);
        });

        it('should match server region to image region', function () {
            expect(scope.serverInfo.region.value).to.equal('DFW');
        });

        it('should default to first available region when image region not found', function () {
            validRouteParams.imageRegion = 'LEL';

            scope.imageSelected = true;
            scope.loadRegion();

            var firstRegion = _.first(scope.regions).value;
            expect(scope.serverInfo.region.value).to.equal(firstRegion);
        });

    }); // loadRegion()

    describe('filterNetworks', function () {

        var scope;

        var allNetworks = [{ region: 'ORD' },
                           { region: 'DFW' },
                           { title: 'ServiceNet', region: 'ORD' },
                           { title: 'ServiceNet', region: 'DFW' },
                           { title: 'PublicNet', region: 'ORD' },
                           { title: 'PublicNet', region: 'DFW' }];

        // The RackConnect API will return networks for a given region
        var rackConnectNetworks = [{ name: 'RC-CLOUD', region: 'ORD' }];

        beforeEach(function () {
            scope = populateScope(validRouteParams);
            scope.allNetworks = allNetworks;
            scope.rackConnect.networks = rackConnectNetworks;
        });

        describe('RackConnect version 2 account', function () {

            beforeEach(function () {
                sinon.stub(scope, 'isRackConnect2').returns(true);
            });

            it('includes Rackspace networks for the current region only', function () {
                scope.serverInfo.region = { 'value': 'ORD' };
                scope.allNetworks = [{ title: 'PublicNet', region: 'DFW', rackspaceNetwork: true },
                                     { title: 'PublicNet', region: 'ORD', rackspaceNetwork: true },
                                     { title: 'ServiceNet', region: 'DFW', rackspaceNetwork: true },
                                     { title: 'ServiceNet', region: 'ORD', rackspaceNetwork: true }];
                ctrl.filterNetworks();
                expect(_.some(scope.networks, { title: 'ServiceNet', region: 'ORD' })).to.be.true;
                expect(_.some(scope.networks, { title: 'PublicNet', region: 'ORD' })).to.be.true;
                expect(scope.networks.length).to.eq(2);
            });

        }); // describe Rack Connect v2

        describe('RackConnect version 3 account', function () {

            beforeEach(function () {
                sinon.stub(scope, 'isRackConnect3').returns(true);
            });

            it('includes RackConnect networks for RackConnect version 3', function () {
                scope.serverInfo.region = { 'value': 'ORD' };
                ctrl.filterNetworks();
                expect(_.some(scope.networks, { name: 'RC-CLOUD' })).to.be.true;
            });

            it('includes ServiceNet for the region when RackConnect version 3', function () {
                scope.serverInfo.region = { 'value': 'ORD' };
                ctrl.filterNetworks();
                expect(_.some(scope.networks, { title: 'ServiceNet' })).to.be.true;
            });

            it('does not include non-RackConnect networks', function () {
                scope.serverInfo.region = { 'value': 'ORD' };
                ctrl.filterNetworks();
                expect(scope.networks.length).to.eq(2);
            });

        }); // describe Rack Connect v3

        it('includes all regions when current region is empty', function () {
            scope.serverInfo.region = null;
            ctrl.filterNetworks();
            expect(_.pluck(scope.networks, 'region')).to.have.members(['ORD', 'DFW']);
        });

        it('includes only networks matching the current region when it exists', function () {
            scope.serverInfo.region = { 'value': 'ORD' };
            ctrl.filterNetworks();
            expect(_.pluck(scope.networks, 'region')).to.have.members(['ORD']);
            expect(_.pluck(scope.networks, 'region')).to.not.have.members(['DFW']);
        });

        it('sets the network restrictions', function () {
            sinon.spy(ctrl, 'setNetworkRestrictions');
            ctrl.filterNetworks();
            sinon.assert.calledOnce(ctrl.setNetworkRestrictions);
        });

    }); // filterNetworks()

    describe('setNetworkRestrictions', function () {

        var scope;
        var networks = [{ name: 'Network 1', label: 'public', rackspaceNetwork: true },
                        { name: 'Network 2', label: 'private', rackspaceNetwork: true }];
        var mandatoryNetworkStub = sinon.stub();

        beforeEach(function () {
            scope = populateScope(validRouteParams);
            scope.networks = networks;
            scope.isMandatoryNetwork = mandatoryNetworkStub.returns(true);
        });

        it('sets mandatory networks checked', function () {
            ctrl.setNetworkRestrictions();
            expect(_.pluck(scope.networks, 'checked')).to.deep.equal([true, true]);
        });

        it('does not set restrictions for mandatory networks', function () {
            ctrl.setNetworkRestrictions();
            expect(_.pluck(scope.networks, 'hasRestrictions')).to.deep.eq([false, false]);
        });

        it('does not include warning messages for mandatory networks', function () {
            ctrl.setNetworkRestrictions();
            expect(_.pluck(scope.networks, 'warningMessage')).to.deep.eq([undefined, undefined]);
        });

        describe('Rackspace (public or private) networks', function () {

            beforeEach(function () {
                mandatoryNetworkStub.returns(false);
            });

            it('sets the networks to checked', function () {
                ctrl.setNetworkRestrictions();
                expect(_.pluck(scope.networks, 'checked')).to.deep.equal([true, true]);
            });

            it('sets the network to have restrictions', function () {
                ctrl.setNetworkRestrictions();
                expect(_.pluck(scope.networks, 'hasRestrictions')).to.deep.equal([true, true]);
            });

            it('sets the network to have the appropriate warning message', function () {
                ctrl.setNetworkRestrictions();
                expect(scope.networks[0].warningMessage).to.contain('PublicNet');
                expect(scope.networks[1].warningMessage).to.contain('ServiceNet');
            });
        });

    }); // setNetworkRestrictions()

    describe('loadNetworks', function () {

        var scope;

        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        it('retrieves the networks', function () {
            sinon.spy(networkService, 'fetchNetworks');
            ctrl.loadNetworks();
            sinon.assert.calledOnce(networkService.fetchNetworks);
        });

    }); // loadNetworks()

    describe('loadNetworksSuccess', function () {

        var scope;

        var networks = [ { name: 'Network 1' } ];

        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        it('sets scope.allNetworks', function () {
            ctrl.loadNetworksSuccess(networks);
            expect(scope.allNetworks).to.deep.equal(networks);
        });

    }); // loadNetworksSuccess

    describe('loadNetworksFinally', function () {

        var scope;

        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        it('sets the Status error when there are failed requests', function () {
            sinon.spy(statusSvc, 'setError');
            scope.failedRequests = ['Service Unavailable'];
            ctrl.loadNetworksFinally();
            sinon.assert.calledWith(statusSvc.setError, 'Error loading networks: Service Unavailable');
        });

        it('sets the Status complete when there are no failed requests', function () {
            sinon.spy(statusSvc, 'complete');
            scope.failedRequests = null;
            ctrl.loadNetworksFinally();
            sinon.assert.calledOnce(statusSvc.complete);
        });

    }); // loadNetworksFinally()

    describe('isRackConnect2', function () {
        var scope;

        beforeEach(function () {
            scope = populateScope(validRouteParams);
            scope.rackConnect.version = '2';
            scope.rackConnect.regions = ['ORD'];
            scope.serverInfo.region = { value: 'ORD' };
        });

        it('returns true if version 2 and current region is rackconnect', function () {
            expect(scope.isRackConnect2()).to.be.true;
        });

        it('returns false if not rackconnect version 2', function () {
            scope.rackConnect.version = '3';
            expect(scope.isRackConnect2()).to.be.false;
        });

        it('returns false if there is no current region', function () {
            scope.serverInfo.region = null;
            expect(scope.isRackConnect2()).to.be.false;
        });

        it('returns false if not a rack connect region', function () {
            scope.serverInfo.region = { value: 'DFW' };
            expect(scope.isRackConnect2()).to.be.false;
        });

    }); // isRackConnect2()

    describe('isRackConnect3', function () {

        var scope;

        beforeEach(function () {
            scope = populateScope(validRouteParams);
            scope.rackConnect.version = '3';
            scope.rackConnect.regions = ['ORD'];
            scope.serverInfo.region = { value: 'ORD', type: 'NextGen' };
        });

        it('returns true if version 3 and current region is rackconnect and NextGen', function () {
            expect(scope.isRackConnect3()).to.be.true;
        });

        it('returns false if current region is FirstGen', function () {
            scope.serverInfo.region.type = 'FirstGen';
            expect(scope.isRackConnect3()).to.be.false;
        });

        it('returns false if not rackconnect version 3', function () {
            scope.rackConnect.version = '2';
            expect(scope.isRackConnect3()).to.be.false;
        });

        it('returns false if there is no current region', function () {
            scope.serverInfo.region = null;
            expect(scope.isRackConnect3()).to.be.false;
        });

        it('returns false if not a rack connect region', function () {
            scope.serverInfo.region = { value: 'DFW' };
            expect(scope.isRackConnect3()).to.be.false;
        });

    }); // isRackConnect3()

    describe('isRackConnectRegion', function () {

        var scope;

        beforeEach(function () {
            scope = populateScope(validRouteParams);
            scope.serverInfo.region = { value: 'ORD' };
        });

        it('returns true when the current region is a Rack Connected region', function () {
            scope.rackConnect.regions = ['ORD'];
            expect(ctrl.isRackConnectRegion()).to.be.true;
        });

        it('returns false when the current region is not a Rack Connected region', function () {
            scope.rackConnect.regions = ['DFW'];
            expect(ctrl.isRackConnectRegion()).to.be.false;
        });

        it('returns false when the current region is null', function () {
            scope.serverInfo.region = null;
            scope.rackConnect.regions = ['ORD'];
            expect(ctrl.isRackConnectRegion()).to.be.false;
        });

        it('returns false when the current region is undefined', function () {
            scope.serverInfo.region = undefined;
            scope.rackConnect.regions = ['ORD'];
            expect(ctrl.isRackConnectRegion()).to.be.false;
        });

    }); // isRackConnectRegion()

    describe('loadAccount', function () {

        var scope;

        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        it('loads account details', function () {
            sinon.spy(ctrl, 'loadAccountDetails');
            ctrl.loadAccount();
            sinon.assert.calledOnce(ctrl.loadAccountDetails);
        });

        it('loads rack connect account details', function () {
            sinon.spy(ctrl, 'loadRackConnectAccountDetails');
            ctrl.loadAccount();
            sinon.assert.calledOnce(ctrl.loadRackConnectAccountDetails);
        });

    }); // loadAccount()

    describe('loadAccountDetails', function () {

        var scope;

        var accountDetailsResponse = {
            'serviceLevel': 'Managed'
        };

        beforeEach(function () {
            scope = populateScope(validRouteParams);
            httpBackend.when('GET', '/api/cloud/users/hub_cap/service_catalog').respond(serviceCatalog, {});
            httpBackend.when('GET', '/api/cloud/users/hub_cap/flavors/ORD').respond({}, {});
            httpBackend.when('GET', '/api/cloud/users/hub_cap/images/ORD').respond({}, {});
            httpBackend.when('GET', '/api/cloud/cloudcontrol/ORD/323676/rackconnect/cloud_networks')
                .respond({}, {});
            httpBackend.when('GET', '/api/cloud/users/hub_cap/networks/ORD').respond({}, {});
            httpBackend.when('GET', '/api/cloud/users/hub_cap/networks/DFW').respond({}, {});
            httpBackend.when('GET', '/api/cloud/cloudcontrol/hub_cap/323676/rackconnect_account').respond({}, {});
        });

        var api = '/api/encore/users/hub_cap/account';

        it('will load account details using the Encore service', function () {
            sinon.spy(encoreSvc, 'getAccountByIdentityUsername');
            ctrl.loadAccountDetails();
            sinon.assert.calledOnce(encoreSvc.getAccountByIdentityUsername);
        });

        it('will set serviceLevel on success', function () {
            httpBackend.expectGET(api).respond(200, accountDetailsResponse);
            httpBackend.flush();
            expect(scope.serviceLevel).to.eq('Managed');
        });

        it('will set error on failure', function () {
            httpBackend.expectGET(api).respond(404, {});
            sinon.spy(statusSvc, 'setError');
            httpBackend.flush();
            sinon.assert.callCount(statusSvc.setError, 1);
        });

    }); // loadAccountDetails()

    describe('loadRackConnectAccountDetails', function () {

        var scope;

        var rackConnectAccountResponse = {
            'version': '3',
            'regions': ['ORD']
        };

        var rackConnectNetworks = { 'cloud_networks': [{ id: '123abc', cidr: '1.1.1.1/24', name: 'RC-CLOUD' }] };

        beforeEach(function () {
            scope = populateScope(validRouteParams);
            httpBackend.when('GET', '/api/cloud/users/hub_cap/service_catalog').respond(serviceCatalog, {});
            httpBackend.when('GET', '/api/cloud/users/hub_cap/flavors/ORD').respond({}, {});
            httpBackend.when('GET', '/api/cloud/users/hub_cap/images/ORD').respond({}, {});
            httpBackend.when('GET', '/api/cloud/cloudcontrol/ORD/323676/rackconnect/cloud_networks')
                .respond(rackConnectNetworks, {});
            httpBackend.when('GET', '/api/cloud/users/hub_cap/networks/ORD').respond({}, {});
            httpBackend.when('GET', '/api/cloud/users/hub_cap/networks/DFW').respond({}, {});
            httpBackend.when('GET', '/api/encore/users/hub_cap/account').respond({ name: 'Hub_cap' }, {});
        });

        var api = '/api/cloud/cloudcontrol/hub_cap/323676/rackconnect_account';

        it('will load the Rack Connect regions for v3', function () {
            sinon.spy(rackConnectAccountSvc, 'get');
            ctrl.loadRackConnectAccountDetails();
            sinon.assert.calledOnce(rackConnectAccountSvc.get);
        });

        it('will set rackConnect version on success', function () {
            httpBackend.expectGET(api).respond(200, rackConnectAccountResponse);
            httpBackend.flush();
            expect(scope.rackConnect.version).to.eq('3');
        });

        it('will set rackConnect regions on success', function () {
            httpBackend.expectGET(api).respond(200, rackConnectAccountResponse);
            httpBackend.flush();
            expect(scope.rackConnect.regions).to.have.members(['ORD']);
        });

        it('will not set rackConnect version when not found', function () {
            httpBackend.expectGET(api).respond(404, {});
            httpBackend.flush();
            expect(scope.rackConnect.version).to.eq(null);
        });

        it('will not set rackConnect regions when not found', function () {
            httpBackend.expectGET(api).respond(404, {});
            httpBackend.flush();
            expect(scope.rackConnect.regions).to.be.empty;
        });

    }); // loadRackConnectAccountDetails()

    describe('isMandatoryNetwork()', function () {
        var scope;
        var publicNetwork = { label: 'public',
                              id: '00000000-0000-0000-0000-000000000000',
                              title: 'PublicNet',
                              rackspaceNetwork: true,
                              privateNetwork: false };
        var privateNetwork = { label: 'private',
                               id: '11111111-1111-1111-1111-111111111111',
                               title: 'ServiceNet',
                               rackspaceNetwork: true,
                               privateNetwork: false };
        var customNetwork = { label: 'RC-CLOUD',
                              id: '47c7aea7-2f23-2540-6b9a-8a8274b68924e',
                              rackspaceNetwork: false,
                              privateNetwork: true };
        var rackConnectv2 = { version: '2' };
        var rackConnectv3 = { version: '3' };

        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        describe('service level "insfrastructure"', function () {

            beforeEach(function () {
                scope.serviceLevel = 'infrastructure';
            });

            it('should not require the public network for infrastructure level accounts', function () {
                expect(scope.isMandatoryNetwork(publicNetwork)).to.be.false;
            });

            it('should not require the private network for infrastructure level accounts', function () {
                expect(scope.isMandatoryNetwork(privateNetwork)).to.be.false;
            });

            it('should not require a custom network for infrastructure level accounts', function () {
                expect(scope.isMandatoryNetwork(customNetwork)).to.be.false;
            });

        });

        describe('service level "managed"', function () {

            beforeEach(function () {
                scope.serviceLevel = 'managed';
            });

            it('should require the private network for managed accounts', function () {
                expect(scope.isMandatoryNetwork(privateNetwork)).to.be.true;
            });

            it('should not require custom networks for managed accounts', function () {
                expect(scope.isMandatoryNetwork(customNetwork)).to.be.false;
            });

        });

        describe('Rack Connected accounts', function () {

            beforeEach(function () {
                ctrl.isRackConnectRegion = sinon.stub().returns(true);
            });

            it('should require the private network for RackConnect v2', function () {
                scope.rackConnect = rackConnectv2;
                expect(scope.isMandatoryNetwork(privateNetwork)).to.be.true;
            });

            it('should require the public network for RackConnect v2', function () {
                scope.rackConnect = rackConnectv2;
                expect(scope.isMandatoryNetwork(publicNetwork)).to.be.true;
            });

            it('should require the private network for RackConnect v3 managed', function () {
                scope.rackConnect = rackConnectv3;
                scope.serviceLevel = 'managed';
                expect(scope.isMandatoryNetwork(privateNetwork)).to.be.true;
            });

            it('should not require the private network for RackConnect v3 infrastructure', function () {
                scope.rackConnect = rackConnectv3;
                scope.serviceLevel = 'infrastructure';
                expect(scope.isMandatoryNetwork(privateNetwork)).to.be.false;
            });

            it('should not require the public network for RackConnect v3 managed', function () {
                scope.rackConnect = rackConnectv3;
                scope.serviceLevel = 'managed';
                expect(scope.isMandatoryNetwork(publicNetwork)).to.be.false;
            });

            it('should not require the public network for RackConnect v3 infrastructure', function () {
                scope.rackConnect = rackConnectv3;
                scope.serviceLevel = 'infrastructure';
                expect(scope.isMandatoryNetwork(publicNetwork)).to.be.false;
            });

            it('should not require non-Rackspace (PublicNet/ServiceNet) networks', function () {
                scope.rackConnect = rackConnectv2;
                scope.serviceLevel = 'managed';
                expect(scope.isMandatoryNetwork(customNetwork)).to.be.false;
                scope.serviceLevel = 'infrastructure';
                expect(scope.isMandatoryNetwork(customNetwork)).to.be.false;
                scope.rackConnect = rackConnectv3;
                expect(scope.isMandatoryNetwork(customNetwork)).to.be.false;
                scope.serviceLevel = 'managed';
                expect(scope.isMandatoryNetwork(customNetwork)).to.be.false;
            });
        });

    }); // describe('isMandatoryNetwork()')

    describe('shouldDisableCreateButton', function () {

        var scope;

        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        it('returns true when scope is not loaded', function () {
            scope.loaded = false;
            expect(scope.shouldDisableCreateButton()).to.be.true;
        });

        it('returns true when serviceLevel is undefined', function () {
            scope.serviceLevel = undefined;
            expect(scope.shouldDisableCreateButton()).to.be.true;
        });

        it('returns false when scope is loaded and serviceLevel exists', function () {
            scope.loaded = true;
            scope.serviceLevel = 'managed';
            expect(scope.shouldDisableCreateButton()).to.be.false;
        });

    }); // shouldDisableCreateButton()

});

describe('Controller: CreateLoadBalancerCtrl', function () {
    var ctrl, location, q;
    var validRouteParams = {
        'user': 'hub_cap',
        'accountNumber': '323676'
    };

    var rxBreadcrumbsSvcMock = {
        set: sinon.spy()
    };
    var hubCapRegions = [
        { 'name': 'ORD', 'type': 'volume' }
    ];

    var hubCapConvertedRegions = [
        { 'label': 'ORD (Chicago)', 'value': 'ORD' }
    ];

    var protocols = [
        { 'port': 53, 'name': 'DNS_TCP' },
        { 'port': 53, 'name': 'DNS_UDP' },
        { 'port': 21, 'name': 'FTP' }
    ];

    var nextGenServers, firstGenServers;

    var populateScope = function (routeParams) {
        var scope;
        module('encore.ui');
        module('encore.ui.rxNotify');
        module('encore.svcs.cloud.config');
        module('loadbalancers');
        inject(function ($controller, $rootScope, $location, $q, Lbaas) {
            q = $q;
            var regions = {
                getRegions: function (user, type) {
                    var deferred = q.defer();

                    if (user === validRouteParams.user && type === 'LoadBalancers') {
                        deferred.resolve(hubCapRegions);
                    } else {
                        deferred.reject();
                    }

                    return deferred.promise;
                },
                convert: function (regions) {
                    if (regions === hubCapRegions) {
                        return hubCapConvertedRegions;
                    }
                }
            };

            var lbaasSvc = Lbaas;
            helpers.resourceStub($q, lbaasSvc, 'getProtocols', { 'protocols': [] });

            nextGenServers = [
                /* jshint maxlen:false */
                { id: 'server_1', name: 'server_1', addresses: [{ 'ip_address': '192.168.2.1' }], region: 'ORD', flavor: { name: 'flavor' }},
                { id: 'server_2', name: 'server_2', addresses: [{ 'ip_address': '192.168.2.2' }], region: 'ORD', flavor: { name: 'flavor' }},
                { id: 'server_3', name: 'server_3', addresses: [{ 'ip_address': '192.168.2.3' }], region: 'ORD', flavor: { name: 'flavor' }},
            ];
            firstGenServers = [];

            var serverLoaders = {
                loadNextGenServers: function () {
                    var deferred = $q.defer();
                    nextGenServers.resolve = _.partial(deferred.resolve, nextGenServers);
                    return deferred.promise;
                },
                loadFirstGenServers: function () {
                    var deferred = $q.defer();
                    firstGenServers.resolve = _.partial(deferred.resolve, firstGenServers);
                    return deferred.promise;
                }
            };

            scope = $rootScope.$new();
            location = $location;
            ctrl = $controller('CreateLoadBalancerCtrl', {
                $scope: scope,
                $location: location,
                $routeParams: routeParams,
                rxBreadcrumbsSvc: rxBreadcrumbsSvcMock,
                CloudRegions: regions,
                Lbaas: lbaasSvc,
                CloudServerLoaders: serverLoaders,
            });
            scope.$apply();
        });
        return scope;

    };

    describe('should populate the port number', function () {
        var scope, modalScope = {};
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            expect(scope.defaultPort).to.be.empty;
        });

        it('sets the defaultPort to the port number', function () {
            scope.loadBalancer.protocol = protocols[0];
            scope.$apply();
            expect(scope.defaultPort).to.equal(protocols[0].port);
        });
        it('sets the loadBalancer port to the port number', function () {
            scope.loadBalancer.protocol = protocols[1];
            scope.$apply();
            expect(scope.loadBalancer.port).to.equal(protocols[1].port);
        });
        it('populates the modal with protocal port number', function () {
            scope.loadBalancer.protocol = protocols[2];
            scope.$apply();
            scope.addExternalNodes.preHook(modalScope);
            expect(modalScope.fields.port).to.equal(protocols[2].port);
        });
    });

    describe('shared virtual ip', function () {
        var scope;
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            scope.availableSharedVips = [
                {
                    value:9011927,
                    name: 'test_load_balancer',
                    address: '2001:4801:79f1:0001:07b4:0a0b:0000:0001',
                    type: 'PUBLIC',
                    protocol: 'DNS_UDP (53)',
                    port: 53,
                    protocolType: 'DNS_UDP'
                },
                {
                    value:33,
                    name: 'test1_load_balancer',
                    address: '184.106.24.47',
                    type: 'PUBLIC',
                    protocol: 'HTTP (80)',
                    port: 80,
                    protocolType: 'HTTP'
                }
            ];
            scope.loadBalancer.virtualIp = { name: 'Shared VIP', value: 'Shared VIP' };
        });

        it('should not filter when the port number does not match within table', function () {
            scope.loadBalancer.port = 40;
            scope.$apply();
            expect(scope.sharedVirtualIps.length).to.equal(scope.availableSharedVips.length);
        });

        it('should be filtered with unmatched port number', function () {
            scope.loadBalancer.port = 80;
            scope.$apply();
            expect(scope.sharedVirtualIps.length).to.be.equal(1);
            expect(scope.sharedVirtualIps[0].protocol).to.be.equal('DNS_UDP (53)');
        });

        it('should return false when no row selected from table', function () {
            scope.loadBalancer.sharedVip = 8;
            expect(scope.sharedVipDeselected()).to.be.false;
        });

        it('should return true when row selected from table', function () {
            scope.loadBalancer.sharedVip = '';
            expect(scope.sharedVipDeselected()).to.be.true;
        });
    });

    describe('will populate cloud servers modal', function () {
        var scope, modalScope = {};
        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        it('should keep loading flag until servers have been fully loaded', function () {
            scope.addCloudServers.preHook(modalScope);
            expect(modalScope.isLoading, 'Modal Loading State').to.be.true;
            expect(modalScope.cloudIpAddresses).to.be.empty;
            nextGenServers.resolve();
            firstGenServers.resolve();
            scope.$digest();
            expect(modalScope.isLoading, 'Modal Not Loading State').to.be.false;
            expect(modalScope.cloudIpAddresses).to.not.be.empty;
        });

    });

    describe('will add checked cloud servers to selectedServers', function () {
        var scope, modalScope = {};
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            nextGenServers.resolve();
            firstGenServers.resolve();
            scope.$digest();

        });

        it('should not have a valid submit button when no checkboxes are selected', function () {
            expect(ctrl).to.exist;
            expect(scope.values.length).to.equal(0);
        });

        it('should have a valid submit button when one checkbox is selected', function () {
            scope.updateCheckboxes(scope.serverInfo.cloudIpAddresses[0]);
            expect(scope.values.length).to.equal(1);
        });

        it('should select the first server from the popup modal', function () {
            expect(ctrl).to.exist;

            scope.serverInfo.cloudIpAddresses[0].checked = true;
            scope.addCloudServers.postHook();

            expect(scope.loadBalancer.selectedServers.length).to.equal(1);
            expect(scope.loadBalancer.selectedServers[0].name).to.equal('server_1');

        });

        it('should set cloudIpAddresses on the modal', function () {
            scope.addCloudServers.preHook(modalScope);
            expect(modalScope.isLoading).to.be.false;
            expect(modalScope.cloudIpAddresses).to.be.empty;
        });

        it('should remove an unchecked server', function () {
            scope.serverInfo.cloudIpAddresses[0].checked = true;
            scope.addCloudServers.postHook();
            scope.serverInfo.cloudIpAddresses[0].checked = false;
            scope.serverInfo.cloudIpAddresses[2].checked = true;
            scope.addCloudServers.postHook();

            expect(scope.loadBalancer.selectedServers.length).to.equal(1);
            expect(scope.loadBalancer.selectedServers[0].name).to.equal('server_3');

        });

        it('should keep an already checked server', function () {
            scope.serverInfo.cloudIpAddresses[0].checked = true;
            scope.addCloudServers.postHook();
            scope.serverInfo.cloudIpAddresses[0].checked = true;
            scope.addCloudServers.postHook();

            expect(scope.loadBalancer.selectedServers.length).to.equal(1);
            expect(scope.loadBalancer.selectedServers[0].name).to.equal('server_1');

        });

        it('should remove all the servers when all are unchecked', function () {
            scope.addCloudServers.postHook();

            expect(scope.loadBalancer.selectedServers.length).to.equal(0);

        });

    });

    describe('adding external nodes', function () {
        var scope, modalScope;
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            modalScope = {};
            nextGenServers.resolve();
            firstGenServers.resolve();
            scope.$digest();

        });

        it('should set fields on the scope in preHook', function () {
            scope.addExternalNodes.preHook(modalScope);

            expect(modalScope.fields.host).to.equal('');
            expect(modalScope.fields.port).to.equal(scope.defaultScope);

        });

        it('should successfully add an external node', function () {
            scope.addExternalNodes.preHook(modalScope);
            modalScope.fields.host = '192.168.2.35';
            modalScope.fields.port = '8080';

            scope.addExternalNodes.postHook(modalScope.fields);

            expect(scope.loadBalancer.selectedServers.length).to.equal(1);
            var server = scope.loadBalancer.selectedServers[0];
            /* jshint camelcase:false */
            expect(server.addresses[0].address).to.equal('192.168.2.35');
            expect(server.addresses[0].port).to.equal('8080');
            expect(server.type).to.equal('External (192.168.2.35)');

        });

    });

    describe('remove a selected server from the nodes table', function () {
        var scope, cloudServer, selectedCloudIp, externalServer, externalIp;
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            nextGenServers.resolve();
            firstGenServers.resolve();
            scope.$digest();

            selectedCloudIp = scope.serverInfo.cloudIpAddresses[0];
            selectedCloudIp.checked = true;
            cloudServer = selectedCloudIp.server;
            scope.addCloudServers.postHook();

            var fields = { host: '192.168.2.35', port: '8080' };
            scope.addExternalNodes.postHook(fields);
            externalServer = scope.serverInfo.externalServers[0];
            externalIp = externalServer.addresses[0];

            expect(scope.loadBalancer.selectedServers[0].addresses[0]).to.equal(selectedCloudIp);
            expect(scope.loadBalancer.selectedServers[1]).to.equal(externalServer);

        });

        it('should remove a cloud server', function () {
            scope.removeSelectedIpAddress(selectedCloudIp);

            expect(scope.loadBalancer.selectedServers.length).to.equal(1);
            expect(scope.loadBalancer.selectedServers[0]).to.equal(externalServer);
            expect(scope.serverInfo.cloudIpAddresses[0].checked).to.be.false;
        });
        it('should remove an external server', function () {
            scope.removeSelectedIpAddress(externalIp);

            expect(scope.loadBalancer.selectedServers.length).to.equal(1);
            expect(scope.loadBalancer.selectedServers[0]).to.equal(cloudServer);
            expect(selectedCloudIp.checked).to.be.true;
            expect(externalIp.checked).to.be.false;
        });

        it('should remove all servers', function () {
            scope.removeSelectedIpAddress(selectedCloudIp);
            scope.removeSelectedIpAddress(externalIp);
            expect(scope.loadBalancer.selectedServers.length).to.equal(0);
            expect(selectedCloudIp.checked).to.be.false;
            expect(externalIp.checked).to.be.false;

        });

    });

});

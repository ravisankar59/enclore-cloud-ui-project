describe('Controller: ShowLoadBalancerCtrl', function () {
    var httpBackend, ctrl, q, interval, location, lbaasSvc, status,
        serverLoaders, tableBoilerplate, pageSvcPostHook, toggleSwitchSettings, rxPromise;

    var cloudServers;
    var lbaasNodeService;
    var cloudUrl;
    var algorithms;
    var persistenceType;
    var sslTermination;
    var lbaasConstants;

    var validRouteParams = {
        'user': 'hub_cap',
        'accountNumber': '323676',
        'loadbalancerid': '57361',
        'region': 'STAGING'
    };

    var loadBalancerDetails = {
        'loadBalancer': {
            'accessList':  [
                { id: 4377, address: '3.3.9.6', type: 'DENY' },
                { id: 4378, address: '1.3.9.6', type: 'ALLOW' },
                { id: 4379, address: '2.3.9.6', type: 'DENY' }
            ],
            'name': 'lbaasDetails1',
            'id': 57361,
            'cluster': {
                'id': 1
            },
            'virtualIps': [
                {
                    'ip_address': '184.106.24.36',
                    'id': 22,
                    'ip_type': 'PUBLIC',
                    'version': 'IPV4'
                }, {
                    'ip_address': '184.106.24.37',
                    'id': 23,
                    'ip_type': 'PUBLIC',
                    'version': 'IPV4'
                }
            ],
            'protocol': 'HTTP',
            'port': 80,
            'algorithm': 'RANDOM',
            'timeout': 30,
            'nodes': [
                {
                    'nodeStatus': 'ONLINE',
                    'nodeType': 'PRIMARY',
                    'slice_id': '',
                    'address': '10.1.1.1',
                    'port': 80,
                    'condition': 'ENABLED',
                    'slice_name': '',
                    'weight': null,
                    'region': null,
                    'id': 212613
                },
                {
                    'nodeStatus': 'ONLINE',
                    'nodeType': 'PRIMARY',
                    'slice_id': '',
                    'address': '172.16.1.15',
                    'port': 80,
                    'condition': 'ENABLED',
                    'slice_name': '',
                    'weight': null,
                    'region': null,
                    'id': 212617
                }
            ],
            'connectionLogging': {
                'enabled': true
            },
            'connectionThrottle': {
                'maxConnections': 100,
                'minConnections': 1,
                'maxConnectionRate': 1,
                'rateInterval': 1
            },
            'contentCaching': {
                'enabled': true
            },
            'rateLimit': {},
            'healthMonitor': {
                'type': 'CONNECT',
                'delay': 10,
                'timeout': 10,
                'attemptsBeforeDeactivation': 3
            }
        }
    };

    var populateScope = function (routeParams) {
        var scope;
        module('encore.ui');
        module('encore.svcs.cloud.config');
        module('loadbalancers');

        inject(function ($httpBackend, $controller, $rootScope, $q, $interval, $location, Lbaas,
                        Status, CloudServerLoaders, TableBoilerplate, PageSvcPostHook, TOGGLE_SWITCH,
                        LbaasNodeService, CLOUD_URL, ALGORITHMS, rxPromiseNotifications, LbaasCloudServerService,
                        PERSISTENCE_TYPE, LBAAS_CONSTANTS) {

            httpBackend = $httpBackend;
            scope = $rootScope.$new();
            q = $q;
            interval = $interval;
            location = $location;
            lbaasSvc = Lbaas;
            status = Status;
            serverLoaders = CloudServerLoaders;
            tableBoilerplate = TableBoilerplate;
            pageSvcPostHook = PageSvcPostHook;
            toggleSwitchSettings = TOGGLE_SWITCH;
            cloudServers = LbaasCloudServerService;
            lbaasNodeService = LbaasNodeService;
            cloudUrl = CLOUD_URL;
            rxPromise = rxPromiseNotifications;
            cloudUrl.servers = '/cloud/323676/hub_cap/servers';
            algorithms = ALGORITHMS;
            persistenceType = PERSISTENCE_TYPE;
            sslTermination = LBAAS_CONSTANTS.sslTermination;
            lbaasConstants = LBAAS_CONSTANTS;

            sinon.spy(lbaasSvc, 'deleteVip');
            sinon.spy(status, 'setLoading');
            sinon.spy(status, 'setSuccessImmediate');
            sinon.spy(status, 'setError');
            sinon.spy(lbaasSvc, 'suspendLoadBalancer');
            sinon.spy(cloudServers, 'getFirstGenServers');
            sinon.spy(cloudServers, 'getAccountServers');
            sinon.spy(lbaasNodeService, 'updateNode');
            sinon.spy(lbaasNodeService, 'deleteNode');
            sinon.spy(lbaasNodeService, 'getNodeListExtendedView');
            sinon.spy(lbaasSvc, 'getHosts');
            sinon.spy(lbaasSvc, 'assignHost');
            sinon.spy(lbaasSvc, 'updateLoadBalancer');
            sinon.spy(lbaasSvc, 'getProtocols');
            sinon.spy(lbaasSvc, 'disableSessionPersistence');
            sinon.spy(lbaasSvc, 'enableSessionPersistence');
            sinon.spy(lbaasSvc, 'disableSslTermination');
            sinon.spy(lbaasSvc, 'updateSslTermination');

            helpers.resourceStub(q, lbaasSvc, 'getErrorPage', {});
            helpers.resourceStub(q, lbaasSvc, 'getSSLTermination', {});
            helpers.resourceStub(q, lbaasSvc, 'getHealthMonitor', {});
            helpers.resourceStub(q, lbaasSvc, 'getAccessList', {});
            helpers.resourceStub(q, lbaasSvc, 'getSessionPersistence', {});
            helpers.resourceStub(q, lbaasSvc, 'updateHealthMonitor', {});
            helpers.resourceStub(q, lbaasSvc, 'disableHealthMonitor', {});
            helpers.resourceStub(q, lbaasSvc, 'changeName', {});
            helpers.resourceStub(q, lbaasSvc, 'delete', {});
            helpers.resourceStub(q, lbaasSvc, 'changeErrorPage', {});
            helpers.resourceStub(q, lbaasSvc, 'deleteErrorPage', {});

            ctrl = $controller('ShowLoadBalancerCtrl', {
                $scope: scope,
                $routeParams: routeParams,
                $q: q,
                $interval: interval,
                $location: location,
                Lbaas: lbaasSvc,
                LbaasNodeService: lbaasNodeService,
                Status: status,
                ServerLoaders: serverLoaders,
                TableBoilerplate: tableBoilerplate,
                PageSvcPostHook: pageSvcPostHook,
                CLOUD_URL: cloudUrl,
                ALGORITHMS: algorithms,
                LbaasCloudServerService: cloudServers,
                PERSISTENCE_TYPE: persistenceType,
                LBAAS_CONSTANTS: lbaasConstants
            });
        });
        return scope;
    };

    describe('Move Host', function () {
        var scope, modalScope = {};
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            scope.loadBalancer = {
                cluster: {
                    id: 1
                },
                id: 57361
            };
            httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                .respond({});
        });
        describe('Move Host: preHook Function', function () {
            beforeEach(function () {
                var stubbedResponse = { hosts: [
                        { status: 'FAILOVER', id: 1, name: 'HOST1' },
                        { status: 'ACTIVE_TARGET', id: 2, name: 'HOST2' },
                        { status: 'ACTIVE_TARGET', id: 3, name: 'HOST3' }
                    ]
                };
                httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/clusters/1/hosts').respond(stubbedResponse);
                scope.actions.preMoveHostModalHook(modalScope);
                httpBackend.flush();
            });

            it('should have called getHosts of Lbaas', function () {
                sinon.assert.called(lbaasSvc.getHosts);
            });

            it('should have expected data in modalScope.fields', function () {
                var expectFields = { hosts:
                    [
                        { status:'ACTIVE_TARGET', id: 2, name: 'HOST2' },
                        { status:'ACTIVE_TARGET', id: 3, name: 'HOST3' }
                    ],
                    selectedHost: { status: 'ACTIVE_TARGET', id: 2, name: 'HOST2' }
                };

                expect(expectFields).to.be.eql(modalScope.fields);
            });
        });

        describe('Move Host: postHook Function', function () {
            beforeEach(function () {
                var fields = {
                    selectedHost: { status: 'ACTIVE_TARGET', id: 2 }
                };
                var putParams = {
                    loadBalancers: [
                        {
                            id:57361,
                            host:
                            {
                                id: 2
                            }
                        }
                    ]
                };
                httpBackend.whenPUT('/api/cloud/users/hub_cap/lbaas/STAGING/reassign_hosts', putParams).respond({});
                scope.actions.postMoveHostModalHook(fields);
                httpBackend.flush();
            });

            it('should have called assignHost of Lbaas', function () {
                sinon.assert.called(lbaasSvc.assignHost);
            });

            it('should call Status.setSuccessImmediate', function () {
                var message = 'Load Balancer Host Moved Successfully.';
                sinon.assert.calledWith(status.setSuccessImmediate, message);
            });
        });
    });

    describe('SSL Termination', function () {
        var scope;
        var modalScope = {};

        beforeEach(function () {
            scope = populateScope(validRouteParams);
            httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                .respond({});
        });

        describe('Disable SSL Termination', function () {
            beforeEach(function () {
                httpBackend.whenDELETE('/api/cloud/users/hub_cap/lbaas/STAGING/57361/ssltermination').respond();
                scope.actions.postDisableSslTermination();
                httpBackend.flush();
            });

            it('should have called disableSSLTermination method of lbaasSvcs', function () {
                sinon.assert.called(lbaasSvc.disableSslTermination);
            });

            it('should have called setLoading method with expected message', function () {
                var message = 'Disabling SSL Termination';
                sinon.assert.calledWith(status.setLoading, message);
            });

            it('should have called setSuccessImmediate method with expected message', function () {
                var message = 'SSL Termination Disabled Successfully.';
                sinon.assert.calledWith(status.setSuccessImmediate, message);
            });

            it('should have updated scope.actions.toggleStatus.sslTermination to false', function () {
                expect(scope.actions.toggleStatus.sslTermination).to.be.equals(false);
            });

            it('should have updated scope.actions.toggleStatus.sslTermination to false', function () {
                expect(scope.loadBalancer.sslTermination).to.be.eql({});
            });
        });

        describe('Enable SSL Termination: preHook Function', function () {

            beforeEach(function () {
                scope.actions.preAddSslTermination(modalScope);
                httpBackend.flush();
            });

            it('should have updated modalScope with expected data on add', function () {
                var expectedData = {
                    allowedTraffic: sslTermination.trafficList[0],
                    securePort: '',
                    certificate: '',
                    privateKey: '',
                    intermediateCertificate: '',
                    allowedTrafficList: sslTermination.trafficList,
                    hasExternalNode: false,
                    submitText: 'Enable SSL Termination',
                    showCertificateStatus: true
                };
                expect(modalScope.fields).to.be.eql(expectedData);
            });
        });

        describe('Enable SSL Termination: postHook Function', function () {
            var fields = {
                securePort: 80,
                certificate: '',
                allowedTraffic: { id: 1, name: 'some data' },
                privateKey: 'cert',
                intermediateCertificate: 'cert'
            };
            beforeEach(function () {
                httpBackend.whenPUT('/api/cloud/users/hub_cap/lbaas/STAGING/57361/ssltermination').respond(200);
                scope.actions.postAddSslTermination(fields);
                httpBackend.flush();
            });

            it('should have called updateSSLTermination method of lbaasSvcs', function () {
                sinon.assert.called(lbaasSvc.updateSslTermination);
            });

            it('should have called setLoading method with expected message', function () {
                var message = 'Updating SSL Termination';
                sinon.assert.calledWith(status.setLoading, message);
            });

            it('should have called setSuccessImmediate method with expected message', function () {
                var message = 'SSL Termination Updated Successfully.';
                sinon.assert.calledWith(status.setSuccessImmediate, message);
            });

            it('should have updated scope.actions.toggleStatus.sslTermination to true', function () {
                expect(scope.actions.toggleStatus.sslTermination).to.be.equals(true);
            });
        });

    });

    describe('Edit Load Balancer', function () {
        var scope, modalScope = {};
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                .respond({});
        });

        describe('Edit Load Balancer: preHook Function', function () {
            var response = {
                protocols: [
                    { name: 'HTTP', port: 80 },
                    { name: 'FTP', port: 21 }
                ]
            };
            beforeEach(function () {
                httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/protocols').respond(response);
                scope.actions.preEditLoadBalancerDetails(modalScope);
                httpBackend.flush();
            });

            it('should have called getProtocols method of lbaasSvcs', function () {
                sinon.assert.called(lbaasSvc.getProtocols);
            });

            it('should have called setLoading method with expected message', function () {
                var message = 'Loading Load Balancer Details';
                sinon.assert.calledWith(status.setLoading, message);
            });

            it('should have updated protocolList of modalScope', function () {
                expect(response.protocols).to.be.eql(modalScope.protocolsList);
            });

            it('should have updated modalScope.fields with expected data', function () {
                var expectedFields = {
                    selectedName: scope.loadBalancer.name,
                    protocols: modalScope.protocolsList,
                    selectedProtocol: modalScope.protocolsList[0],
                    selectedPort: scope.loadBalancer.port,
                    selectedTimeout: scope.loadBalancer.timeout,
                    algorithms: algorithms.algorithmList,
                    selectedAlgorithm: algorithms.algorithmList[0]
                };
                expect(expectedFields).to.be.eql(modalScope.fields);
            });
        });

        describe('Edit Load Balancer: postHook Function', function () {
            var fields;

            beforeEach(function () {
                fields = {
                    selectedName: 'TestLb',
                    protocols: [{ name: 'HTTP', port: 80 }, { name: 'FTP', port: 21 }],
                    selectedProtocol: { name: 'FTP', port: 80 },
                    selectedPort: 80,
                    selectedTimeout: 30,
                    algorithms: algorithms.algorithmList,
                    selectedAlgorithm: algorithms.algorithmList[0]
                };
                httpBackend.whenPUT('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(fields);
                scope.actions.postEditLoadBalancerDetails(fields);
                httpBackend.flush();
            });

            it('should have called updateLoadBalancer of lbaasSvcs', function () {
                sinon.assert.called(lbaasSvc.updateLoadBalancer);
            });

            it('should have called setSuccessImmediate method with expected message', function () {
                var message = 'Load Balancer Updated Successfully.';
                sinon.assert.calledWith(status.setSuccessImmediate, message);
            });

            it('should have updated $scope with expected data', function () {
                expect(scope.loadBalancer.name).to.be.eql(fields.selectedName);
                expect(scope.loadBalancer.timeout).to.be.eql(fields.selectedTimeout);
                expect(scope.loadBalancer.protocol).to.be.eql(fields.selectedProtocol.name);
                expect(scope.loadBalancer.port).to.be.eql(fields.selectedProtocol.port);
                expect(scope.loadBalancer.algorithm).to.be.eql(fields.selectedAlgorithm.value);
            });
        });

    });

    describe('Suspend Load Balancer', function () {
        var scope, modalScope = {};
        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });
        describe('Suspend Load Balancer: preHook Function', function () {
            beforeEach(function () {
                scope.actions.preSuspendModalHook(modalScope);
            });

            it('should create modalScope.fields object', function () {
                var expectedField = { ticketNumber: '', reason: '' };
                expect(modalScope.fields).to.be.eql(expectedField);
            });

        });

        describe('Suspend Load Balancer: postHook Function', function () {
            beforeEach(function () {
                modalScope.fields = { ticketNumber: 123, reason: 'Testing' };
                httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
                httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').respond({});
                httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
                httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                    .respond({});
                httpBackend.whenPOST('/api/cloud/users/hub_cap/lbaas/STAGING/57361/suspend').respond({});
                scope.actions.postSuspendModalHook(modalScope.fields);
                httpBackend.flush();
            });

            it('should call suspendLoadBalancer method of lbaasSvc', function () {
                sinon.assert.called(lbaasSvc.suspendLoadBalancer);
            });

            it('should call Status.setSuccessImmediate', function () {
                var message = 'Load Balancer Suspended Successfully.';
                sinon.assert.calledWith(status.setSuccessImmediate, message);
            });

            it('should be set with disable styles when status is suspended', function () {
                expect(scope.setDisableStyles).to.be.equal('lbaas-disable-link');
                expect(scope.lbaasIsSuspended).to.be.equal(true);
                expect(scope.suspendTooltipText).to.be.equal('LBaaS is suspended. Unsuspend to take actions.');
            });

            it('should be set with non-disable styles when status is active', function () {
                scope.loadBalancer.status = 'ACTIVE';
                scope.$apply();
                expect(scope.setDisableStyles).to.be.equal('');
                expect(scope.lbaasIsSuspended).to.be.equal(false);
                expect(scope.suspendTooltipText).to.be.equal('');
            });
        });

    });

    describe('Add Cloud Servers to Load Balancer', function () {
        var scope, modalScope = {};
        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        describe('Add Cloud Servers: preHook Function', function () {
            beforeEach(function () {
                scope.actions.preAddCloudServers(modalScope);
            });

            it('should call LbaasCloudServerService.getFirstGenServers to get Cloud Servers List', function () {
                sinon.assert.called(cloudServers.getFirstGenServers);
            });

            it('should call LbaasCloudServerService.getAccountServers to get Cloud Servers List', function () {
                sinon.assert.called(cloudServers.getAccountServers);
            });
        });

        describe('Add Cloud Servers: postHook Function', function () {
            var servers = [ {
                rowIsSelected: false,
                ipAddress: '1.1.1.1',
                port: '80',
                selectedCondition: {
                    name: 'ENABLED'
                }
            }, {
                rowIsSelected: false,
                ipAddress: '2.2.2.2',
                port: '80',
                selectedCondition: {
                    name: 'ENABLED'
                }
            }];

            beforeEach(function () {
                scope.actions.postAddCloudServers(servers);
            });

            it('should call Status.setError with "No Nodes Selected" message', function () {
                sinon.assert.calledWith(status.setError, 'No Servers Added: No Nodes Selected');
            });
        });
    });

    describe('URL for first gen and next gen server in Node Table', function () {
        var scope;
        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        it('should return expected url for next gen', function () {
            var expectedURI = '/cloud/323676/hub_cap/servers/staging/1234';
            var node = { 'slice_id': '1234', 'region': 'staging' };
            var uri = scope.actions.getNodeUrl(node);
            expect(uri).to.equal(expectedURI);
        });

        it('should return expected url for first gen', function () {
            var expectedURI = '/cloud/323676/hub_cap/servers/firstgen/1234';
            var node = { 'slice_id': '1234', 'region': '' };
            var uri = scope.actions.getNodeUrl(node);
            expect(uri).to.equal(expectedURI);
        });

    });

    describe('Nodes List of LoadBalancer', function () {
        var scope;
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            var connectionThrottle = { 'connectionThrottle': loadBalancerDetails.loadBalancer.connectionThrottle };
            httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                .respond(connectionThrottle);
            httpBackend.flush();
        });

        it('should have called getNodeListExtendedView of lbaasNodeService', function () {
            sinon.assert.called(lbaasNodeService.getNodeListExtendedView);
        });

    });

    describe('Delete Node from Nodes Table', function () {

        var scope;
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
            httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                .respond({});
            httpBackend.expectDELETE('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/88659').respond(200);
            scope.actions.deleteNode(1, 88659);
            httpBackend.flush();
        });

        it('should have called deleteNode of Nodes', function () {
            sinon.assert.called(lbaasNodeService.deleteNode);
        });

        it('sets the status', function () {
            sinon.assert.calledWith(status.setLoading, 'Deleting node');
        });

        it('should call Status.setSuccessImmediate', function () {
            /*jshint multistr: true */
            var successMessage = 'Node is scheduled for removal and will no longer ' +
                                 'be visible in the node list once removal is complete.';
            sinon.assert.calledWith(status.setSuccessImmediate, successMessage);
        });

    });

    describe('load balancer Edit Node Configuration', function () {
        var scope, modalScope;
        var node;
        beforeEach(function () {

            scope = populateScope(validRouteParams);
            modalScope = {};
            var connectionThrottle = { 'connectionThrottle': loadBalancerDetails.loadBalancer.connectionThrottle };
            httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                .respond(connectionThrottle);
            httpBackend.flush();

            node = {
                address: '10.10.10.10',
                port: 80,
                condition: 'ENABLED',
                nodeType: 'PRIMARY',
                weight: '1',
                id: 88659
            };
            scope.actions.preEditNode(modalScope, node);
        });

        describe('load balancer Edit Node Configuration: preHook Function', function () {

            it('should update modalScope with expected data', function () {
                var expectedModal = {
                    address: '10.10.10.10',
                    port: 80,
                    condition:  'ENABLED',
                    nodeType: 'PRIMARY',
                    weight: '1',
                    id: 88659
                };

                expect(modalScope.changedNode).to.be.eql(expectedModal);
            });
        });

        describe('load balancer Edit Node Configuration: postHook Function', function () {

            it('should perform expected operations on postEditNode call', function () {
                modalScope.changedNode.weight = '2';
                httpBackend.whenPUT('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/88659').respond({});
                scope.actions.postEditNode(modalScope.changedNode);
                httpBackend.flush();
                sinon.assert.called(lbaasNodeService.updateNode);
                sinon.assert.calledWith(status.setSuccessImmediate, 'Node updated successfully.');
            });

        });

    });

    describe('load balancer delete vip', function () {
        var scope;
        var vip = _.first(loadBalancerDetails.loadBalancer.virtualIps);

        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        it('should make a call to delete VIP function', function () {
            expect(ctrl).to.exist;
            scope.actions.postDeleteVip(vip);
            sinon.assert.called(lbaasSvc.deleteVip);
        });
    });

    describe('Error Page', function () {

        var scope, modalScope, connectionThrottle;
        var responseData = {
            'errorPage': {
                'content': 'Default Data'
            }
        };
        var fieldsCustom = {
            errorPageContent: '<html> </html>',
            selectedType: 'Custom'
        };

        var fieldsDefault = {
            errorPageContent: '<html> </html>',
            selectedType: 'Custom'
        };

        beforeEach(function () {
            scope = populateScope(validRouteParams);
            modalScope = {};
            connectionThrottle = { 'connectionThrottle': loadBalancerDetails.loadBalancer.connectionThrottle };
            httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                .respond(connectionThrottle);
            httpBackend.flush();
        });

        describe('Error Page: pre hook', function () {

            it('should call GET to get Error Page Content', function () {
                httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/errorpage').respond(responseData);
                scope.actions.preEditErrorPage(modalScope);
            });

            it('should call lbaas getErrorPage', function () {
                scope.actions.preEditErrorPage(modalScope);
                var params = {
                    id: '57361',
                    region: 'STAGING',
                    user: 'hub_cap'
                };
                sinon.assert.calledWith(lbaasSvc.getErrorPage, params);
            });

        });

        describe('Error Page: post hook', function () {

            it('sets the status while loading Error Page content', function () {
                scope.actions.postEditErrorPage(fieldsCustom);
                sinon.assert.calledWith(status.setLoading, 'Updating Error Page content');
            });

            it('should have called lbaasSvcs.changeErrorPage', function () {
                scope.actions.postEditErrorPage(fieldsCustom);
                var paramsSvcs = {
                    id: '57361',
                    region: 'STAGING',
                    user: 'hub_cap'
                };
                var params = {
                    content: '<html> </html>'
                };
                sinon.assert.calledWith(lbaasSvc.changeErrorPage, paramsSvcs, params);
            });

            it('should call PUT to update Error Page content', function () {
                var putParams = {
                    content: '<html> </html>'
                };
                httpBackend.expectPUT('/api/cloud/users/hub_cap/lbaas/STAGING/57361/errorpage', putParams).respond(200);
                scope.actions.postEditErrorPage(fieldsCustom);
            });

            it('should have called lbaasSvcs.deleteErrorPage', function () {
                scope.actions.postEditErrorPage(fieldsDefault);
                var paramsSvcs = {
                    id: '57361',
                    region: 'STAGING',
                    user: 'hub_cap'
                };
                var params = {
                    content: '<html> </html>'
                };
                sinon.assert.calledWith(lbaasSvc.changeErrorPage, paramsSvcs, params);
            });

            it('should call DELETE to delete Error Page content', function () {
                httpBackend.expectDELETE('/api/cloud/users/hub_cap/lbaas/STAGING/57361/errorpage').respond(200);
                scope.actions.postEditErrorPage(fieldsDefault);
            });

        });

    });

    describe('Session Persistence', function () {
        var scope;
        var paramsSvcs = {
            id: '57361',
            region: 'STAGING',
            user: 'hub_cap'
        };
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle').respond({});
        });

        describe('Session Persistence: Disable', function () {

            beforeEach(function () {
                httpBackend.whenDELETE('/api/cloud/users/hub_cap/lbaas/STAGING/57361/sessionpersistence')
                    .respond(200);
                scope.actions.postDisableSessionPersistence();
                httpBackend.flush();
            });

            it('should have called lbaasSvcs.disableSessionPersistence', function () {
                sinon.assert.calledWith(lbaasSvc.disableSessionPersistence, paramsSvcs);
            });

            it('should call Status.setLoading', function () {
                var message = 'Disabling Session Persistence';
                sinon.assert.calledWith(status.setLoading, message);
            });

            it('should call Status.setSuccessImmediate', function () {
                var message = 'Session Persistence Disabled Successfully.';
                sinon.assert.calledWith(status.setSuccessImmediate, message);
            });

            it('should set expected value to toggleStatus.sessionPersistence', function () {
                expect(scope.actions.toggleStatus.sessionPersistence).to.
                        equal(false);
            });

            it('should set expected value to loadBalancer.sessionPersistence', function () {
                expect(scope.loadBalancer.sessionPersistence).to.
                        eql({});
            });

        });

        describe('Session Persistence: Enable', function () {

            beforeEach(function () {
                scope.loadBalancer = {
                    protocol: 'HTTP'
                };
                var params = { persistenceType: 'HTTP_COOKIE' };
                httpBackend.whenPUT('/api/cloud/users/hub_cap/lbaas/STAGING/57361/sessionpersistence', params)
                    .respond(200);
                scope.actions.postEnableSessionPersistence();
                httpBackend.flush();
            });

            it('should call Status.setLoading', function () {
                var message = 'Enabling Session Persistence';
                sinon.assert.calledWith(status.setLoading, message);
            });

            it('should have called lbaasSvcs.enableSessionPersistence', function () {
                var params = { persistenceType: 'HTTP_COOKIE' };
                sinon.assert.calledWith(lbaasSvc.enableSessionPersistence, paramsSvcs, params);
            });

            it('should call Status.setSuccessImmediate', function () {
                var message = 'Session Persistence Enabled Successfully.';
                sinon.assert.calledWith(status.setSuccessImmediate, message);
            });

            it('should set expected value to toggleStatus.sessionPersistence', function () {
                expect(scope.actions.toggleStatus.sessionPersistence).to.
                        equal(true);
            });

            it('should have called lbaasSvcs.getSessionPersistence', function () {
                sinon.assert.calledWith(lbaasSvc.getSessionPersistence, paramsSvcs);
            });

        });
    });

    describe('Connection Throttle', function () {

        var scope, modalScope, connectionThrottle;

        beforeEach(function () {
            scope = populateScope(validRouteParams);
            modalScope = {};
            connectionThrottle = { 'connectionThrottle': loadBalancerDetails.loadBalancer.connectionThrottle };
            httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                .respond(connectionThrottle);
            httpBackend.flush();
        });

        describe('add connection throttle', function () {

            describe('preHook function', function () {

                it('populates the modal with connection throttle data', function () {
                    scope.actions.preAddConnectionThrottle(modalScope);
                    expect(modalScope.fields.maxConnections).to.
                        equal(loadBalancerDetails.loadBalancer.connectionThrottle.maxConnections);
                    expect(modalScope.fields.minConnections).to.
                        equal(loadBalancerDetails.loadBalancer.connectionThrottle.minConnections);
                    expect(modalScope.fields.maxConnectionRate).to.
                        equal(loadBalancerDetails.loadBalancer.connectionThrottle.maxConnectionRate);
                    expect(modalScope.fields.rateInterval).to.
                        equal(loadBalancerDetails.loadBalancer.connectionThrottle.rateInterval);
                });

            });

            describe('postHook function', function () {

                var modalFields = {
                    maxConnections: 50,
                    minConnections: 25,
                    maxConnectionRate: 20,
                    rateInterval: 5
                };

                beforeEach(function () {
                    httpBackend.expectPUT('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle',
                                          modalFields).respond(200);
                    httpBackend.expectGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                        .respond({ 'connectionThrottle': modalFields });
                    scope.actions.postAddConnectionThrottle(modalFields);
                    httpBackend.flush();
                });

                it('sets the status', function () {
                    sinon.assert.calledWith(status.setLoading, 'Adding Connection Throttle ' +
                                            scope.loadBalancer.name);
                });

                it('updates connectionThrottle for the load balancer', function () {
                    expect(scope.loadBalancer.connectionThrottle.maxConnections).to.equal(modalFields.maxConnections);
                    expect(scope.loadBalancer.connectionThrottle.minConnections).to.equal(modalFields.minConnections);
                    expect(scope.loadBalancer.connectionThrottle.maxConnectionRate).to.
                        equal(modalFields.maxConnectionRate);
                    expect(scope.loadBalancer.connectionThrottle.rateInterval).to.equal(modalFields.rateInterval);
                });

            });

        });

        describe('disable connection throttle', function () {

            beforeEach(function () {
                httpBackend.expectDELETE('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                    .respond(200);
                scope.actions.postDisableConnectionThrottle();
                httpBackend.flush();
            });

            it('sets the status', function () {
                sinon.assert.calledWith(status.setLoading, 'Removing Connection Throttle ' + scope.loadBalancer.name);
            });

            it('disables connection throttle for the load balancer', function () {
                expect(scope.loadBalancer.connectionThrottle).to.be.empty;
            });

        });

    });

    describe('Add temporary ratelimit', function () {

        var scope;

        beforeEach(function () {
            scope = populateScope(validRouteParams);
            httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                .respond({});
            httpBackend.flush();
        });

        describe('postHook function', function () {

            var modalFields = {
                expirationTime: '2016-07-07 17:30:00',
                maxRequestsPerSecond: '4',
                ticket: {
                    ticketId: 1234,
                    comment: 'things'
                }
            };

            beforeEach(function () {
                scope.actions.postAddTemporaryRateLimit(modalFields);
            });

            it('sets the status', function () {
                sinon.assert.calledWith(status.setLoading, 'Adding Temporary Rate Limit');
            });

        });

    });

    describe('update temporary rate limit', function () {

        var scope, modalScope;
        var validRouteParams = {
            'user': 'hub_cap',
            'accountNumber': '323676',
            'loadbalancerid': '57000',
            'region': 'STAGING'
        };
        var modalFields = {
            expirationTime: '2017-07-07 12:00:00',
            maxRequestsPerSecond: 8,
        };
        beforeEach(function () {
            modalScope = {};
            loadBalancerDetails.loadBalancer.rateLimit = {
                expirationTime: '2017-07-07T12:00:00Z',
                maxRequestsPerSecond: 8,
            };
            scope = populateScope(validRouteParams);
            httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57000/nodes/extended_view').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57000').respond(loadBalancerDetails);
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57000/connectionthrottle')
                .respond({});
            httpBackend.flush();
        });

        describe('preHook function', function () {

            beforeEach(function () {
                scope.actions.preUpdateTemporaryRateLimit(modalScope);
            });

            it('populates the expirationTime with ratelimit data', function () {
                var expirationTime = moment(moment.utc(new Date(scope.loadBalancer.rateLimit.expirationTime)
                                .toUTCString()).format('YYYY-MM-DD HH:mm:SS'))._i;
                expect(modalScope.fields.expirationTime).to.equal(expirationTime);
            });

            it('populates the maxrequestspersecond with ratelimit data', function () {
                expect(modalScope.fields.maxRequestsPerSecond).to.
                    equal(loadBalancerDetails.loadBalancer.rateLimit.maxRequestsPerSecond);
            });
        });

        describe('postHook function', function () {

            it('sets the status', function () {
                scope.actions.postUpdateTemporaryRateLimit(modalFields);
                sinon.assert.calledWith(status.setLoading, 'Updating Temporary Rate Limit');
            });

            it('update ratelimit for the load balancer', function () {
                var expirationTime = moment(moment.utc(new Date(scope.loadBalancer.rateLimit.expirationTime)
                            .toUTCString()).format('YYYY-MM-DD HH:mm:SS'))._i;
                expect(modalFields.expirationTime).to.equal(expirationTime);
                expect(modalFields.maxRequestsPerSecond).to.equal(scope.loadBalancer.rateLimit.maxRequestsPerSecond);
            });
        });
    });

    describe('Add Settings Success', function () {

        var scope, modalScope;
        var connectionThrottle = {
            maxConnections: 50,
            minConnections: 25,
            maxConnectionRate: 20,
            rateInterval: 5
        };

        beforeEach(function () {
            validRouteParams.loadbalancerid = '57361';
            scope = populateScope(validRouteParams);
            modalScope = {};
            httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                .respond(connectionThrottle);
            httpBackend.flush();
        });

        describe('Connection Logging', function () {

            it('should get the connection logging details', function () {
                expect(scope.loadBalancer.connectionLogging).to.eql(
                                        loadBalancerDetails.loadBalancer.connectionLogging);
            });

        });

        describe('Content Caching', function () {

            it('should get the content caching details', function () {
                expect(scope.loadBalancer.contentCaching.enabled).to.equal(
                                        loadBalancerDetails.loadBalancer.contentCaching.enabled);
            });

        });

        describe('Temporary Rate Limit', function () {

            it('should get the temporary rate limit details', function () {
                expect(scope.loadBalancer.rateLimit).to.eql(loadBalancerDetails.loadBalancer.rateLimit);
            });

        });
    });

    describe('Add Settings Failure', function () {

        var validRouteParams = {
            'user': 'hub_cap',
            'accountNumber': '323676',
            'loadbalancerid': '57363',
            'region': 'STAGING'
        };

        var loadBalancerDetails = {
            'loadBalancer': {
                'connectionLogging': {
                    'enabled': false
                },
                'connectionThrottle': {},
                'contentCaching': {
                    'enabled': false
                },
                'rateLimit': {}
            }
        };

        var scope, modalScope;
        var connectionThrottle = {};

        beforeEach(function () {
            scope = populateScope(validRouteParams);
            modalScope = {};
            httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57363/nodes/extended_view').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57363').respond(loadBalancerDetails);
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57363/connectionthrottle')
                .respond(connectionThrottle);
            httpBackend.flush();
        });

        describe('Connection Logging', function () {

            it('should get the connection logging details', function () {
                expect(scope.loadBalancer.connectionLogging).to.eql(
                                        loadBalancerDetails.loadBalancer.connectionLogging);
            });

        });

        describe('Content Caching', function () {

            it('should get the content caching details', function () {
                expect(scope.loadBalancer.contentCaching.enabled).to.equal(
                                        loadBalancerDetails.loadBalancer.contentCaching.enabled);
            });

        });

        describe('Temporary Rate Limit', function () {

            it('should get the temporary rate limit details', function () {
                expect(scope.loadBalancer.rateLimit).to.eql(loadBalancerDetails.loadBalancer.rateLimit);
            });

        });
    });

    describe('LoadBalancer Toggle Setting', function () {

        var scope, modalParam, conThrottle, hlthMonitor, contCaching, conLogging, rateLimit;

        before(function () {
            modalParam = {
                connectionThrottle: { settingName: 'connectionThrottle', isEdit: false },
                healthMonitor: { settingName: 'healthMonitor', isEdit: false },
                contentCaching: { settingName: 'contentCaching', isEdit: false },
                connectionLogging: { settingName: 'connectionLogging', isEdit: false },
                rateLimit: { settingName: 'rateLimit', isEdit: false }
            };
            conThrottle = toggleSwitchSettings.settingsParameters[0];
            hlthMonitor = toggleSwitchSettings.settingsParameters[1];
            contCaching = toggleSwitchSettings.settingsParameters[2];
            conLogging = toggleSwitchSettings.settingsParameters[3];
            rateLimit = toggleSwitchSettings.settingsParameters[4];
        });

        beforeEach(function () {
            scope = populateScope(validRouteParams);
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
            httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                .respond({});
            httpBackend.flush();
        });

        it('should set with connection throttle modal enable settings ', function () {
            scope.actions.hookModalSettings(modalParam.connectionThrottle);
            expect(scope.preHookMethod).to.equal(conThrottle.enable.preHook);
            expect(scope.postHookMethod).to.equal(conThrottle.enable.postHook);
            expect(scope.templateUrl).to.equal(conThrottle.enable.templateUrl);
        });

        it('should set with connection throttle modal disable settings ', function () {
            scope.actions.toggleStatus.connectionThrottle = true;
            scope.actions.hookModalSettings(modalParam.connectionThrottle);
            expect(scope.postHookMethod).to.equal(conThrottle.disable.postHook);
            expect(scope.templateUrl).to.equal(conThrottle.disable.templateUrl);
        });

        it('should set with health monitor modal enable settings ', function () {
            scope.actions.hookModalSettings(modalParam.healthMonitor);
            expect(scope.postHookMethod).to.equal(hlthMonitor.enable.postHook);
            expect(scope.templateUrl).to.equal(hlthMonitor.enable.templateUrl);
        });

        it('should set with health monitor modal disable settings ', function () {
            scope.actions.toggleStatus.healthMonitor = true;
            scope.actions.hookModalSettings(modalParam.healthMonitor);
            expect(scope.postHookMethod).to.equal(hlthMonitor.disable.postHook);
            expect(scope.templateUrl).to.equal(hlthMonitor.disable.templateUrl);
        });

        it('should set with content caching modal enable settings ', function () {
            scope.actions.hookModalSettings(modalParam.contentCaching);
            expect(scope.postHookMethod).to.equal(contCaching.enable.postHook);
            expect(scope.templateUrl).to.equal(contCaching.enable.templateUrl);
        });

        it('should set with content caching modal disable settings ', function () {
            scope.actions.toggleStatus.contentCaching = true;
            scope.actions.hookModalSettings(modalParam.contentCaching);
            expect(scope.postHookMethod).to.equal(contCaching.disable.postHook);
            expect(scope.templateUrl).to.equal(contCaching.disable.templateUrl);
        });

        it('should set with connection logging modal enable settings ', function () {
            scope.actions.hookModalSettings(modalParam.connectionLogging);
            expect(scope.postHookMethod).to.equal(conLogging.enable.postHook);
            expect(scope.templateUrl).to.equal(conLogging.enable.templateUrl);
        });

        it('should set with connection logging modal disable settings ', function () {
            scope.actions.toggleStatus.connectionLogging = true;
            scope.actions.hookModalSettings(modalParam.connectionLogging);
            expect(scope.postHookMethod).to.equal(conLogging.disable.postHook);
            expect(scope.templateUrl).to.equal(conLogging.disable.templateUrl);
        });

        it('should set with ratelimit modal disable settings ', function () {
            scope.actions.toggleStatus.rateLimit = true;
            scope.actions.hookModalSettings(modalParam.rateLimit);
            expect(scope.postHookMethod).to.equal(rateLimit.disable.postHook);
            expect(scope.templateUrl).to.equal(rateLimit.disable.templateUrl);
        });

    });

    describe('Health Monitoring', function () {

        var scope, modalScope;

        beforeEach(function () {
            scope = populateScope(validRouteParams);
            modalScope = {};
            httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                .respond({});
            httpBackend.flush();
        });

        describe('update health monitor', function () {

            describe('preHook function', function () {

                beforeEach(function () {
                    scope.actions.preUpdateHealthMonitor(modalScope);
                });

                it('should populates the type with healthmonitor data', function () {
                    expect(modalScope.fields.type).to.equal(scope.loadBalancer.healthMonitor.type);
                });

                it('should populates the delay with healthmonitor data', function () {
                    expect(modalScope.fields.delay).to.equal(scope.loadBalancer.healthMonitor.delay);
                });

                it('should populates the timeout with healthmonitor data', function () {
                    expect(modalScope.fields.timeout).to.equal(scope.loadBalancer.healthMonitor.timeout);
                });

                it('should populates the attemptsBeforeDeactivation with healthmonitor data', function () {
                    expect(modalScope.fields.attemptsBeforeDeactivation).to
                        .equal(scope.loadBalancer.healthMonitor.attemptsBeforeDeactivation);
                });

            });

            describe('postHook function', function () {

                var modalFields = {
                    type: 'CONNECT',
                    delay: '10',
                    timeout: '5',
                    attemptsBeforeDeactivation: '2'
                };

                it('should call LbaasSvc.updateHealthMonitor', function () {
                    scope.actions.postUpdateHealthMonitor(modalFields);
                    sinon.assert.called(lbaasSvc.updateHealthMonitor);
                });

            });
        });

        describe('disable health monitor', function () {

            describe('postHook function', function () {

                var modalFields = {
                    type: 'CONNECT',
                    delay: '10',
                    timeout: '5',
                    attemptsBeforeDeactivation: '2'
                };

                it('should call LbaasSvc.disableHealthMonitor', function () {
                    scope.actions.postDisableHealthMonitor(modalFields);
                    sinon.assert.called(lbaasSvc.disableHealthMonitor);
                });

            });

        });

    });

    describe('Name Change', function () {

        var scope, modalScope, connectionThrottle;

        beforeEach(function () {
            scope = populateScope(validRouteParams);
            modalScope = {};
            connectionThrottle = { 'connectionThrottle': loadBalancerDetails.loadBalancer.connectionThrottle };
            httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                .respond(connectionThrottle);
            httpBackend.flush();
        });

        describe('postHook function', function () {

            var modalFields = {
                name: 'test'
            };

            it('should call LbaasSvc.changeName', function () {
                scope.actions.postChangeName(modalFields);
                sinon.assert.called(lbaasSvc.changeName);
            });

        });

    });

    describe('Delete Lbaas', function () {

        var scope, modalScope;

        beforeEach(function () {
            scope = populateScope(validRouteParams);
            modalScope = {};
        });

        describe('postHook function', function () {

            it('should call LbaasSvc.delete', function () {
                scope.actions.postDeleteLoadBalancer();
                sinon.assert.called(lbaasSvc.delete);
            });

        });

    });

    describe('Virtual Ip ', function () {
        var scope;
        var fields = {
            vipType: {
                id: 1,
                name: 'PUBLIC'
            },
            ticketNumber: 1,
            reason: 'test comment'
        };
        var virtualIpResponse = {
            id: 4,
            address: '184.106.24.18',
            type: 'PUBLIC'
        };

        beforeEach(function () {
            scope = populateScope(validRouteParams);
            httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
            //To populate $scope.loadBalancer needs to call below
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                .respond(200);
            httpBackend.flush();
        });

        describe('add virtual Ip', function () {

            describe('postHook function', function () {

                beforeEach(function () {
                    var virtualIpToAdd = {
                        type: fields.vipType.name,
                        ticket: {
                            ticketId: fields.ticketNumber,
                            comment: fields.reason
                        }
                    };

                    httpBackend.expectPOST('/api/cloud/users/hub_cap/lbaas/STAGING/57361/admin_virtualips',
                                          virtualIpToAdd).respond(virtualIpResponse);
                    scope.actions.postAddVirtualIp(fields);
                    httpBackend.flush();
                });

                it('sets the status', function () {
                    sinon.assert.calledWith(status.setLoading, 'Adding Virtual IP ' + scope.loadBalancer.name);
                });

                it('virtual Ip length should be three', function () {
                    expect(scope.loadBalancer.virtualIps.length).to.equal(3);
                });

                it('virtual Ip new info should have same ip_address response', function () {
                    expect(_.findLast(scope.loadBalancer.virtualIps)['ip_address']).
                            to.equal(virtualIpResponse.address);
                });

                it('virtual Ip new info should have same id response', function () {
                    expect(_.findLast(scope.loadBalancer.virtualIps)['id']).
                            to.equal(virtualIpResponse.id);
                });

                it('virtual Ip new info should have same type response', function () {
                    expect(_.findLast(scope.loadBalancer.virtualIps)['ip_type']).
                            to.equal(virtualIpResponse.type);
                });
            });

        });

    });

    describe('syncLoadBalancer Response', function () {

        var scope;

        beforeEach(function () {
            scope = populateScope(validRouteParams);
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
            httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                .respond({});
            httpBackend.flush();
        });

        it('should call the put api for sync load balancer', function () {
            scope.syncLoadBalancer();
            httpBackend.expectPUT('/api/cloud/users/hub_cap/lbaas/STAGING/57361/sync').respond(200);
        });

        it('sets the status', function () {
            scope.syncLoadBalancer();
            sinon.assert.calledWith(status.setLoading, 'Syncing Load Balancer');
        });

    });

    describe('Delete IP from Access List', function () {
        var scope, spy;
        var accessObject = loadBalancerDetails.loadBalancer.accessList[1];
        var nonAccessElement = { id: 4379, address: '1.1.1.1', type: 'ALLOW' };
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').respond({});
            httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle').respond({});
            httpBackend.whenDELETE('/api/cloud/users/hub_cap/lbaas/STAGING/57361/accesslist/4378').respond({});
            httpBackend.whenDELETE('/api/cloud/users/hub_cap/lbaas/STAGING/57361/accesslist/4379').respond(400, {});
        });

        it('should successfully delete an IP from Access Control List', function () {
            scope.deleteAccessId(accessObject);
            httpBackend.flush();
            expect(scope.loadBalancer.accessList).to.have.length(2);
        });

        it('should fail to delete an IP from Access Control List', function () {
            scope.deleteAccessId(nonAccessElement);
            httpBackend.flush();
            expect(scope.loadBalancer.accessList).to.have.length(3);
        });

        it('should call rxPromiseNotifications', function () {
            spy = sinon.spy(rxPromise, 'add');
            scope.deleteAccessId(accessObject);
            httpBackend.flush();
            sinon.assert.calledOnce(spy);
        });
    });

    describe('Add Access Control Rule', function () {
        var scope;
        var accessListNodeTemplate = {
            address: '',
            type: 'DENY'
        };

        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        describe('add more link', function () {
            beforeEach(function () {
                scope.actions.preAddAccessRule();
                scope.actions.addToAccessListNodes();
            });

            it('should have a new empty object added to access list array', function () {
                expect(scope.accessListNodes.accessList.length).to.equal(2);
            });

            it('should match object added to access list array', function () {
                expect(scope.accessListNodes.accessList[1]).to.eql(accessListNodeTemplate);
            });
        });

        describe('remove item link', function () {
            beforeEach(function () {
                scope.actions.preAddAccessRule();
            });

            it('should remove a single object from access list array', function () {
                scope.actions.addToAccessListNodes();
                expect(scope.accessListNodes.accessList.length).to.equal(2);

                scope.actions.removeFromAccessListNodes();
                expect(scope.accessListNodes.accessList.length).to.equal(1);
            });
        });

        describe('submit button click', function () {
            var accessRuleToAdd = {
                address: '172.16.0.1',
                type: 'ALLOW'
            };

            // var lastNode = _.findLast(externalNodesResponse.nodes);
            beforeEach(function () {
                scope.loadBalancer = {
                    'id': '57361'
                };
                var nodes = { 'nodes': loadBalancerDetails.loadBalancer.nodes };
                httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
                httpBackend.whenPOST('/api/cloud/users/hub_cap/lbaas/STAGING/57361/accesslist').respond(200);
                httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').
                    respond(nodes);
                httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                    .respond(200);
                httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});

                scope.actions.preAddAccessRule();
                scope.accessListNodes.accessList = [accessRuleToAdd];
                scope.actions.postAddAccessRule();
                httpBackend.flush();
            });

            it('accesslist length should be four', function () {
                expect(scope.loadBalancer.accessList.length).to.equal(4);
            });

            it('newly added accesslist node info should have correct address', function () {
                expect(scope.loadBalancer.accessList[3].address).to.equal('172.16.0.1');
            });

            it('newly added accesslist node info should have correct type', function () {
                expect(scope.loadBalancer.accessList[3].type).to.equal('ALLOW');
            });
        });
    });

    describe('add external nodes', function () {
        var scope;
        var externalNodeTemplate = {
            address: '',
            port: '',
            condition: 'ENABLED'
        };

        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        describe('add more link', function () {

            beforeEach(function () {
                scope.actions.addToExternalNodeList();
            });

            it('should have the new empty object added to external nodes array', function () {
                expect(scope.externalNodes.items.length).to.equal(2);
            });

            it('should match the object added to external nodes array', function () {
                expect(scope.externalNodes.items[1]).to.eql(externalNodeTemplate);
            });
        });

        describe('remove item link', function () {
            it('should be removing single object from external nodes array', function () {
                scope.actions.addToExternalNodeList();
                expect(scope.externalNodes.items.length).to.equal(2);

                scope.actions.removeFromExternalNodeList();
                expect(scope.externalNodes.items.length).to.equal(1);
            });
        });

        describe('submit button click', function () {
            var externalNodeToAdd = {
                    address: '172.16.1.17',
                    port: '80',
                    condition: 'ENABLED'
                };

            var externalNodesResponse = {
                nodes: [
                    {
                        address: '172.16.1.17',
                        port: '80',
                        type: 'PRIMARY',
                        id: 111,
                        weight: 1,
                        status: 'ONLINE',
                        condition: 'ENABLED'
                    }
                ]
            };

            var lastNodeFromResponse = _.findLast(externalNodesResponse.nodes);

            beforeEach(function () {
                var nodes = { 'nodes': loadBalancerDetails.loadBalancer.nodes };
                httpBackend.whenGET('/api/cloud/users/hub_cap/service_catalog').respond({});
                httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes/extended_view').
                    respond(nodes);
                httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361').respond(loadBalancerDetails);
                httpBackend.whenGET('/api/cloud/users/hub_cap/lbaas/STAGING/57361/connectionthrottle')
                    .respond(200);
                httpBackend.flush();

                scope.externalNodes.items = [externalNodeToAdd];
                httpBackend.expectPOST('/api/cloud/users/hub_cap/lbaas/STAGING/57361/nodes').
                    respond(externalNodesResponse);
                scope.actions.postAddExternalNodes();
                httpBackend.flush();
            });

            it('sets the status', function () {
                sinon.assert.calledWith(status.setLoading, 'Adding External Nodes ' + scope.loadBalancer.name);
            });

            it('loadbalancer nodes length should be three', function () {
                expect(scope.loadBalancer.nodes.length).to.equal(3);
            });

            it('loadbalancer nodes info should have same address in response', function () {
                expect(_.findLast(scope.loadBalancer.nodes)['address']).
                        to.equal(lastNodeFromResponse.address);
            });

            it('loadbalancer nodes info should have same port in response', function () {
                expect(_.findLast(scope.loadBalancer.nodes)['port']).
                        to.equal(lastNodeFromResponse.port);
            });

            it('loadbalancer nodes info should have same type in response', function () {
                expect(_.findLast(scope.loadBalancer.nodes)['type']).
                        to.equal(lastNodeFromResponse.type);
            });

            it('loadbalancer nodes info should have same weight in response', function () {
                expect(_.findLast(scope.loadBalancer.nodes)['weight']).
                        to.equal(lastNodeFromResponse.weight);
            });

            it('loadbalancer nodes info should have same status in response', function () {
                expect(_.findLast(scope.loadBalancer.nodes)['status']).
                        to.equal(lastNodeFromResponse.status);
            });

            it('loadbalancer nodes info should have default condition set to enabled', function () {
                expect(_.findLast(scope.loadBalancer.nodes)['condition']).
                        to.equal(lastNodeFromResponse.condition);
            });
        });
    });
});
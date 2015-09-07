var lbaasDetailsPage = require('../../../pages/lbaas/details.page');
var tf = require('../../../pages/test-fixtures/ui');
var api = require('../../../api-helper/api').lbaas;

// #TODO Regression tests
describe('Load Balancers Details Page - Actions', function () {

    describe('Midway Tests', function () {

        before(function () {
            loginPage.loginLocalhost();
            lbaasDetailsPage.go('57361');
            basePage.disableRxNotifyTimeout();
        });

        describe('Move Host @dev', function () {
            var id = '57361';
            var successMessage = 'Load Balancer Host Moved Successfully.';

            before(function () {
                lbaasDetailsPage.go(id);
                lbaasDetailsPage.btnMoveHost.click();
            });

            it('should show success message on submit @dev', function () {
                lbaasDetailsPage.moveHostModal.host = 'ztm-n02.staging2.lbaas.rackspace.net';
                lbaasDetailsPage.moveHostModal.submit();
                expect(encore.rxNotify.all.exists(successMessage,
                                                 'success')).to.eventually.be.true;
            });
        });

        describe('Edit Load Balancer @dev', function () {
            var id = '57361';
            var successMessage = 'Load Balancer Updated Successfully.';
            before(function () {
                lbaasDetailsPage.go(id);
                lbaasDetailsPage.btnEditLoadBalancer.click();
            });

            it('should show Success message on submit @dev', function () {
                var params = {
                    name: 'Sample Test',
                    port: '500',
                    timeout: '40',
                    protocol: 'FTP',
                    algorithm: 'Round Robin'

                };
                lbaasDetailsPage.editLoadBalancerModal.filloutFields(params);
                lbaasDetailsPage.editLoadBalancerModal.submit();
                expect(encore.rxNotify.all.exists(successMessage,
                                                 'success')).to.eventually.be.true;
            });
        });

        describe('Unsuspend Load Balancer @dev', function () {
            before(function () {
                lbaasDetailsPage.go('57366');
                lbaasDetailsPage.btnUnSuspendLoadBalancer.click();
                basePage.disableRxNotifyTimeout();
            });

            it('should show confirmation message from the modal', function () {
                lbaasDetailsPage.unSuspendLoadBalancerModal.unSuspendBeginSubmit.click();
                lbaasDetailsPage.unSuspendLoadBalancerModal.unSuspendConfirmButton.click();

                expect(encore.rxNotify.all.exists('Unsuspending Load Balancer is complete for id:',
                                                 'success')).to.eventually.be.true;
            });
        });

        describe('Suspend Load Balancer @dev', function () {
            before(function () {
                lbaasDetailsPage.go('57361');
                lbaasDetailsPage.btnSuspendLoadBalancer.click();
                basePage.disableRxNotifyTimeout();
            });

            it('should show Success message on submit, with input to reason and ticketNumber field @dev', function () {
                lbaasDetailsPage.suspendLoadBalancerModal.ticketNumber = 1234;
                lbaasDetailsPage.suspendLoadBalancerModal.reason = 'Testing';
                lbaasDetailsPage.suspendLoadBalancerModal.submit();
                var successMessage = 'Load Balancer Suspended Successfully.';
                expect(encore.rxNotify.all.exists(successMessage,
                                                 'success')).to.eventually.be.true;
            });
        });

        describe('Add Cloud Servers @dev', function () {

            before(function () {
                lbaasDetailsPage.go('9009');
                basePage.disableRxNotifyTimeout();
            });

            beforeEach(function () {
                lbaasDetailsPage.btnAddCloudServers.click();
            });

            it('should show "no node selected" message on submit without selecting @dev', function () {
                var errorMsg = 'No Servers Added: No Nodes Selected';
                lbaasDetailsPage.addCloudServersModal.submit();
                expect(encore.rxNotify.all.exists(errorMsg, 'error')).to.eventually.be.true;
            });

            it('should show "Nodes Added Successfully." on submit with node selected @dev', function () {
                var servers = [
                    { name: 'Kevin\'s Test Demo' }
                ];
                lbaasDetailsPage.addCloudServersModal.selectServers(servers);
                var successMsg = 'Nodes Added Successfully.';
                lbaasDetailsPage.addCloudServersModal.submit();
                expect(encore.rxNotify.all.exists(successMsg, 'success')).to.eventually.be.true;

            });

            it('should show "Nodes Added Successfully." on submit with multiple nodes selected @dev', function () {
                var servers = [
                    { name: 'Kevin\'s Test Demo' },
                    { name: 'Leonel Bad Server' }
                ];
                lbaasDetailsPage.addCloudServersModal.selectServers(servers);
                var successMsg = 'Nodes Added Successfully.';
                lbaasDetailsPage.addCloudServersModal.submit();
                expect(encore.rxNotify.all.exists(successMsg, 'success')).to.eventually.be.true;
            });

            it('should show Success on submit after changing Weight with valid input @dev', function () {
                lbaasDetailsPage.addCloudServersModal.selectAll();
                var successMsg = 'Nodes Added Successfully.';

                lbaasDetailsPage.addCloudServersModal.setWeight(0, 100);
                lbaasDetailsPage.addCloudServersModal.submit();
                expect(encore.rxNotify.all.exists(successMsg, 'success')).to.eventually.be.true;
            });

            it('should show Success on submit after changing Port with valid input @dev', function () {
                lbaasDetailsPage.addCloudServersModal.selectAll();
                var successMsg = 'Nodes Added Successfully.';

                lbaasDetailsPage.addCloudServersModal.setPort(0, 65535);
                lbaasDetailsPage.addCloudServersModal.submit();
                expect(encore.rxNotify.all.exists(successMsg, 'success')).to.eventually.be.true;
            });

        });

        describe('Nodes Table', function () {
            before(function () {
                lbaasDetailsPage.go('57369');
                basePage.disableRxNotifyTimeout();
            });

            it('should be able to submit "Edit Node Configuration" Modal @dev', function () {
                var ipAddress = '10.182.78.55';
                var expectedSuccessMsg = 'Node updated successfully.';
                lbaasDetailsPage.nodesTable.openEditNode(ipAddress);
                lbaasDetailsPage.editNodeModal.weight = '20';
                lbaasDetailsPage.editNodeModal.condition = 'DRAINING';
                lbaasDetailsPage.editNodeModal.submit();
                expect(encore.rxNotify.all.exists(expectedSuccessMsg, 'success')).to.eventually.be.true;
            });

            it('should go to proper server details on click of Node name(firstGen) @dev', function () {
                var link = lbaasDetailsPage.nodesTable.tblNodeLinkHref(1);
                var url = '/cloud/323676/hub_cap/servers/firstgen/110148309';
                expect(link).to.eventually.contain(url);
            });

            it('should go to proper server details on click of Node name(nextGen) @dev', function () {
                var link = lbaasDetailsPage.nodesTable.tblNodeLinkHref(0);
                var url = '/cloud/323676/hub_cap/servers/ORD/9ae1032c-b39d-4eeb-b4f8-eb9b97a89d1f';
                expect(link).to.eventually.contain(url);
            });

        });

        describe('Remove Node @dev', function () {

            var ipAddress = '';
            before(function () {
                lbaasDetailsPage.go('57362');
                basePage.disableRxNotifyTimeout();
            });

            /*jshint multistr: true */
            var successMessage = 'Node is scheduled for removal and will no longer ' +
                                 'be visible in the node list once removal is complete.';

            it('should display success message on a request for remove node @dev', function () {
                ipAddress = '10.182.78.55';
                lbaasDetailsPage.nodesTable.linkRemoveNode(ipAddress);
                expect(encore.rxNotify.all.exists(successMessage, 'success')).to.eventually.be.true;

                ipAddress = '10.182.65.187';
                lbaasDetailsPage.nodesTable.linkRemoveNode(ipAddress);
                expect(encore.rxNotify.all.exists(successMessage, 'success')).to.eventually.be.true;
            });

        });

        describe('Error Page', function () {

            before(function () {
                lbaasDetailsPage.go('57361');
                basePage.disableRxNotifyTimeout();
            });
            beforeEach(function () {
                lbaasDetailsPage.btnErrorPage.click();
            });

            it('should delete the custom error content and show success message @dev', function () {
                lbaasDetailsPage.errorPageModal.submit();
                var expectedMsg = 'Error Page Updated to Default successfully';
                expect(encore.rxNotify.all.exists(expectedMsg, 'success')).to.eventually.be.true;
            });

            it('should update error page content on submit and show success message @dev', function () {
                lbaasDetailsPage.errorPageModal.errorType = 'Custom';

                lbaasDetailsPage.errorPageModal.textArea = '<html> </html>';
                lbaasDetailsPage.errorPageModal.submit();
                var expectedMsg = 'Error Page Updated to Custom successfully';
                expect(encore.rxNotify.all.exists(expectedMsg, 'success')).to.eventually.be.true;
            });

            it('should show error message when updating error page fails @dev', function () {
                lbaasDetailsPage.errorPageModal.errorType = 'Custom';

                lbaasDetailsPage.errorPageModal.textArea = 'Test With Bad Data';
                lbaasDetailsPage.errorPageModal.submit();
                var expectedMsg = 'Error in locating resource: Not Found';
                expect(encore.rxNotify.all.exists(expectedMsg, 'error')).to.eventually.be.true;
            });

        });

        describe('Add Connection Throttling', function () {

            beforeEach(function () {
                lbaasDetailsPage.go('9009');
                lbaasDetailsPage.settingsTable.connectionThrottleToggle.click();
                var lb = {
                    minConnections: 1000,
                    maxConnections: 100000,
                    maxConnectionRate: 100000,
                    rateInterval: 3600
                };
                lbaasDetailsPage.addConnectionThrottlingModal.filloutFields(lb);
            });

            it('should allow you to add the connection throttle @dev', function () {
                lbaasDetailsPage.addConnectionThrottlingModal.submit();
                expect(encore.rxNotify.all.exists('Connection Throttling successfully added for Load Balancer',
                                                  'success')).to.eventually.be.true;
            });

        });

        describe('Enable Session Persistence @dev', function () {
            before(function () {
                lbaasDetailsPage.go('9009');
                lbaasDetailsPage.settingsTable.sessionPersistenceToggle.click();
            });

            it('should be able to enable session persistence on a load balancer @dev', function () {
                lbaasDetailsPage.sessionPersistenceModal.submit();
                expect(encore.rxNotify.all.exists('Session Persistence Enabled Successfully.', 'success'))
                    .to.eventually.be.true;
            });
        });

        describe('Disable Session Persistence @dev', function () {
            before(function () {
                lbaasDetailsPage.go('57361');
                lbaasDetailsPage.settingsTable.sessionPersistenceToggle.click();
            });

            it('should be able to disable session persistence on a load balancer @dev', function () {
                lbaasDetailsPage.sessionPersistenceModal.submit();
                expect(encore.rxNotify.all.exists('Session Persistence Disabled Successfully.', 'success'))
                    .to.eventually.be.true;
            });
        });

        describe('Enable Content Caching @dev', function () {

            before(function () {
                lbaasDetailsPage.go('9009');
                lbaasDetailsPage.settingsTable.contentCachingToggle.click();
            });

            it('should be able to Enable Content Caching on a load balancer @dev', function () {
                lbaasDetailsPage.cachingModal.submit();
                expect(encore.rxNotify.all.exists('Content Caching enabled', 'success')).to.eventually.be.true;
            });
        });

        describe('Disable Content Caching @dev', function () {

            before(function () {
                lbaasDetailsPage.go('57361');
                lbaasDetailsPage.settingsTable.contentCachingToggle.click();
            });

            it('should be able to Disable Content Caching on a load balancer @dev', function () {
                lbaasDetailsPage.cachingModal.submit();
                expect(encore.rxNotify.all.exists('Content Caching disabled', 'success')).to.eventually.be.true;
            });
        });

        describe('Enable Connection Logging @dev', function () {

            before(function () {
                lbaasDetailsPage.go('57362');
                basePage.disableRxNotifyTimeout();
            });

            it('should be able to enable Connection Logs on a load balancer @dev', function () {
                // https://jira.rax.io/browse/DCXAPPS-1107
                lbaasDetailsPage.settingsTable.connectionLoggingToggle.click();
                lbaasDetailsPage.connLoggingModal.submit();

                expect(encore.rxNotify.all.exists('Logging enabled', 'success')).to.eventually.be.true;
            });
        });

        describe('Disable Connection Logging @dev', function () {

            before(function () {
                lbaasDetailsPage.go('57361');
                basePage.disableRxNotifyTimeout();
            });

            it('should be able to disable connection Logs on a load balancer @dev', function () {
                // https://jira.rax.io/browse/DCXAPPS-1107
                lbaasDetailsPage.settingsTable.connectionLoggingToggle.click();
                lbaasDetailsPage.connLoggingModal.submit();

                expect(encore.rxNotify.all.exists('Logging disabled', 'success')).to.eventually.be.true;
            });
        });

        describe('Disable SSL Termination @dev', function () {

            before(function () {
                lbaasDetailsPage.go('57361');
                lbaasDetailsPage.settingsTable.sslTerminationToggle.click();
            });

            it('should be able to disable ssl termination on a load balancer @dev', function () {
                var message = 'SSL Termination Disabled Successfully.';
                lbaasDetailsPage.sslTerminationModal.submit();
                expect(encore.rxNotify.all.exists(message, 'success')).to.eventually.be.true;
            });
        });

        describe('Enable SSL Termination @dev', function () {
            var fields = {};

            beforeEach(function () {
                lbaasDetailsPage.go('9009');
                lbaasDetailsPage.settingsTable.sslTerminationToggle.click();
                fields = {
                    allowedTraffic: 'Both secure and insecure traffic',
                    securedPort: 80,
                    certificate: 'test certificate',
                    privateKey: 'private key',
                    intermediateCertificate: 'test certificate',
                };
                lbaasDetailsPage.sslTerminationModal.filloutFields(fields);
            });

            it('should be able to enable ssl termination @dev', function () {
                var message = 'SSL Termination Updated Successfully.';
                lbaasDetailsPage.sslTerminationModal.submit();
                expect(encore.rxNotify.all.exists(message, 'success')).to.eventually.be.true;
            });

            it('should be able to enable ssl termination without intermediate certificate @dev', function () {
                lbaasDetailsPage.sslTerminationModal.txtIntermediateCertificate = '';
                var message = 'SSL Termination Updated Successfully.';
                lbaasDetailsPage.sslTerminationModal.submit();
                expect(encore.rxNotify.all.exists(message, 'success')).to.eventually.be.true;
            });
        });

        describe('Delete Load Balancer VIP @dev', function () {

            var vipIpAddress = '184.106.24.36';

            before(function () {
                lbaasDetailsPage.open('57361');
            });

            it('should be able to delete VIP with IP ' + vipIpAddress + ' @dev',  function () {
                var expectedSuccessMsg = 'Virtual IP "' + vipIpAddress + '" successfully deleted.';

                lbaasDetailsPage.ipsTable.openDeleteVip(vipIpAddress);
                lbaasDetailsPage.deleteVipModal.submit();
                expect(encore.rxNotify.all.exists(expectedSuccessMsg, 'success')).to.eventually.be.true;
            });
        });

        describe('Enable Connection Throttling @dev', function () {
            var lb;
            before(function () {
                lbaasDetailsPage.go('57362');

                lb = {
                    minConnections: 10,
                    maxConnections: 11,
                    maxConnectionRate: 12,
                    rateInterval: 13
                };
            });

            it('should display successful msg when Enable Connection Throttling on a load balancer @dev', function () {
                // https://jira.rax.io/browse/DCXAPPS-1109
                lbaasDetailsPage.settingsTable.connectionThrottleToggle.click();
                lbaasDetailsPage.addConnectionThrottlingModal.filloutFields(lb);
                lbaasDetailsPage.addConnectionThrottlingModal.submit();
                expect(encore.rxNotify.all.exists('Connection Throttling successfully added for Load Balancer',
                                                  'success')).to.eventually.be.true;
            });
        });

        describe('Disable Connection Throttling @dev', function () {
            before(function () {
                lbaasDetailsPage.go('57361');
                basePage.disableRxNotifyTimeout();
            });

            it('should be able to Disable Connection Throttling on a load balancer @dev', function () {
                lbaasDetailsPage.settingsTable.connectionThrottleToggle.click();
                lbaasDetailsPage.connThrottlingModal.submit();
                expect(encore.rxNotify.all.exists('Disabled Connection Throttle', 'success')).to.eventually.be.true;
            });
        });

        describe('Enable Health Monitoring @dev', function () {

            var lb = {};
            beforeEach(function () {
                lb.type = 'CONNECT';
                lb.delay = 12;
                lb.timeout = 20;
                lb.attempts = 22;
                lbaasDetailsPage.go('57362');
                lbaasDetailsPage.settingsTable.healthMonitoringToggle.click();
                basePage.disableRxNotifyTimeout();
            });

            it('should be able to Enable Health Monitoring for connect type on a load balancer @dev', function () {
                lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                lbaasDetailsPage.healthMonitoringModal.submit();
                expect(encore.rxNotify.all.exists('Health monitoring updated.', 'success')).to.eventually.be.true;
            });

            it('should be able to Enable Health Monitoring fot http type on a load balancer @dev', function () {
                lb.type = 'HTTP';
                lb.path = '/abcd';
                lb.statusRegex = '^[1-9]';
                lb.bodyRegex = '^[1-9]';
                lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                lbaasDetailsPage.healthMonitoringModal.submit();
                expect(encore.rxNotify.all.exists('Health monitoring updated.', 'success')).to.eventually.be.true;
            });
        });

        describe('Disable Health Monitoring @dev', function () {

            before(function () {
                lbaasDetailsPage.go('57361');
                lbaasDetailsPage.settingsTable.healthMonitoringToggle.click();
                basePage.disableRxNotifyTimeout();
            });

            it('should be able to Disable Health Monitoring from a load balancer @dev', function () {
                lbaasDetailsPage.healthMonitoringModal.submit();
                expect(encore.rxNotify.all.exists('Health monitoring disabled.', 'success')).to.eventually.be.true;
            });
        });

        describe('Edit Health Monitoring @dev', function () {
            var lb = {};
            beforeEach(function () {
                lb.type = 'CONNECT';
                lb.delay = 12;
                lb.timeout = 20;
                lb.attempts = 22;
                lbaasDetailsPage.go('57361');
                lbaasDetailsPage.settingsTable.healthMonitoringEdit.click();
                basePage.disableRxNotifyTimeout();
            });

            it('should be able to update Health Monitoring for connect type on a load balancer @dev', function () {
                lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                lbaasDetailsPage.healthMonitoringModal.submit();
                expect(encore.rxNotify.all.exists('Health monitoring updated.', 'success')).to.eventually.be.true;
            });

            it('should be able to update Health Monitoring for http type on a load balancer @dev', function () {
                lb.type = 'HTTP';
                lb.path = '/abcd';
                lb.statusRegex = '^[1-9]';
                lb.bodyRegex = '^[1-9]';
                lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                lbaasDetailsPage.healthMonitoringModal.submit();
                expect(encore.rxNotify.all.exists('Health monitoring updated.', 'success')).to.eventually.be.true;
            });

        });

        describe('Delete load balancer @dev', function () {
            before(function () {
                lbaasDetailsPage.go('57361');
                basePage.disableRxNotifyTimeout();
            });

            it('should delete test_load_balancer @dev',  function () {
                var expectedMsg = 'Load Balancer "test_load_balancer" delete successfully initiated. ' +
                    'It will take a few moments to complete.';

                lbaasDetailsPage.btnDeleteLoadBalancer.click();
                lbaasDetailsPage.deleteModal.submit();

                expect(encore.rxNotify.all.exists(expectedMsg, 'success')).to.eventually.be.true;
            });

            describe('Delete load balancer fails @dev', function () {

                before(function () {
                    lbaasDetailsPage.go('12345');
                });

                it('should fail to delete zzz_bad_load_balancer @dev', function () {
                    var expectedMsg = 'Error deleting Load Balancer';

                    lbaasDetailsPage.btnDeleteLoadBalancer.click();
                    lbaasDetailsPage.deleteModal.submit();

                    expect(encore.rxNotify.all.exists(expectedMsg, 'error')).to.eventually.be.true;
                });
            });
        });

        describe('Add Temporary Rate Limit @dev', function () {

            before(function () {
                lbaasDetailsPage.go('57001');
                basePage.disableRxNotifyTimeout();
            });

            it('should allow you to submit the add temporary rate limit @dev', function () {
                lbaasDetailsPage.settingsTable.btnAddTemporaryRateLimit.click();
                var lb = {
                    maxRequestsPerSecond: 4,
                    expirationTime: '2016-07-07 17:30:00',
                    ticketId: 1234,
                    comment: 'things'
                };
                lbaasDetailsPage.addTemporaryRateLimitModal.filloutFields(lb);
                lbaasDetailsPage.addTemporaryRateLimitModal.submit();
                expect(encore.rxNotify.all.exists('Temporary Rate Limit successfully added Load Balancer',
                                                 'success')).to.eventually.be.true;
            });

        });

        describe('Update Temporary Rate Limit @dev', function () {

            before(function () {
                lbaasDetailsPage.go('57000');
                basePage.disableRxNotifyTimeout();
            });

            it('should allow you to submit the update temporary rate limit @dev', function () {
                lbaasDetailsPage.settingsTable.btnUpdateTemporaryRateLimit.click();
                var lb = {
                    maxRequestsPerSecond: 4,
                    expirationTime: '2016-07-07 17:30:00'
                };
                lbaasDetailsPage.addTemporaryRateLimitModal.filloutFields(lb);
                lbaasDetailsPage.addTemporaryRateLimitModal.submit();
                expect(encore.rxNotify.all.exists('Temporary Rate Limit successfully updated Load Balancer',
                                                 'success')).to.eventually.be.true;
            });

        });

        describe('Sync Load Balancer @dev', function () {

            it('should display error message on a bad request for sync load balancer @dev', function () {
                var msg = 'Error Syncing Load Balancer';
                lbaasDetailsPage.go('57362');
                basePage.disableRxNotifyTimeout();
                lbaasDetailsPage.btnSyncLoadBalancer.click();
                expect(encore.rxNotify.all.exists(msg, 'error')).to.eventually.be.true;
            });

            it('should display success message on a request for sync load balancer @dev', function () {
                var msg = 'Syncing is complete for Load Balancer';
                lbaasDetailsPage.go('57361');
                basePage.disableRxNotifyTimeout();
                lbaasDetailsPage.btnSyncLoadBalancer.click();
                expect(encore.rxNotify.all.exists(msg, 'success')).to.eventually.be.true;
            });

        });

        describe('Add Virtual Ip @dev', function () {
            var lb, virtualIp;

            before(function () {
                lbaasDetailsPage.go('57361');
                basePage.disableRxNotifyTimeout();

                lb = {
                    vipType: 'PUBLIC',
                    ticketNumber: 123,
                    reason: 'test reason'
                };

                lbaasDetailsPage.btnAddVirtualIp.click();
                lbaasDetailsPage.addVirtualIpModal.filloutFields(lb);
                lbaasDetailsPage.addVirtualIpModal.submit();
                lbaasDetailsPage.ipsTable.data().then(function (data) {
                    virtualIp = data;
                });
            });

            it('should allow you to add virtual ip @dev', function () {
                expect(encore.rxNotify.all.exists('Virtual IP successfully added for Load Balancer',
                                                  'success')).to.eventually.be.true;
            });

            it('should match the newly added virtual ip in virtual ip table @dev', function () {
                expect(virtualIp[4]).to.have.property('IP Address', '184.106.24.18');
                expect(virtualIp[4]).to.have.property('Type', 'PUBLIC');
            });

            it('should match the number of rows within virtual ip table @dev', function () {
                expect(virtualIp.length).to.equal(5);
            });
        });

        describe('Add External Nodes @dev', function () {
            var lb;

            describe('for single row @dev', function () {
                before(function () {
                    lbaasDetailsPage.go('57361');
                    basePage.disableRxNotifyTimeout();

                    lb = [{
                        externalNodeAddress: '10.182.86.18',
                        externalNodePort: '80'
                    }];

                    lbaasDetailsPage.btnAddExternalNodes.click();
                    lbaasDetailsPage.addExternalNodes.filloutFields(lb);
                    lbaasDetailsPage.addExternalNodes.submit();
                });

                it('should allow to add external node @dev', function () {
                    expect(encore.rxNotify.all.exists('External nodes added successfully',
                                                      'success')).to.eventually.be.true;
                });

                it('should match the newly added node in nodes table @dev', function () {
                    lbaasDetailsPage.nodesTable.data().then(function (nodeTableRow) {
                        expect(nodeTableRow[2]['IP Address']).to.equal(lb[0].externalNodeAddress);
                        expect(nodeTableRow[2]['Port']).to.equal(lb[0].externalNodePort);
                        expect(nodeTableRow[2]['Condition']).to.equal('ENABLED');
                        expect(nodeTableRow[2]['Weight']).to.equal('1');
                    });
                });

                it('should match the number of rows within nodes table @dev', function () {
                    lbaasDetailsPage.nodesTable.data().then(function (nodeTableRow) {
                        expect(nodeTableRow.length).to.equal(3);
                    });
                });
            });

            describe('for multiple row @dev', function () {
                before(function () {
                    lbaasDetailsPage.go('57362');
                    basePage.disableRxNotifyTimeout();

                    lb.push({
                        externalNodeAddress: '2001:2011:79f1:1212:07b4:0a0b:0000:0002',
                        externalNodePort: '88'
                    });

                    lbaasDetailsPage.btnAddExternalNodes.click();
                    lbaasDetailsPage.addExternalNodes.btnAddMoreNode.click();
                    lbaasDetailsPage.addExternalNodes.filloutFields(lb);
                    lbaasDetailsPage.addExternalNodes.submit();
                });

                it('should match the newly added nodes in nodes table @dev', function () {
                    lbaasDetailsPage.nodesTable.data().then(function (nodeTableRow) {
                        expect(nodeTableRow[2]['IP Address']).to.equal(lb[0].externalNodeAddress);
                        expect(nodeTableRow[2]['Port']).to.equal(lb[0].externalNodePort);
                        expect(nodeTableRow[2]['Condition']).to.equal('ENABLED');
                        expect(nodeTableRow[2]['Weight']).to.equal('1');

                        expect(nodeTableRow[3]['IP Address']).to.equal(lb[1].externalNodeAddress);
                        expect(nodeTableRow[3]['Port']).to.equal(lb[1].externalNodePort);
                        expect(nodeTableRow[3]['Condition']).to.equal('ENABLED');
                        expect(nodeTableRow[3]['Weight']).to.equal('1');
                    });
                });
            });
        });

        describe('Add AccessList Rule @dev', function () {
            var lbRules;

            describe('for single rule @dev', function () {
                before(function () {
                    lbaasDetailsPage.go('57361');
                    basePage.disableRxNotifyTimeout();

                    lbRules = [{
                        address: '10.182.86.18'
                    }];

                    lbaasDetailsPage.btnAddAccessControlRule.click();
                    lbaasDetailsPage.addAccessControlRule.filloutFields(0, lbRules[0].address);
                    lbaasDetailsPage.addAccessControlRule.submit();
                });

                it('should allow to add a single Access Rule @dev', function () {
                    expect(encore.rxNotify.all.exists('Access Control: Access List Upload Successful',
                        'success')).to.eventually.be.true;
                });

                it('should match the newly added rule in Access List table @dev', function () {
                    lbaasDetailsPage.accessTable.data().then(function (accessRulesList) {
                        expect(accessRulesList[2]['IP Address']).to.equal(lbRules[0].address);
                    });
                });

                it('should match the number of rules within Access List table @dev', function () {
                    lbaasDetailsPage.accessTable.data().then(function (accesRuleList) {
                        expect(accesRuleList.length).to.equal(3);
                    });
                });
            });

            describe('for multiple rules @dev', function () {
                before(function () {
                    lbaasDetailsPage.go('57361');
                    basePage.disableRxNotifyTimeout();

                    lbRules.push({
                            address: '10.182.86.18/22'
                        }, {
                            address: '2001:2011:79f1:1212:07b4:0a0b:0000:0002'
                        }, {
                            address: '2001:2011:79f1:1212:07b4:0a0b:0000:0002/127'
                        });

                    lbaasDetailsPage.btnAddAccessControlRule.click();
                    lbaasDetailsPage.addAccessControlRule.filloutFields(0, lbRules[0].address);
                    lbaasDetailsPage.addAccessControlRule.btnAddMoreNode.click();
                    lbaasDetailsPage.addAccessControlRule.filloutFields(1, lbRules[1].address);
                    lbaasDetailsPage.addAccessControlRule.btnAddMoreNode.click();
                    lbaasDetailsPage.addAccessControlRule.filloutFields(2, lbRules[2].address);
                    lbaasDetailsPage.addAccessControlRule.btnAddMoreNode.click();
                    lbaasDetailsPage.addAccessControlRule.filloutFields(3, lbRules[3].address);
                    lbaasDetailsPage.addAccessControlRule.submit();
                });

                it('should allow to add multiple Access Rules @dev', function () {
                    expect(encore.rxNotify.all.exists('Access Control: Access List Upload Successful',
                        'success')).to.eventually.be.true;
                });

                it('should match the newly added rule in Access List table @dev', function () {
                    lbaasDetailsPage.accessTable.data().then(function (accessRulesList) {
                        expect(accessRulesList[2]['IP Address']).to.equal(lbRules[0].address);
                        expect(accessRulesList[3]['IP Address']).to.equal(lbRules[1].address);
                        expect(accessRulesList[4]['IP Address']).to.equal(lbRules[2].address);
                        expect(accessRulesList[5]['IP Address']).to.equal(lbRules[3].address);
                    });
                });

                it('should match the number of rules within Access List table @dev', function () {
                    lbaasDetailsPage.accessTable.data().then(function (accesRuleList) {
                        expect(accesRuleList.length).to.equal(6);
                    });
                });
            });
        });

        describe('View Historical Usage @dev', function () {
            before(function () {
                    lbaasDetailsPage.go('57361');
                    basePage.disableRxNotifyTimeout();
                });

            it('should redirect to view historical usage page @dev', function () {
                lbaasDetailsPage.btnViewHistoricalUsage.click();
                expect(encore.rxNotify.all.exists('Retrieving Historical Usage is complete for Load Balancer',
                                                 'success')).to.eventually.be.true;
            });
        });
    });

    describe('Regression Tests', function () {

        describe('Regression - Change Name #regression', function () {

            var originalName = tf.lbChangeName.name;
            var changedName = tf.lbChangeNameSuccess.name;

            before(function () {
                lbaasDetailsPage.open(originalName);
            });

            it('should allow you to change the load balancers name #regression', function () {
                lbaasDetailsPage.btnChangeName.click();
                lbaasDetailsPage.changeNameModal.changeName(changedName);

                // These messages are not reliable because of LBaaS loading issues
                // expect(encore.rxNotify.all.exists('Name changed.', 'success')).to.eventually.be.true;

                lbaasDetailsPage.detailsTable.data().then(function (details) {
                    expect(_.isEqual(details['Name'], changedName));
                });

            });
        });

        describe('Regression - Enable Logging #regression', function () {

            before(function () {
                api.setConnectionLogging(tf.lbLogging.name, false);
                lbaasDetailsPage.open(tf.lbLogging.name);
            });

            it('should show the connection logs as Disabled #regression', function () {
                lbaasDetailsPage.detailsTable.data().then(function (details) {
                    expect(details['Connection Logs']).to.contain('Disabled');
                });
            });

            it('should show a link to enable logging #regression', function () {
                lbaasDetailsPage.detailsTable.data().then(function (details) {
                    expect(details['Connection Logs']).to.contain('(Enable Logging)');
                });
            });

        });

        describe('Regression - Disable Logging #regression', function () {
            before(function () {
                api.setConnectionLogging(tf.lbLogging.name, true);
                lbaasDetailsPage.open(tf.lbLogging.name);
            });

            it('should show the connection logs as Enabled #regression', function () {
                lbaasDetailsPage.detailsTable.data().then(function (details) {
                    expect(details['Connection Logs']).to.contain('Enabled');
                });
            });

            it('should show a link to disable logging #regression', function () {
                lbaasDetailsPage.detailsTable.data().then(function (details) {
                    expect(details['Connection Logs']).to.contain('(Disable Logging)');
                });
            });

            it('should be able to Disable Connection Logs on a load balancer #regression', function () {
                lbaasDetailsPage.btnDisableLogging.click();
                lbaasDetailsPage.connLoggingModal.submit();

                // These messages are not reliable because of LBaaS loading issues
                // expect(encore.rxNotify.all.exists('Logging disabled', 'success')).to.eventually.be.true;
                lbaasDetailsPage.detailsTable.data().then(function (details) {
                    expect(details['Connection Logs']).to.contain('Disabled');
                });
            });
        });

        describe('Regression - Enable Connection Throttling #regression', function () {

            before(function () {
                api.setConnectionThrottling(tf.lbThrottling.name, false);
                lbaasDetailsPage.open(tf.lbThrottling.name);
            });

            it('should be able to Enable Connection Throttling on a load balancer #regression', function () {

            });
        });

        describe('Regression - Disable Connection Throttling #regression', function () {

            before(function () {
                api.setConnectionThrottling(tf.lbThrottling.name, true);
                lbaasDetailsPage.open(tf.lbThrottling.name);
            });

            it('should be able to Disable Connection Throttling on a load balancer #regression', function () {

            });
        });

        describe('Regression - Update Connection Throttling #regression', function () {
            before(function () {
                api.setConnectionThrottling(tf.lbThrottling.name, true);
                lbaasDetailsPage.open(tf.lbThrottling.name);
            });

            it('should show a link to update connection throttling #regression', function () {

            });

            it('should be able to Change Connection Throttling on a load balancer #regression', function () {

            });
        });

        describe('Regression - Enable Health Monitoring #regression', function () {
            // https://jira.rax.io/browse/DCXAPPS-1112
            var lb = {};
            before(function () {
                lbaasDetailsPage.btnEnableHealthMonitoring.click();
                api.setHealthMonitoring(tf.lbHealthMonitoring.name, false);
                lbaasDetailsPage.open(tf.lbHealthMonitoring.name);
            });

            beforeEach(function () {
                lb = {
                    type: 'CONNECT',
                    delay: 12,
                    timeout: 20,
                    attemptsBeforeDeactivation: 25
                };
                lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
            });

            it('should show health monitoring as Disabled #regression', function () {
                lbaasDetailsPage.detailsTable.data().then(function (details) {
                    expect(details['Health Monitoring']).to.contain('Disabled');
                });
            });

            it('should show a link to enable health monitoring #regression', function () {
                lbaasDetailsPage.detailsTable.data().then(function (details) {
                    expect(details['Health Monitoring']).to.contain('(Enable Health Monitoring)');
                });
            });

            it('should be able to Enable Health Monitoring on a load balancer #regression', function () {
                lb.type = 'CONNECT';
                lb.delay = 20;
                lb.timeout = 10;
                lb.attemptsBeforeDeactivation = 12;
                lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                expect(lbaasDetailsPage.healthMonitoringModal.canSubmit()).to.eventually.be.true;
            });
        });

        describe('Regression - Disable Health Monitoring #regression', function () {

            before(function () {
                api.setHealthMonitoring(tf.lbHealthMonitoring.name, true);
                lbaasDetailsPage.open(tf.lbHealthMonitoring.name);
            });

            it('should show health monitoring as Enabled #regression', function () {
                lbaasDetailsPage.detailsTable.data().then(function (details) {
                    expect(details['Health Monitoring']).to.contain('Type: HTTP');
                });
            });

            it('should show a link to disable health monitoring #regression', function () {
                lbaasDetailsPage.detailsTable.data().then(function (details) {
                    expect(details['Health Monitoring']).to.contain('(Disable Health Monitoring)');
                });
            });

            it('should be able to Disable Health Monitoring from a load balancer #regression', function () {
                lbaasDetailsPage.btnDisableHealthMonitoring.click();
                lbaasDetailsPage.healthMonitoringModal.submit();

                // These messages are not reliable because of LBaaS loading issues
                // expect(encore.rxNotify.all.exists('Health monitoring disabled.', 'success')).to.eventually.be.true;
                lbaasDetailsPage.detailsTable.data().then(function (details) {
                    expect(details['Health Monitoring']).to.contain('(Enable Health Monitoring)');
                });
            });
        });

        describe('Regression - Delete load balancer #regression', function () {

            before(function () {
                lbaasDetailsPage.open(tf.lbDeleteDetails.name);
            });

            it('should delete loadBalancerDeleteDetails #regression',  function () {
                var expectedMsg = 'Load Balancer "' + tf.lbDeleteDetails.name +
                    '" delete successfully initiated. ' +
                    'It will take a few moments to complete.';

                lbaasDetailsPage.btnDeleteLoadBalancer.click();
                lbaasDetailsPage.deleteModal.submit();

                expect(encore.rxNotify.all.exists(expectedMsg, 'success')).to.eventually.be.true;
            });
        });
    });

    describe('Pending Tests', function () {
        it('should move a load balancer to a different Host');

        it('should Edit Node Condition on a load balancer');

        it('should Remove Node from a load balancer');

        it('should Remove a Connection Throttle of a load balancer');

        it('should display Load Balancer Access table');

        it('should add a Temporary Rate Limit to a load balancer');

        it('should add a Connection Throttle to a load balancer');

        it('should add an Allow Access Control by entering one IP ');

        it('should add an Allow Access Control by entering multiple IPs ');

        it('should add an Allow Access Control by entering a network ');

        it('should add an Allow Access Control by entering multiple networks ');

        it('should add an Allow Access Control by entering a mix of IPs and networks ');

        it('should add a Deny Access Control by entering one IP ');

        it('should add a Deny Access Control by entering multiple IPs ');

        it('should add a Deny Access Control by entering a network ');

        it('should Configure Connection Throttle on a load balancer');

        it('should successfully Add a VIP to a load balancer');

        describe('Add Additional VIP modal', function () {

            it('should not click \'Add VIP\' button if the Ticket number is missing');

            it('should not click \'Add VIP\' button if the Reason field is blank');

        });

        describe('Suspend Load Balancer modal', function () {

            it('should not click \'Suspend Load Balancer\' if the Ticket number is missing');

            it('should not click \'Suspend Load Balancer\' if the Reason field is blank');

        });

        it('should be able to Add Sticky Flag');

        it('should be able to Remove Sticky Flag');

        it('should be able to Sync a load balancer');

        it('should be able to Suspend a load balancer');

        it('should be able to Unsuspend a load balancer');

        it('should be able to Enable Session Persistence on a load balancer (Port 80 Only)');

        it('should be able to Disable Session Persistence on a load balancer(Port 80 Only)');

        it('should be able to Configure Health Monitor on a load balancer');

        it('should Add a Deny Access Control by entering multiple networks ');

        it('should Add a Deny Access Control by entering a mix of IPs and networks ');

        it('should Remove an Allow Access Control ');

        it('should Remove a Deny Access Control ');

        it('should correctly display the Load Balancer Usage section');

        it('should Search for data in the Historical Usage table on the Load Balancer Usage section');

        it('should Sort all columns on the Historical Usage table on the Load Balancer Usage section');

        it('should Change the date range of History on the Historical Usage table on the Load Balancer Usage section');

        it('should add one IPv4 node');

        it('should add one IPv6 node');

        it('should add multiple IPv4 nodes');

        it('should add multiple IPv6 nodes');

        it('should add one IPv4 node and one IPv6 node');

        it('should add multiple IPv4 nodes and multiple IPv6 nodes');

        it('should add a node with a custom port');

        it('should add one external IPv4 node');

        it('should add one external IPv6 node');

        it('should add multiple external IPv4 nodes');

        it('should add multiple external IPv6 nodes');

        it('should add one external IPv4 node and one external IPv6 node');

        it('should add multiple external IPv4 nodes and multiple external IPv6 nodes');

        it('should add an external node with a custom port');

        it('should add internal nodes and external nodes');

        it('should change the Algorithm of a load balancer');

        it('should change the Protocol of a load balancer');

        it('should change the Port of a load balancer');

        it('should change the Protocol and Port of a load balancer');

        it('should change the Timeout of a load balancer');

        it('should Toggle Content Caching of a load balancer');

        it('should Select All nodes in the Nodes section');

        it('should Unselect All nodes in the Nodes section');

        it('should Add Node to a load balancer in the Nodes section');

        it('should Remove Selected Nodes in the Nodes section');

        it('should display error if user attempts to remove all the nodes in the Nodes section');

        it('should Link to a First Gen Server in the Nodes section');

        it('should Link to a Next Gen Server in the Nodes section');

        describe('should display an error message if a user', function () {

            it('moves a load balancer to a different Host and Sticky Flag is already set');

            it('Adds Temporary Rate Limit where the Max Connection field is blank or invalid');

            it('Adds Temporary Rate Limit where the Expiration Time field is blank or invalid');

            it('Adds Temporary Rate Limit where the Ticket Number field is blank or invalid');

            it('Adds Temporary Rate Limit where the Reason field is blank or invalid');

            it('Adds Connection Throttle where the Min Connections field is blank or invalid');

            it('Adds Connection Throttle where the Max Connections field is blank or invalid');

            it('Adds Connection Throttle where the Max Connection Rate field is blank or invalid');

            it('Adds Connection Throttle where the Rate Interval field is blank or invalid');

            it('attempts to configure a Health Monitor on a load balancer where the Delay field is blank or invalid');

            it('attempts to configure a Health Monitor on a load balancer where the Timeout field is blank or invalid');

            it('attempts to configure a Health Monitor on a load balancer where the Attempts field is blank');

            it('attempts to configure a Health Monitor on a load balancer where the Path field is blank or invalid');

            it('attempts to add a Health Monitor to a load balancer where the Delay field is blank or invalid');

            it('attempts to add a Health Monitor to a load balancer where the Timeout field is blank or invalid');

            it('attempts to add a Health Monitor to a load balancer where the Attempts field is blank or invalid');

            it('attempts to add a Health Monitor to a load balancer where the Path field is blank or invalid');

            it('attempts to add a Health Monitor to a load balancer where the Status Regex field is blank or invalid');

            it('Configures Connection Throttle where the Min Connections field is blank or invalid');

            it('Configures Connection Throttle where the Max Connections field is blank or invalid');

            it('Configures Connection Throttle where the Max Connection Rate field is blank or invalid');

            it('Configures Connection Throttle where the Rate Interval field is blank or invalid');

            it('if user Adds Access Control where the IP address is missing ');

            it('Adds Access Control where an invalid IP address is entered ');

            it('Adds Access Control where a duplicate IP address is entered ');

            it('Adds Access Control where the access control Already exists ');

            it('attempts to click "Add Node" and no node is selected');

            it('adds an External Node where the IP Address is not entered');

            it('adds an External Node where the IP Address is invalid');

            it('adds a duplicate External Node');
        });
    });
});

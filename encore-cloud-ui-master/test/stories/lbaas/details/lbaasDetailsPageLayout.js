var lbaasDetailsPage = require('../../../pages/lbaas/details.page');
var commonTests = require('../../common');
var tf = require('../../../pages/test-fixtures/api');

describe('Load Balancers Details Page - Page Layout', function () {
    var timePattern = /Nov \d{1,2}, 2013 @ \d{1,2}:\d{2} \(UTC[-+]\d{4}\)/;
    var lbName = tf.lbaasDetails.name;

    before(function () {
        if (basePage.isInMidwayEnvironment()) {
            lbaasDetailsPage.go('57361');
        } else {
            lbaasDetailsPage.open(lbName);
        }
    });

    var expected = {
        title: 'Load Balancer:',
        breadcrumbs: ['Home', 'User hub_cap', 'Load Balancers', 'Load Balancer Details'],
        display: {
            'Account Info Banner': basePage.accountInfoBanner
        }
    };

    commonTests(expected);

    describe('Midway Tests', function () {

        it('should have "Edit Load Balancer Details" action @dev', function () {
            expect(lbaasDetailsPage.btnEditLoadBalancer.isDisplayed()).to.eventually.be.true;
        });

        describe('Move Host @dev', function () {
            var title = 'Move Host';
            var id = '57361';

            before(function () {
                lbaasDetailsPage.go(id);
            });

            after(function () {
                lbaasDetailsPage.moveHostModal.cancel();
            });

            it('should show the Move Host modal @dev', function () {
                lbaasDetailsPage.btnMoveHost.click();
                expect(lbaasDetailsPage.moveHostModal.isDisplayed()).to.eventually.be.true;
            });

            it('should display modal title @dev', function () {
                expect(lbaasDetailsPage.moveHostModal.title).to.eventually
                    .equal(title);
            });

            it('should display modal sub title @dev', function () {
                expect(lbaasDetailsPage.moveHostModal.subtitle).to.eventually
                    .equal(id);
            });

            it('should have the submit button enabled', function () {
                expect(lbaasDetailsPage.moveHostModal.canSubmit()).to.eventually.be.true;
            });

            it('should have default selected in select box', function () {
                expect(lbaasDetailsPage.moveHostModal.host).to.eventually
                    .equal('ztm-n02.staging1.lbaas.rackspace.net');
            });

            it('should be able to select other value in select box', function () {
                lbaasDetailsPage.moveHostModal.host = 'ztm-n02.staging2.lbaas.rackspace.net';
                expect(lbaasDetailsPage.moveHostModal.host).to.eventually
                    .equal('ztm-n02.staging2.lbaas.rackspace.net');
            });

        });

        describe('Edit Load Balancer @dev', function () {
            var title = 'Edit Load Balancer Details';
            var id = '57361';

            before(function () {
                lbaasDetailsPage.go(id);
                lbaasDetailsPage.btnEditLoadBalancer.click();
            });

            after(function () {
                lbaasDetailsPage.editLoadBalancerModal.cancel();
            });

            it('should show the Edit Load Balancer Details modal @dev', function () {
                expect(lbaasDetailsPage.editLoadBalancerModal.isDisplayed()).to.eventually.be.true;
            });

            it('should display modal title @dev', function () {
                expect(lbaasDetailsPage.editLoadBalancerModal.title).to.eventually
                    .equal(title);
            });

            it('should display modal sub title @dev', function () {
                expect(lbaasDetailsPage.editLoadBalancerModal.subtitle).to.eventually
                    .equal(id);
            });

            it('should have all inputs enabled @dev', function () {
                expect(lbaasDetailsPage.editLoadBalancerModal.protocol.isEnabled()).to.eventually.be.true;
                expect(lbaasDetailsPage.editLoadBalancerModal.algorithm.isEnabled()).to.eventually.be.true;
                expect(lbaasDetailsPage.editLoadBalancerModal.name.isEnabled()).to.eventually.be.true;
                expect(lbaasDetailsPage.editLoadBalancerModal.port.isEnabled()).to.eventually.be.true;
                expect(lbaasDetailsPage.editLoadBalancerModal.timeout.isEnabled()).to.eventually.be.true;
            });

            it('should change port value on change of protocol @dev', function () {
                expect(lbaasDetailsPage.editLoadBalancerModal.port).to.eventually.equal('80');
                lbaasDetailsPage.editLoadBalancerModal.protocol = 'LDAP';
                expect(lbaasDetailsPage.editLoadBalancerModal.port).to.eventually.equal('389');
            });

            it('should disable submit when port is blank @dev', function () {
                lbaasDetailsPage.editLoadBalancerModal.port.clear();
                expect(lbaasDetailsPage.editLoadBalancerModal.canSubmit()).to.eventually.be.false;
            });

            it('should disable submit when port is below minimum value @dev', function () {
                lbaasDetailsPage.editLoadBalancerModal.port = 0;
                expect(lbaasDetailsPage.editLoadBalancerModal.canSubmit()).to.eventually.be.false;
            });

            it('should disable submit when port is above maximum value @dev', function () {
                lbaasDetailsPage.editLoadBalancerModal.port = 65536;
                expect(lbaasDetailsPage.editLoadBalancerModal.canSubmit()).to.eventually.be.false;
            });

            it('should enable submit when port is within range @dev', function () {
                lbaasDetailsPage.editLoadBalancerModal.port = 50;
                expect(lbaasDetailsPage.editLoadBalancerModal.canSubmit()).to.eventually.be.true;
            });

            it('should disable submit when timeout is blank @dev', function () {
                lbaasDetailsPage.editLoadBalancerModal.timeout.clear();
                expect(lbaasDetailsPage.editLoadBalancerModal.canSubmit()).to.eventually.be.false;
            });

            it('should disable submit when timeout is below minimum value @dev', function () {
                lbaasDetailsPage.editLoadBalancerModal.timeout = 29;
                expect(lbaasDetailsPage.editLoadBalancerModal.canSubmit()).to.eventually.be.false;
            });

            it('should disable submit when timeout is above maximum value @dev', function () {
                lbaasDetailsPage.editLoadBalancerModal.timeout = 121;
                expect(lbaasDetailsPage.editLoadBalancerModal.canSubmit()).to.eventually.be.false;
            });

            it('should enable submit when timeout is within range @dev', function () {
                lbaasDetailsPage.editLoadBalancerModal.timeout = 30;
                expect(lbaasDetailsPage.editLoadBalancerModal.canSubmit()).to.eventually.be.true;
            });

            it('should disable submit when name is invalid @dev', function () {
                lbaasDetailsPage.editLoadBalancerModal.name.clear();
                expect(lbaasDetailsPage.editLoadBalancerModal.canSubmit()).to.eventually.be.false;
            });

            it('should enable submit when name is valid @dev', function () {
                lbaasDetailsPage.editLoadBalancerModal.name = 'test_load_balancer';
                expect(lbaasDetailsPage.editLoadBalancerModal.canSubmit()).to.eventually.be.true;
            });

            it('should change description on algorithm change with expected message @dev', function () {

                var expectedDesc = ['Directs traffic to a randomly selected node.',
                    'Directs traffic in a circular pattern to each node for a load balancer in succession.',
                    'Directs traffic in a circular pattern to each node of a load balancer in succession, ' +
                    'with a larger portion of requests being served by nodes with a greater weight.',
                    'Directs traffic to the node with the fewest open connections to the load balancer.',
                    'Directs traffic to the node with the fewest open connections between the load balancer. ' +
                    'Nodes with a larger weight will service more connections at any one time.'
                ];
                expect(lbaasDetailsPage.editLoadBalancerModal.algorithmDescription).to.eventually
                    .equal(expectedDesc[0]);
                lbaasDetailsPage.editLoadBalancerModal.algorithm = 'Round Robin';
                expect(lbaasDetailsPage.editLoadBalancerModal.algorithmDescription).to.eventually
                    .equal(expectedDesc[1]);
                lbaasDetailsPage.editLoadBalancerModal.algorithm = 'Weighted Round Robin';
                expect(lbaasDetailsPage.editLoadBalancerModal.algorithmDescription).to.eventually
                    .equal(expectedDesc[2]);
                lbaasDetailsPage.editLoadBalancerModal.algorithm = 'Least Connections';
                expect(lbaasDetailsPage.editLoadBalancerModal.algorithmDescription).to.eventually
                    .equal(expectedDesc[3]);
                lbaasDetailsPage.editLoadBalancerModal.algorithm = 'Weighted Least Connections';
                expect(lbaasDetailsPage.editLoadBalancerModal.algorithmDescription).to.eventually
                    .equal(expectedDesc[4]);
            });
        });

        describe('Suspend Load Balancer @dev', function () {
            var title = 'Suspend Load Balancer';
            var id = '57361';

            before(function () {
                lbaasDetailsPage.go(id);
            });

            after(function () {
                lbaasDetailsPage.suspendLoadBalancerModal.cancel();
            });

            it('should show the suspend Load Balancer modal @dev', function () {
                lbaasDetailsPage.btnSuspendLoadBalancer.click();
                expect(lbaasDetailsPage.suspendLoadBalancerModal.isDisplayed()).to.eventually.be.true;
            });

            it('should display modal title @dev', function () {
                expect(lbaasDetailsPage.suspendLoadBalancerModal.title).to.eventually
                    .equal(title);
            });

            it('should display modal sub title @dev', function () {
                expect(lbaasDetailsPage.suspendLoadBalancerModal.subtitle).to.eventually
                    .equal(id);
            });

            it('should have ticketNumber and reason input fields enabled @dev', function () {
                expect(lbaasDetailsPage.suspendLoadBalancerModal.eleTicketNumber.isEnabled()).to.eventually.
                    be.true;
                expect(lbaasDetailsPage.suspendLoadBalancerModal.reason.isEnabled()).to.eventually.
                    be.true;
            });

            it('should not be able to submit initially @dev', function () {
                expect(lbaasDetailsPage.suspendLoadBalancerModal.canSubmit()).to.eventually.be.false;
            });

            it('should be able to submit after valid input to ticketNumber and reason fields @dev', function () {
                lbaasDetailsPage.suspendLoadBalancerModal.ticketNumber = 123;
                lbaasDetailsPage.suspendLoadBalancerModal.reason = 'abc';
                expect(lbaasDetailsPage.suspendLoadBalancerModal.canSubmit()).to.eventually.be.true;
            });

            it('should not accept text input in the ticketNumber field @dev', function () {
                lbaasDetailsPage.suspendLoadBalancerModal.ticketNumber = 'abc';
                lbaasDetailsPage.suspendLoadBalancerModal.reason = 'abc';
                expect(lbaasDetailsPage.suspendLoadBalancerModal.canSubmit()).to.eventually.be.false;
            });
        });

        describe('Add Cloud Servers @dev', function () {

            before(function () {
                lbaasDetailsPage.go('57361');
                lbaasDetailsPage.btnAddCloudServers.click();
            });

            it('should show Add Cloud Server modal @dev', function () {
                expect(lbaasDetailsPage.addCloudServersModal.isDisplayed()).to.eventually.be.true;
            });

            it('should display modal title @dev', function () {
                expect(lbaasDetailsPage.addCloudServersModal.title).to.eventually
                    .equal('Add Cloud Servers');
            });

            it('should display modal sub title @dev', function () {
                expect(lbaasDetailsPage.addCloudServersModal.subtitle).to.eventually
                    .equal('57361');
            });

            it('should have expected table headers @dev', function () {
                var expectedHeaders = [ '', 'Name (IP)', 'Port', 'Condition', 'Weight'];
                expect(lbaasDetailsPage.addCloudServersModal.headers).to.eventually.eql(expectedHeaders);
            });

            it('should have expected data in table @dev', function () {
                lbaasDetailsPage.addCloudServersModal.data().then(function (rows) {
                    expect(rows[0]).to.have.property('name', 'Prep Rescue Server');
                    expect(rows[0]).to.have.property('id', '10.182.86.18');
                    expect(rows[0]).to.have.property('Condition', 'ENABLEDDISABLEDDRAINING CONNECTIONS');
                    expect(rows[0]).to.have.property('Port', '80');
                    expect(rows[0]).to.have.property('conditionSelected', 'ENABLED');
                    expect(rows[0]).to.have.property('Weight', '');
                });
            });

            it('should be able to select nodes of table @dev', function () {
                var servers = [
                    { name: 'Kevin\'s Test Demo' },
                    { name: 'Leonel Bad Server' }
                ];
                lbaasDetailsPage.addCloudServersModal.selectServers(servers);
                expect(lbaasDetailsPage.addCloudServersModal.selectedRowCount.count()).to.eventually.equals(2);
                expect(lbaasDetailsPage.addCloudServersModal.unSelectedRowCount.count()).to.eventually.equals(10);

            });

            it('should be able to unselect the nodes of the table @dev', function () {
                var servers = [
                    { name: 'Kevin\'s Test Demo' },
                    { name: 'Leonel Bad Server' }
                ];

                lbaasDetailsPage.addCloudServersModal.unselectServers(servers);
                expect(lbaasDetailsPage.addCloudServersModal.anyUnselected.isPresent()).to.eventually.be.true;
                expect(lbaasDetailsPage.addCloudServersModal.anySelected.isPresent()).to.eventually.be.false;
            });

            it('should be able to select all @dev', function () {
                lbaasDetailsPage.addCloudServersModal.selectAll();
                expect(lbaasDetailsPage.addCloudServersModal.anyUnselected.isPresent()).to.eventually.be.false;
                expect(lbaasDetailsPage.addCloudServersModal.anySelected.isPresent()).to.eventually.be.true;
            });

            it('should have port input enabled for selected rows @dev', function () {
                var enabledInput = lbaasDetailsPage.addCloudServersModal.getEnabledInputsByColumn(3);
                enabledInput.count().then(function (count) {
                    expect(count).to.equal(12);
                });
            });

            it('should have Condition select enabled for selected rows @dev', function () {
                var enabledInput = lbaasDetailsPage.addCloudServersModal.getEnabledSelectByColumn(4);
                enabledInput.count().then(function (count) {
                    expect(count).to.equal(12);
                });
            });

            it('should have Weight disabled for select, As LB algorithm is not weighted @dev', function () {
                var enabledInput = lbaasDetailsPage.addCloudServersModal.getEnabledInputsByColumn(5);
                enabledInput.count().then(function (count) {
                    expect(count).to.equal(0);
                });
            });

            it('should be able to unselect all @dev', function () {
                lbaasDetailsPage.addCloudServersModal.unselectAll();
                expect(lbaasDetailsPage.addCloudServersModal.anyUnselected.isPresent()).to.eventually.be.true;
                expect(lbaasDetailsPage.addCloudServersModal.anySelected.isPresent()).to.eventually.be.false;
            });

            it('should have Weight input disabled for unselected rows @dev', function () {
                var enabledInput = lbaasDetailsPage.addCloudServersModal.getEnabledInputsByColumn(5);
                enabledInput.count().then(function (count) {
                    expect(count).to.equal(0);
                });
            });

            it('should have Port input disabled for unselected rows @dev', function () {
                var enabledInput = lbaasDetailsPage.addCloudServersModal.getEnabledInputsByColumn(3);
                enabledInput.count().then(function (count) {
                    expect(count).to.equal(0);
                });
            });

            it('should have Condition select disabled for unselected rows @dev', function () {
                var enabledSelect = lbaasDetailsPage.addCloudServersModal.getEnabledSelectByColumn(4);
                enabledSelect.count().then(function (count) {
                    expect(count).to.equal(0);
                });
            });

            it('should be able to filter using searchbox by name @dev', function () {
                lbaasDetailsPage.addCloudServersModal.filterBy('Kevin\'s Test Demo');
                expect(lbaasDetailsPage.addCloudServersModal.dataCount()).to.eventually.equals(3);
            });

            it('should be able to filter using searchbox by id @dev', function () {
                lbaasDetailsPage.addCloudServersModal.filterBy('10.182.86.18');
                expect(lbaasDetailsPage.addCloudServersModal.dataCount()).to.eventually.equals(4);
            });

            it('should have expected Weight in table when LB algorithm is not WEIGHTED @dev', function () {
                lbaasDetailsPage.addCloudServersModal.data().then(function (rows) {
                    expect(rows[0]).to.have.property('Weight', '');
                });
            });

            it('should have Weight input enabled on select, As LB algorithm is WEIGHTED @dev', function () {
                lbaasDetailsPage.go('9009');
                lbaasDetailsPage.btnAddCloudServers.click();
                lbaasDetailsPage.addCloudServersModal.selectAll();

                var enabledInput = lbaasDetailsPage.addCloudServersModal.getEnabledInputsByColumn(5);
                enabledInput.count().then(function (count) {
                    expect(count).to.equal(12);
                });
            });

            it('should have expected Weight in table when LB algorithm is WEIGHTED @dev', function () {
                lbaasDetailsPage.addCloudServersModal.data().then(function (rows) {
                    expect(rows[0]).to.have.property('Weight', '1');
                });
            });

            it('should disable submit, when invalid data in weight text box @dev', function () {
                var weightTxt = lbaasDetailsPage.addCloudServersModal.weightTxt(0);
                weightTxt.then(function (weightTxtBox) {
                    weightTxtBox.clear();
                    weightTxtBox.sendKeys(101);
                    expect(lbaasDetailsPage.addCloudServersModal.canSubmit()).to.eventually.be.false;
                });
            });

            it('should enable submit, when valid data in weight text box @dev', function () {
                var weightTxt = lbaasDetailsPage.addCloudServersModal.weightTxt(0);
                weightTxt.then(function (weightTxtBox) {
                    weightTxtBox.clear();
                    weightTxtBox.sendKeys(100);
                    expect(lbaasDetailsPage.addCloudServersModal.canSubmit()).to.eventually.be.true;
                });
            });

            it('should disable submit, when invalid data in port text box @dev', function () {
                var portTxt = lbaasDetailsPage.addCloudServersModal.portTxt(0);
                portTxt.then(function (portTxtBox) {
                    portTxtBox.clear();
                    portTxtBox.sendKeys(65536);
                    expect(lbaasDetailsPage.addCloudServersModal.canSubmit()).to.eventually.be.false;
                });
            });

            it('should enable submit, when valid data in port text box @dev', function () {
                var portTxt = lbaasDetailsPage.addCloudServersModal.portTxt(0);
                portTxt.then(function (portTxtBox) {
                    portTxtBox.clear();
                    portTxtBox.sendKeys(65535);
                    expect(lbaasDetailsPage.addCloudServersModal.canSubmit()).to.eventually.be.true;
                });
            });

            after(function () {
                lbaasDetailsPage.addCloudServersModal.cancel();
            });

        });

        describe('Error Page', function () {
            before(function () {
                lbaasDetailsPage.go('57361');
                basePage.disableRxNotifyTimeout();
            });

            it('should display the change error page modal @dev', function () {
                lbaasDetailsPage.btnErrorPage.click();
                expect(lbaasDetailsPage.errorPageModal.isDisplayed()).to.eventually.be.true;
            });

            it('should display modal title @dev', function () {
                expect(lbaasDetailsPage.errorPageModal.title).to.eventually
                    .equal('Change Error Page');
            });

            it('should display modal sub title @dev', function () {
                expect(lbaasDetailsPage.errorPageModal.subtitle).to.eventually
                    .equal('57361');
            });

            it('should have disabled text area with error type  Default @dev', function () {
                expect(lbaasDetailsPage.errorPageModal.textArea.isEnabled()).to.eventually.
                    be.false;
            });

            it('should have enabled text area with error type Custom @dev', function () {
                lbaasDetailsPage.errorPageModal.errorType = 'Custom';
                expect(lbaasDetailsPage.errorPageModal.textArea.isEnabled()).to.eventually.
                    be.true;
            });

            it('should be able to change text area content @dev', function () {
                lbaasDetailsPage.errorPageModal.textArea = 'Sample Data';
                expect(lbaasDetailsPage.errorPageModal.textArea.getAttribute('value')).to.eventually
                    .equal('Sample Data');
            });

            after(function () {
                lbaasDetailsPage.errorPageModal.cancel();
            });
        });

        describe('Page Tables @dev', function () {

            before(function () {
                lbaasDetailsPage.go('57369');
            });

            describe('Nodes Table', function () {

                before(function () {
                    lbaasDetailsPage.go('57369');
                    basePage.disableRxNotifyTimeout();
                });

                it('should have the expected data in the nodes table @dev', function () {
                    lbaasDetailsPage.nodesTable.data().then(function (rows) {
                        expect(rows[0]).to.have.property('Status', 'ONLINE');
                        expect(rows[0]).to.have.property('name', 'TestServer01');
                        expect(rows[0]).to.have.property('id', '9ae1032c-b39d-4eeb-b4f8-eb9b97a89d1f');
                        expect(rows[0]).to.have.property('IP Address', '10.182.78.55');
                        expect(rows[0]).to.have.property('Condition', 'ENABLED');
                        expect(rows[0]).to.have.property('Port', '80');
                        expect(rows[0]).to.have.property('Type', 'PRIMARY');
                        expect(rows[0]).to.have.property('Weight', '100');
                    });
                });

                it('should display the load balancers node table headers correctly', function () {
                    // refresh page to avoid floating header from causeing duplicate headers
                    browser.refresh();
                    var expectedHeaders = ['Status', 'Condition', 'Name (ID)', 'IP Address', 'Port',
                                   'Type', 'Weight', ''];
                    expect(lbaasDetailsPage.nodesTable.headers).to.eventually.eql(expectedHeaders);
                });

                it('should display "Edit Node Configuration" modal @dev', function () {
                    var ipAddress = '10.182.78.55';
                    lbaasDetailsPage.nodesTable.openEditNode(ipAddress);
                    expect(lbaasDetailsPage.editNodeModal.isDisplayed()).to.eventually.be.true;
                });

                it('should have expected data on "Edit Node Configuration" modal @dev', function () {
                    expect(lbaasDetailsPage.editNodeModal.title).to.eventually
                    .equal('Edit Node Configuration');
                    expect(lbaasDetailsPage.editNodeModal.subtitle).to.eventually
                    .equal('test_lb1');
                });

                it('should have expected elements on "Edit Node Configuration" Modal @dev', function () {
                    expect(lbaasDetailsPage.editNodeModal.elePort.isEnabled()).to.eventually.be.false;
                    expect(lbaasDetailsPage.editNodeModal.eleType.isEnabled()).to.eventually.be.false;
                    expect(lbaasDetailsPage.editNodeModal.eleWeight.isEnabled()).to.eventually.be.true;
                    expect(lbaasDetailsPage.editNodeModal.canSubmit()).to.eventually.be.true;
                });

                it('should have expected options on condition select box @dev', function () {
                    var modalBox = lbaasDetailsPage.editNodeModal;
                    expect(modalBox.rxSelectCondition.optionExists('ENABLED')).to.eventually.be.true;
                    expect(modalBox.rxSelectCondition.optionExists('DISABLED')).to.eventually.be.true;
                    expect(modalBox.rxSelectCondition.optionExists('DRAINING CONNECTIONS')).to.eventually.be.true;
                });

                it('should not be able to submit on invalid input @dev', function () {
                    lbaasDetailsPage.editNodeModal.weight = 'abxs';
                    expect(lbaasDetailsPage.editNodeModal.canSubmit()).to.eventually.be.false;
                });

                it('should disable weight when algorithm is not weighted @dev', function () {
                    var ipAddress = '10.182.78.55';

                    lbaasDetailsPage.go('57361');
                    basePage.disableRxNotifyTimeout();
                    lbaasDetailsPage.nodesTable.openEditNode(ipAddress);
                    expect(lbaasDetailsPage.editNodeModal.eleWeight.isEnabled()).to.eventually.be.false;
                    lbaasDetailsPage.editNodeModal.cancel();
                });

                it('should display the nodes table filter @dev', function () {
                    expect(lbaasDetailsPage.nodesTable.txtFilter.isDisplayed()).to.eventually.be.true;
                });

                it('should be filterable by name on node table when existing data @dev', function () {
                    lbaasDetailsPage.nodesTable.filterBy('TestServer01');
                    lbaasDetailsPage.nodesTable.data().then(function (data) {
                        expect(data.length).to.equal(1);
                    });
                });

                it('should display no items found message in node table @dev', function () {
                    lbaasDetailsPage.nodesTable.filterBy('zzz');
                    lbaasDetailsPage.nodesTable.data().then(function (data) {
                        expect(data[0]['Status']).to.equal('No items found');
                    });
                });

                it('should display no nodes have been added message in node table @dev', function () {
                    lbaasDetailsPage.go('57363');
                    lbaasDetailsPage.nodesTable.data().then(function (data) {
                        expect(data[0]['Status']).to.equal('No Nodes have been added.');
                    });
                    lbaasDetailsPage.go('57361');
                });

                var nodeExpected = {
                    sort: {
                        table: lbaasDetailsPage.nodesTable,
                        columns: {
                            'Status': 'Status',
                            'Condition': 'Condition',
                            'Name': 'name',
                            'IP Address': 'IP Address',
                            'Port': 'Port',
                            'Type': 'Type',
                            'Weight': 'Weight'
                        }
                    },
                    display: {
                        'nodes table': lbaasDetailsPage.nodesTable
                    },
                    equal: {
                        'label above nodes table | Nodes': lbaasDetailsPage.nodesTable.tableHeader
                    }
                };
                commonTests(nodeExpected);

                describe('Remove Node - Related to LDAP groups', function () {

                    var ipAddress = '';
                    before(function () {
                        loginPage.loginLocalhost();
                        lbaasDetailsPage.go('/57361');
                    });

                    it('should be visible remove link when the user is a member of LDAP groups @dev', function () {
                        ipAddress = '10.182.78.55';
                        expect(lbaasDetailsPage.nodesTable.isNodeActionPresent(ipAddress, 'Remove Node')).
                            to.eventually.be.true;
                        ipAddress = '10.182.65.187';
                        expect(lbaasDetailsPage.nodesTable.isNodeActionPresent(ipAddress, 'Remove Node')).
                            to.eventually.be.true;
                    });
                });

                describe('Remove Node - Not Related to LDAP groups', function () {

                    var ipAddress = '';
                    before(function () {
                        loginPage.logout();
                        lbaasDetailsPage.go('/57361');
                    });

                    it('should hide remove link when the user is not the member of LDAP groups @dev', function () {
                        ipAddress = '10.182.78.55';
                        expect(lbaasDetailsPage.nodesTable.isNodeActionPresent(ipAddress, 'Remove Node')).
                            to.eventually.be.false;

                        ipAddress = '10.182.65.187';
                        expect(lbaasDetailsPage.nodesTable.isNodeActionPresent(ipAddress, 'Remove Node')).
                            to.eventually.be.false;
                    });
                });

            });

            describe('Settings Table Failure', function () {

                var rows;
                before(function () {
                    lbaasDetailsPage.go('57363');
                    return lbaasDetailsPage.settingsTable.data().then(function (data) {
                        rows = data;
                    });
                });

                it('should have the expected data for connection Logging @dev', function () {
                    expect(rows[0]).to.have.property('Setting', 'Connection Logging');
                    expect(rows[0]).to.have.property('Status', 'OFF');
                    expect(rows[0]).to.have.property('Details', 'None');
                });

                it('should have the expected data for connection throttling @dev', function () {
                    expect(rows[1]).to.have.property('Setting', 'Connection Throttling');
                    expect(rows[1]).to.have.property('Status', 'OFF');
                    expect(rows[1]).to.have.property('Details', 'None');
                });

                it('should have the expected data for content caching @dev', function () {
                    expect(rows[2]).to.have.property('Setting', 'Content Caching');
                    expect(rows[2]).to.have.property('Status', 'Cannot be enabled for non-HTTP load balancers');
                    expect(rows[2]).to.have.property('Details', 'None');
                });

                it('should have the expected data for health monitoring @dev', function () {
                    expect(rows[3]).to.have.property('Setting', 'Health Monitoring');
                    expect(rows[3]).to.have.property('Status', 'OFF');
                    expect(rows[3]).to.have.property('Details', 'None');
                });

                it('should have the expected data for temporary rate limit @dev', function () {
                    expect(rows[4]).to.have.property('Setting', 'Temporary Rate Limit');
                    expect(rows[4]).to.have.property('Status', 'OFF');
                    expect(rows[4]).to.have.property('Details', 'None');
                });

                it('should have the expected data for session persistence @dev', function () {
                    expect(rows[5]).to.have.property('Setting', 'Session Persistence');
                    expect(rows[5]).to.have.property('Status', 'OFF');
                    expect(rows[5]).to.have.property('Details', 'None');
                });
                it('should have the expected data for ssl termination @dev', function () {
                    expect(rows[6]).to.have.property('Setting', 'SSL Termination');
                    expect(rows[6]).to.have.property('Status', 'Cannot be enabled for non-HTTP load balancers');
                    expect(rows[6]).to.have.property('Details', 'None');
                });

                var settingExpected = {

                    display: {
                        'settings table': lbaasDetailsPage.settingsTable
                    },
                    equal: {
                        'label above settings table | Settings': lbaasDetailsPage.settingsTable.tableHeader
                    }
                };

                commonTests(settingExpected);
            });

            describe('Settings Table Success', function () {
                var rows;
                before(function () {
                    lbaasDetailsPage.go('57361');
                    return lbaasDetailsPage.settingsTable.data().then(function (data) {
                        rows = data;
                    });
                });

                it('should have the expected data for connection Logging @dev', function () {
                    expect(rows[0]).to.have.property('Setting', 'Connection Logging');
                    expect(rows[0]).to.have.property('Status', 'ON');
                    expect(rows[0]).to.have.property('Details', 'None');
                });

                it('should have the expected data for connection throttling @dev', function () {
                    var exp = 'Maximum Connection Rate: 50,Maximum Number of Connections: 100,';
                    exp += 'Minimum Number of Connections: 10,Rate Interval: 60';

                    expect(rows[1]).to.have.property('Setting', 'Connection Throttling');
                    expect(rows[1]).to.have.property('Status', 'ON');
                    expect(rows[1]).to.have.property('Details', exp);
                });

                it('should have the expected data for content caching @dev', function () {
                    expect(rows[2]).to.have.property('Setting', 'Content Caching');
                    expect(rows[2]).to.have.property('Status', 'ON');
                    expect(rows[2]).to.have.property('Details', 'None');
                });

                it('should have the expected data for health monitoring @dev', function () {
                    var exp = 'Type: CONNECT,Delay: 10,Timeout: 10,Attempts before deactivation: 3';

                    expect(rows[3]).to.have.property('Setting', 'Health Monitoring');
                    expect(rows[3]).to.have.property('Status', 'ON');
                    expect(rows[3]).to.have.property('Details', exp);
                });

                it('should have the expected data for ssl termination @dev', function () {
                    var exp = 'Secure Traffic Only: Disabled,Secure Port: 443';
                    exp += ',Certificate: Click Edit to View,Intermediate Certificate: Click Edit to View';

                    expect(rows[6]).to.have.property('Setting', 'SSL Termination');
                    expect(rows[6]).to.have.property('Status', 'ON');
                    expect(rows[6]).to.have.property('Details', exp);
                });

                it('should have the expected data for temporary rate limit @dev', function () {
                    var exp = /Requests Per Second: 8,Expiration Time: Jul \d, 2017 @ \d{1,2}:\d{2} \(UTC[-+]\d{4}\)/;

                    expect(rows[4]).to.have.property('Setting', 'Temporary Rate Limit');
                    expect(rows[4]).to.have.property('Status', 'ON');
                    expect(rows[4]).to.have.property('Details').to.match(exp);
                });

                it('should have the expected data for session persistence @dev', function () {
                    expect(rows[5]).to.have.property('Setting', 'Session Persistence');
                    expect(rows[5]).to.have.property('Status', 'ON');
                    expect(rows[5]).to.have.property('Details', 'Session Persistence: HTTP Cookie');
                });

                var settingExpected = {

                    display: {
                        'settings table': lbaasDetailsPage.settingsTable
                    },
                    equal: {
                        'label above settings table | Settings': lbaasDetailsPage.settingsTable.tableHeader
                    }
                };

                commonTests(settingExpected);
            });

            describe('Settings Table', function () {
                var setTable;
                before(function () {
                    setTable = lbaasDetailsPage.settingsTable;
                });
                describe('When Toggle Buttons Are ON', function () {
                    before(function () {
                        lbaasDetailsPage.go('57361');
                    });

                    describe('Session Persistence', function () {
                        before(function () {
                            lbaasDetailsPage.settingsTable.sessionPersistenceToggle.click();
                        });

                        it('should display the session persistence modal @dev', function () {
                            expect(lbaasDetailsPage.sessionPersistenceModal.isDisplayed()).to.eventually.be.true;
                        });

                        it('should have expected title of session persistence modal @dev', function () {
                            expect(lbaasDetailsPage.sessionPersistenceModal.title).to.eventually
                                .equal('Disable Session Persistence');
                        });

                        it('should have the expected subtitle on session persistence modal @dev', function () {
                            expect(lbaasDetailsPage.sessionPersistenceModal.subtitle).to.eventually
                                .equal('57361');
                        });

                        it('should exits the notification of disable session persistence @dev', function () {
                            expect(lbaasDetailsPage.sessionPersistenceModal.notification).to.eventually
                                .equal('"Are you sure you want to disable session persistence?"');
                        });

                        it('should have expect text on submit button @dev', function () {
                            expect(lbaasDetailsPage.sessionPersistenceModal.btnSubmitSessionPersistence).to.eventually
                                .equal('Disable');
                        });

                        it('should close the modal when the cancel button is clicked @dev', function () {
                            lbaasDetailsPage.sessionPersistenceModal.cancel();
                            expect(lbaasDetailsPage.sessionPersistenceModal.isDisplayed()).to.eventually.be.false;
                        });

                    });

                    describe('Disable connection logging', function () {
                        before(function () {
                            lbaasDetailsPage.settingsTable.connectionLoggingToggle.click();
                        });

                        it('should open the expected modal of connection logging @dev', function () {
                            expect(lbaasDetailsPage.connLoggingModal.modalTitle.getText()).to.eventually
                                .equal('Disable Logging for Load Balancer');
                        });

                        it('should exits the notification of disable connection logging @dev', function () {
                            expect(lbaasDetailsPage.connLoggingModal.notification).to.eventually
                                .equal('Log files will no longer be processed every hour.');
                        });

                        it('should match the buttons of disable connection logging modal pop up @dev', function () {
                            expect(lbaasDetailsPage.connLoggingModal.btnEnableDisableConnectionLogging.getText())
                                .to.eventually.equal('Disable Logging');
                            expect(lbaasDetailsPage.connLoggingModal.btnCancelConnectionLogging).to.eventually
                                .equal('Cancel');
                        });

                        after(function () {
                            lbaasDetailsPage.connLoggingModal.close();
                        });
                    });

                    describe('Disable Connection Throttling @dev', function () {
                        before(function () {
                            lbaasDetailsPage.settingsTable.connectionThrottleToggle.click();
                        });

                        it('should open the expected modal of connection throttling @dev', function () {
                            expect(lbaasDetailsPage.connThrottlingModal.title).to.eventually
                                .equal('Disable Connection Throttling for Load Balancer test_load_balancer');
                        });

                        /* jshint maxlen: false */
                        it('should have the notification of disable connection throttling @dev', function () {
                            expect(lbaasDetailsPage.connThrottlingModal.notification).to.eventually
                            .equal('"Are you sure you want to disable this Connection Throttle? This action cannot be undone."');
                        });

                        it('should have the expected subtitle of connection throttling modal pop up @dev', function () {
                            expect(lbaasDetailsPage.healthMonitoringModal.subtitle).to.eventually
                                .equal('57361');
                        });

                        it('should match the buttons of disable connection throttling modal pop up @dev', function () {
                            expect(lbaasDetailsPage.connThrottlingModal.btnDisableConnectionThrottling)
                                .to.eventually.equal('Disable Connection Throttling');
                            expect(lbaasDetailsPage.connThrottlingModal.btnCancelConnectionThrottling)
                                .to.eventually.equal('Cancel');
                        });

                        it('should close the modal when the cancel button is clicked @dev', function () {
                            lbaasDetailsPage.connThrottlingModal.cancel();
                            expect(lbaasDetailsPage.connThrottlingModal.isDisplayed()).to.eventually.be.false;
                        });

                    });

                    describe('Disable Health Monitoring @dev', function () {
                        before(function () {
                            lbaasDetailsPage.settingsTable.healthMonitoringToggle.click();
                        });

                        it('should open the expected modal of health monitoring @dev', function () {
                            expect(lbaasDetailsPage.healthMonitoringModal.title).to.eventually
                                .equal('Disable Health Monitoring for Load Balancer test_load_balancer');
                        });

                        it('should have subtitle in health monitoring modal @dev', function () {
                            expect(lbaasDetailsPage.healthMonitoringModal.subtitle).to.eventually
                                .equal('57361');
                        });

                        it('should have notification on health monitoring modal @dev', function () {
                            var message = 'Are you sure you want to disable this Health Monitor? This action';
                            message += ' cannot be undone.';
                            expect(lbaasDetailsPage.healthMonitoringModal.notification).to.eventually
                                .equal(message);
                        });

                        it('should enable the submit button of health monitoring modal @dev', function () {
                            expect(lbaasDetailsPage.healthMonitoringModal.canSubmit()).to.eventually.be.true;
                        });

                        it('should close the modal when the cancel button is clicked @dev', function () {
                            lbaasDetailsPage.healthMonitoringModal.cancel();
                            expect(lbaasDetailsPage.healthMonitoringModal.isDisplayed()).to.eventually.be.false;
                        });

                    });

                    describe('Disable Content Caching @dev', function () {
                        before(function () {
                            lbaasDetailsPage.settingsTable.contentCachingToggle.click();
                        });

                        it('should display the content caching modal @dev', function () {
                            expect(lbaasDetailsPage.cachingModal.isDisplayed()).to.eventually.be.true;
                        });

                        it('should open the expected modal of content caching @dev', function () {
                            expect(lbaasDetailsPage.cachingModal.title).to.eventually
                                .equal('Disable Content Caching for Load Balancer');
                        });

                        it('should eanble the submit button @dev', function () {
                            expect(lbaasDetailsPage.cachingModal.canSubmit()).to.eventually.be.true;
                        });

                        it('should close the modal when the cancel button is clicked @dev', function () {
                            lbaasDetailsPage.changeNameModal.cancel();
                            expect(lbaasDetailsPage.cachingModal.isDisplayed()).to.eventually.be.false;
                        });
                    });

                    describe('Disable SSL Termination @dev', function () {
                        before(function () {
                            lbaasDetailsPage.settingsTable.sslTerminationToggle.click();
                        });

                        it('should display the SSL termination modal @dev', function () {
                            expect(lbaasDetailsPage.sslTerminationModal.isDisplayed()).to.eventually.be.true;
                        });

                        it('should have expected title in SSL termination modal @dev', function () {
                            expect(lbaasDetailsPage.sslTerminationModal.title).to.eventually
                                .equal('Disable SSL Termination');
                        });

                        it('should have expected sub title in SSL termination modal @dev', function () {
                            expect(lbaasDetailsPage.sslTerminationModal.subtitle).to.eventually
                                .equal('57361');
                        });

                        it('should have notification on SSL termination modal @dev', function () {
                            var message = 'Are you sure you want to disable SSL termination?';
                            expect(lbaasDetailsPage.sslTerminationModal.notification).to.eventually
                                .equal(message);
                        });

                        it('should have expected text on submit button @dev', function () {
                            expect(lbaasDetailsPage.sslTerminationModal.btnSubmitSSLTermination).to.eventually
                                .equal('Disable');
                        });

                        it('should close the modal when the cancel button is clicked @dev', function () {
                            lbaasDetailsPage.sslTerminationModal.cancel();
                            expect(lbaasDetailsPage.sslTerminationModal.isDisplayed()).to.eventually.be.false;
                        });

                    });
                });

                describe('When Toggle Buttons Are OFF', function () {

                    before(function () {
                        lbaasDetailsPage.go('9009');
                    });

                    describe('Session Persistence', function () {

                        before(function () {
                            lbaasDetailsPage.settingsTable.sessionPersistenceToggle.click();
                        });

                        it('should display the session persistence modal @dev', function () {
                            expect(lbaasDetailsPage.sessionPersistenceModal.isDisplayed()).to.eventually.be.true;
                        });

                        it('should have expected title of session persistence modal @dev', function () {
                            expect(lbaasDetailsPage.sessionPersistenceModal.title).to.eventually
                                .equal('Enable Session Persistence');
                        });

                        it('should have the expected subtitle on session persistence modal @dev', function () {
                            expect(lbaasDetailsPage.sessionPersistenceModal.subtitle).to.eventually
                                .equal('9009');
                        });

                        it('should exits the notification of enable session persistence @dev', function () {
                            expect(lbaasDetailsPage.sessionPersistenceModal.notification).to.eventually
                                .equal('"Are you sure you want to enable session persistence?"');
                        });

                        it('should have expect text on submit button @dev', function () {
                            expect(lbaasDetailsPage.sessionPersistenceModal.btnSubmitSessionPersistence).to.eventually
                                .equal('Enable');
                        });

                        it('should close the modal when the cancel button is clicked @dev', function () {
                            lbaasDetailsPage.sessionPersistenceModal.cancel();
                            expect(lbaasDetailsPage.sessionPersistenceModal.isDisplayed()).to.eventually.be.false;
                        });

                    });

                    describe('Enable SSL Termination', function () {
                        var fields = {};

                        before(function () {
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

                        it('should display the SSL termination modal @dev', function () {
                            expect(lbaasDetailsPage.sslTerminationModal.isDisplayed()).to.eventually.be.true;
                        });

                        it('should have expected title in SSL termination modal @dev', function () {
                            expect(lbaasDetailsPage.sslTerminationModal.title).to.eventually
                                .equal('Enable SSL Termination');
                        });

                        it('should have expected sub title in SSL termination modal @dev', function () {
                            expect(lbaasDetailsPage.sslTerminationModal.subtitle).to.eventually
                                .equal('9009');
                        });

                        it('should have warning notification on SSL termination modal @dev', function () {
                            var message = 'Enabling SSL increases a Load Balancer\'s base price';
                            expect(lbaasDetailsPage.sslTerminationModal.notification).to.eventually
                                .equal(message);
                        });

                        it('should enable submit on filling fields with valid data @dev', function () {
                            expect(lbaasDetailsPage.sslTerminationModal.canSubmit()).to
                                .eventually.be.true;
                        });

                        it('should have expected label @dev', function () {
                            expect(lbaasDetailsPage.sslTerminationModal.lblAllowedTrafic).to.eventually
                                .equal('Allowed Traffic:');
                            expect(lbaasDetailsPage.sslTerminationModal.lblSecuredPort).to.eventually
                                .equal('Secure Port:');
                            expect(lbaasDetailsPage.sslTerminationModal.lblCertificate).to.eventually
                                .equal('Certificate:');
                            expect(lbaasDetailsPage.sslTerminationModal.lblPrivateKey).to.eventually
                                .equal('Private Key:');
                            expect(lbaasDetailsPage.sslTerminationModal.lblIntermediateCertificate).to
                                .eventually.equal('Intermediate Cert:');
                        });

                        it('should have expected text on submit button @dev', function () {
                            expect(lbaasDetailsPage.sslTerminationModal.btnSubmitSSLTermination).to.eventually
                                .equal('Enable SSL Termination');
                        });

                        it('should enable submit, on blank value to intermediateCertificate @dev', function () {
                            fields = {
                                intermediateCertificate: ''
                            };
                            lbaasDetailsPage.sslTerminationModal.filloutFields(fields);
                            expect(lbaasDetailsPage.sslTerminationModal.canSubmit()).to
                                .eventually.be.true;
                        });

                        it('should disable submit, on blank value to private key @dev', function () {
                            fields = {
                                intermediateCertificate: 'test certificate',
                                privateKey: ''
                            };
                            lbaasDetailsPage.sslTerminationModal.filloutFields(fields);
                            expect(lbaasDetailsPage.sslTerminationModal.canSubmit()).to
                                .eventually.be.false;
                        });

                        it('should disable submit, on blank value to certificate @dev', function () {
                            fields = {
                                privateKey: 'private key',
                                certificate: ''
                            };
                            lbaasDetailsPage.sslTerminationModal.filloutFields(fields);
                            expect(lbaasDetailsPage.sslTerminationModal.canSubmit()).to
                                .eventually.be.false;
                        });

                        it('should disable submit, on blank value to secure port @dev', function () {
                            fields = {
                                certificate: 'test certificate',
                                securedPort: ''
                            };
                            lbaasDetailsPage.sslTerminationModal.filloutFields(fields);
                            expect(lbaasDetailsPage.sslTerminationModal.canSubmit()).to
                                .eventually.be.false;
                        });

                        it('should close the modal when the cancel button is clicked @dev', function () {
                            lbaasDetailsPage.sslTerminationModal.cancel();
                            expect(lbaasDetailsPage.sslTerminationModal.isDisplayed()).to.eventually.be.false;
                        });
                    });

                    describe('Enable connection logging', function () {

                        before(function () {
                            lbaasDetailsPage.settingsTable.connectionLoggingToggle.click();
                        });

                        it('should open the expected modal of connection logging @dev', function () {
                            expect(lbaasDetailsPage.connLoggingModal.modalTitle.getText()).to.eventually
                                .equal('Enable Logging for Load Balancer');
                        });

                        it('should exits the notification of enable connection logging @dev', function () {
                            expect(lbaasDetailsPage.connLoggingModal.notification).to.eventually.equal(
                                'Log files will be processed every hour and stored in your Cloud Files account.');
                        });

                        it('should match the buttons of enable connection logging modal pop up @dev', function () {
                            expect(lbaasDetailsPage.connLoggingModal.btnEnableDisableConnectionLogging).to.eventually
                                .equal('Enable Logging');
                            expect(lbaasDetailsPage.connLoggingModal.btnCancelConnectionLogging).to.eventually
                                .equal('Cancel');
                        });

                        after(function () {
                            lbaasDetailsPage.connLoggingModal.close();
                        });

                    });

                    describe('Add Connection Throttling', function () {

                        before(function () {
                            lbaasDetailsPage.settingsTable.connectionThrottleToggle.click();
                            var lb = {
                                minConnections: 1000,
                                maxConnections: 100000,
                                maxConnectionRate: 100000,
                                rateInterval: 3600
                            };
                            lbaasDetailsPage.addConnectionThrottlingModal.filloutFields(lb);
                        });

                        it('should open the expected modal of connection throttling @dev', function () {
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.title).to.eventually
                                .equal('Add Connection Throttle');
                        });

                        it('should enable the submit, when proper data updated @dev', function () {
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.canSubmit()).to
                            .eventually.be.true;
                        });

                        it('should disable the submit, when Min Connections field is above range @dev', function () {
                            lbaasDetailsPage.addConnectionThrottlingModal.txtAddMinConnections = 1001;
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.canSubmit()).to
                            .eventually.be.false;
                        });

                        it('should disable the submit, when Min Connections field is below range @dev', function () {
                            lbaasDetailsPage.addConnectionThrottlingModal.txtAddMinConnections = -1;
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.canSubmit()).to
                            .eventually.be.false;
                        });

                        it('should disable the submit, when Max Connections field is above range @dev', function () {
                            lbaasDetailsPage.addConnectionThrottlingModal.txtAddMaxConnections = 100001;
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.canSubmit()).to
                            .eventually.be.false;
                        });

                        it('should disable the submit, when Max Connections field is below range @dev', function () {
                            lbaasDetailsPage.addConnectionThrottlingModal.txtAddMaxConnections = 0;
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.canSubmit()).to
                            .eventually.be.false;
                        });

                        it('should disable submit, when Max Connection Rate field is above range @dev', function () {
                            lbaasDetailsPage.addConnectionThrottlingModal.txtAddMaxConnectionRate = 100001;
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.canSubmit()).to
                            .eventually.be.false;
                        });

                        it('should disable submit, when Max Connection Rate field is below range @dev', function () {
                            lbaasDetailsPage.addConnectionThrottlingModal.txtAddMaxConnectionRate = -1;
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.canSubmit()).to
                            .eventually.be.false;
                        });

                        it('should disable the submit, when Rate Interval field is above range @dev', function () {
                            lbaasDetailsPage.addConnectionThrottlingModal.txtAddRateInterval = 36001;
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.canSubmit()).to
                            .eventually.be.false;
                        });

                        it('should disable the submit, when Rate Interval field is below range @dev', function () {
                            lbaasDetailsPage.addConnectionThrottlingModal.txtAddRateInterval = 0;
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.canSubmit()).to
                            .eventually.be.false;
                        });

                        it('should have the expected subtitle of connection throttling modal pop up @dev', function () {
                            expect(lbaasDetailsPage.healthMonitoringModal.subtitle).to.eventually
                                .equal('9009');
                        });

                        it('should match the label of connection throttling modal pop up @dev', function () {
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.lblAddMinConnections).to.eventually
                                .equal('Min Connections:');
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.lblAddMaxConnections).to.eventually
                                .equal('Max Connections:');
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.lblAddMaxConnectionRate).to.eventually
                                .equal('Max Connection Rate:');
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.lblAddRateInterval).to.eventually
                                .equal('Rate Interval:');
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.btnEnableConnectionThrottling)
                                .to.eventually.equal('Submit');
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.btnCancelConnectionThrottling)
                                .to.eventually.equal('Cancel');
                        });

                        it('should exists the elements of connection throttling @dev', function () {
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.txtAddMinConnections.isDisplayed())
                                .to.eventually.be.true;
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.txtAddMaxConnections.isDisplayed())
                                .to.eventually.be.true;
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.txtAddMaxConnectionRate.isDisplayed())
                                .to.eventually.be.true;
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.txtAddRateInterval.isDisplayed())
                                .to.eventually.be.true;
                        });

                        it('should close the modal when the cancel button is clicked @dev', function () {
                            lbaasDetailsPage.addConnectionThrottlingModal.cancel();
                            expect(lbaasDetailsPage.addConnectionThrottlingModal.isDisplayed()).to.eventually.be.false;
                        });
                    });

                    describe('Enable Content Caching @dev', function () {
                        before(function () {
                            lbaasDetailsPage.settingsTable.contentCachingToggle.click();
                        });

                        it('should display the content caching modal @dev', function () {
                            expect(lbaasDetailsPage.cachingModal.isDisplayed()).to.eventually.be.true;
                        });

                        it('should open the expected modal of content caching @dev', function () {
                            expect(lbaasDetailsPage.cachingModal.title).to.eventually
                                .equal('Enable Content Caching for Load Balancer');
                        });

                        it('should enable the submit button @dev', function () {
                            expect(lbaasDetailsPage.cachingModal.canSubmit()).to.eventually.be.true;
                        });

                        it('should close the modal when the cancel button is clicked @dev', function () {
                            lbaasDetailsPage.changeNameModal.cancel();
                            expect(lbaasDetailsPage.cachingModal.isDisplayed()).to.eventually.be.false;
                        });
                    });

                    describe('Enable Health Monitoring @dev', function () {

                        var lb = {};

                        before(function () {
                            lbaasDetailsPage.go('57362');
                            lbaasDetailsPage.settingsTable.healthMonitoringToggle.click();
                        });

                        beforeEach(function () {
                            lb.type = 'CONNECT';
                            lb.timeout = 10;
                            lb.delay = 12;
                            lb.attempts = 2;
                        });

                        it('should open the expected modal of health monitoring @dev', function () {
                            expect(lbaasDetailsPage.healthMonitoringModal.title).to.eventually
                                .equal('Enable Health Monitoring');
                        });

                        it('should have expected subtitle on health monitoring modal @dev', function () {
                            expect(lbaasDetailsPage.healthMonitoringModal.subtitle).to.eventually
                                .equal('57362');
                        });

                        it('should disable the submit button initially @dev', function () {
                            lb.timeout = '';
                            lb.delay = '';
                            lb.attempts = '';
                            lb.type = '';
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                            expect(lbaasDetailsPage.healthMonitoringModal.canSubmit()).to.eventually.be.false;
                        });

                        it('should disable the submit button if the timeout is not entered @dev', function () {
                            lb.timeout = '';
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                            expect(lbaasDetailsPage.healthMonitoringModal.canSubmit()).to.eventually.be.false;
                        });

                        it('should disable the submit button if the delay is not entered @dev', function () {
                            lb.delay = '';
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                            expect(lbaasDetailsPage.healthMonitoringModal.canSubmit()).to.eventually.be.false;
                        });

                        it('should disable the submit button if the attempt count is not entered @dev', function () {
                            lb.attempts = '';
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                            expect(lbaasDetailsPage.healthMonitoringModal.canSubmit()).to.eventually.be.false;
                        });

                        it('should enabled the submit button if all fields are with valid data @dev', function () {
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                            expect(lbaasDetailsPage.healthMonitoringModal.canSubmit()).to.eventually.be.true;
                        });

                        it('should disable the submit button if the http path is not entered @dev', function () {
                            lb.type = 'HTTP';
                            lb.path = '';
                            lb.statusRegex = '^[1-9]';
                            lb.bodyRegex = '^[1-9]';
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                            expect(lbaasDetailsPage.healthMonitoringModal.canSubmit()).to.eventually.be.false;
                        });

                        it('should disable the submit button if the status regex is not entered @dev', function () {
                            lb.type = 'HTTP';
                            lb.path = '/abcd';
                            lb.statusRegex = '';
                            lb.bodyRegex = '^[1-9]';
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                            expect(lbaasDetailsPage.healthMonitoringModal.canSubmit()).to.eventually.be.false;
                        });

                        it('should enable the submit button if the body regex is not entered @dev', function () {
                            lb.type = 'HTTP';
                            lb.path = '/abcd';
                            lb.statusRegex = '^[1-9]';
                            lb.bodyRegex = '';
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                            expect(lbaasDetailsPage.healthMonitoringModal.canSubmit()).to.eventually.be.true;
                        });

                        it('should enable the submit button if all fields entered @dev', function () {
                            lb.type = 'HTTP';
                            lb.path = '/abcd';
                            lb.statusRegex = '^[1-9]';
                            lb.bodyRegex = '^[1-9]';
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                            expect(lbaasDetailsPage.healthMonitoringModal.canSubmit()).to.eventually.be.true;
                        });

                        it('should have the expected label @dev', function () {
                            lb.type = 'HTTP';
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);

                            expect(lbaasDetailsPage.healthMonitoringModal.lblType).to.eventually
                                .equal('Monitor Type:');
                            expect(lbaasDetailsPage.healthMonitoringModal.lblDelay).to.eventually
                                .equal('Delay:');
                            expect(lbaasDetailsPage.healthMonitoringModal.lblTimeout).to.eventually
                                .equal('Timeout:');
                            expect(lbaasDetailsPage.healthMonitoringModal.lblAttempts).to.eventually
                                .equal('Attempts:');
                            expect(lbaasDetailsPage.healthMonitoringModal.lblHttpPath).to.eventually
                                .equal('HTTP Path:');
                            expect(lbaasDetailsPage.healthMonitoringModal.lblStatusRegex).to.eventually
                                .equal('Status Regex:');
                            expect(lbaasDetailsPage.healthMonitoringModal.lblBodyRegex).to.eventually
                                .equal('Body Regex:');
                            expect(lbaasDetailsPage.healthMonitoringModal.btnSubmitHealthMonitoring).to.eventually
                                .equal('Save Monitoring Settings');
                            expect(lbaasDetailsPage.healthMonitoringModal.btnCancelHealthMonitoring).to.eventually
                                .equal('Cancel');
                        });

                        it('should have the expected elements of health monitoring @dev', function () {
                            lb.type = 'HTTP';
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                            expect(lbaasDetailsPage.healthMonitoringModal.selHealthMonitorType.isDisplayed())
                                .to.eventually.be.true;
                            expect(lbaasDetailsPage.healthMonitoringModal.txtHealthMonitorDelay.isDisplayed())
                                .to.eventually.be.true;
                            expect(lbaasDetailsPage.healthMonitoringModal.txtHealthMonitorTimeout.isDisplayed())
                                .to.eventually.be.true;
                            expect(lbaasDetailsPage.healthMonitoringModal.txtHealthMonitorAttempts.isDisplayed())
                                .to.eventually.be.true;
                            expect(lbaasDetailsPage.healthMonitoringModal.txtHealthMonitorHttpPath.isDisplayed())
                                .to.eventually.be.true;
                            expect(lbaasDetailsPage.healthMonitoringModal.txtHealthMonitorStatusRegex.isDisplayed())
                                .to.eventually.be.true;
                            expect(lbaasDetailsPage.healthMonitoringModal.txtHealthMonitorBodyRegex.isDisplayed())
                                .to.eventually.be.true;
                        });

                        it('should close the modal when the cancel button is clicked @dev', function () {
                            lbaasDetailsPage.healthMonitoringModal.cancel();
                            expect(lbaasDetailsPage.healthMonitoringModal.isDisplayed()).to.eventually.be.false;
                        });

                    });

                });

                describe('When Edit Links Are Clicked', function () {

                    before(function () {
                        lbaasDetailsPage.go('57361');
                    });

                    it('should open the expected modal of connection throttling @dev', function () {
                        lbaasDetailsPage.settingsTable.connectionThrottleEdit.click();
                        expect(lbaasDetailsPage.addConnectionThrottlingModal.title).to.eventually
                            .equal('Add Connection Throttle');
                    });

                    describe('Edit Link of Health Monitoring @dev', function () {
                        var lb = {};
                        before(function () {
                            lbaasDetailsPage.go('57361');
                            lbaasDetailsPage.settingsTable.healthMonitoringEdit.click();
                        });

                        it('should open the expected modal of health monitoring @dev', function () {
                            expect(lbaasDetailsPage.healthMonitoringModal.title).to.eventually
                                .equal('Enable Health Monitoring');
                        });

                        it('should have expected data in monitoring type field @dev', function () {
                            expect(lbaasDetailsPage.healthMonitoringModal.selHealthMonitorType).to
                                .eventually.equal('CONNECT');
                        });

                        it('should have expected data in delay field @dev', function () {
                            expect(lbaasDetailsPage.healthMonitoringModal.txtHealthMonitorDelay).to
                                .eventually.equal('10');
                        });

                        it('should have expected data in timeout field @dev', function () {
                            expect(lbaasDetailsPage.healthMonitoringModal.txtHealthMonitorTimeout).to
                                .eventually.equal('10');
                        });

                        it('should have expected data in attempts field @dev', function () {
                            expect(lbaasDetailsPage.healthMonitoringModal.txtHealthMonitorAttempts).to
                                .eventually.equal('3');
                        });

                        it('should disable the submit button if the timeout is not entered @dev', function () {
                            lb.timeout = '';
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                            expect(lbaasDetailsPage.healthMonitoringModal.canSubmit()).to.eventually.be.false;
                        });

                        it('should disable the submit button if the delay is not entered @dev', function () {
                            lb.delay = '';
                            lb.timeout = 10;
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                            expect(lbaasDetailsPage.healthMonitoringModal.canSubmit()).to.eventually.be.false;
                        });

                        it('should disable the submit button if the attempt count is not entered @dev', function () {
                            lb.delay = 10;
                            lb.attempts = '';
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                            expect(lbaasDetailsPage.healthMonitoringModal.canSubmit()).to.eventually.be.false;
                        });

                        it('should enabled the submit button if all fields are with valid data @dev', function () {
                            lb.attempts = 2;
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                            expect(lbaasDetailsPage.healthMonitoringModal.canSubmit()).to.eventually.be.true;
                        });

                        it('should disable the submit button if the http path is not entered @dev', function () {
                            lb.type = 'HTTP';
                            lb.path = '';
                            lb.statusRegex = '^[1-9]';
                            lb.bodyRegex = '^[1-9]';
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                            expect(lbaasDetailsPage.healthMonitoringModal.canSubmit()).to.eventually.be.false;
                        });

                        it('should disable the submit button if the status regex is not entered @dev', function () {
                            lb.path = '/abcd';
                            lb.statusRegex = '';
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                            expect(lbaasDetailsPage.healthMonitoringModal.canSubmit()).to.eventually.be.false;
                        });

                        it('should enable the submit button if the body regex is not entered @dev', function () {
                            lb.statusRegex = '^[1-9]';
                            lb.bodyRegex = '';
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                            expect(lbaasDetailsPage.healthMonitoringModal.canSubmit()).to.eventually.be.true;
                        });

                        it('should enable the submit button if all fields entered @dev', function () {
                            lb.bodyRegex = '^[1-9]';
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                            expect(lbaasDetailsPage.healthMonitoringModal.canSubmit()).to.eventually.be.true;
                        });

                        it('should have the expected label @dev', function () {
                            lb.type = 'HTTP';
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);

                            expect(lbaasDetailsPage.healthMonitoringModal.lblType).to.eventually
                                .equal('Monitor Type:');
                            expect(lbaasDetailsPage.healthMonitoringModal.lblDelay).to.eventually
                                .equal('Delay:');
                            expect(lbaasDetailsPage.healthMonitoringModal.lblTimeout).to.eventually
                                .equal('Timeout:');
                            expect(lbaasDetailsPage.healthMonitoringModal.lblAttempts).to.eventually
                                .equal('Attempts:');
                            expect(lbaasDetailsPage.healthMonitoringModal.lblHttpPath).to.eventually
                                .equal('HTTP Path:');
                            expect(lbaasDetailsPage.healthMonitoringModal.lblStatusRegex).to.eventually
                                .equal('Status Regex:');
                            expect(lbaasDetailsPage.healthMonitoringModal.lblBodyRegex).to.eventually
                                .equal('Body Regex:');
                            expect(lbaasDetailsPage.healthMonitoringModal.btnSubmitHealthMonitoring).to.eventually
                                .equal('Save Monitoring Settings');
                            expect(lbaasDetailsPage.healthMonitoringModal.btnCancelHealthMonitoring).to.eventually
                                .equal('Cancel');
                        });

                        it('should have the expected elements of health monitoring @dev', function () {
                            lb.type = 'HTTP';
                            lbaasDetailsPage.healthMonitoringModal.filloutFields(lb);
                            expect(lbaasDetailsPage.healthMonitoringModal.selHealthMonitorType.isDisplayed())
                                .to.eventually.be.true;
                            expect(lbaasDetailsPage.healthMonitoringModal.txtHealthMonitorDelay.isDisplayed())
                                .to.eventually.be.true;
                            expect(lbaasDetailsPage.healthMonitoringModal.txtHealthMonitorTimeout.isDisplayed())
                                .to.eventually.be.true;
                            expect(lbaasDetailsPage.healthMonitoringModal.txtHealthMonitorAttempts.isDisplayed())
                                .to.eventually.be.true;
                            expect(lbaasDetailsPage.healthMonitoringModal.txtHealthMonitorHttpPath.isDisplayed())
                                .to.eventually.be.true;
                            expect(lbaasDetailsPage.healthMonitoringModal.txtHealthMonitorStatusRegex.isDisplayed())
                                .to.eventually.be.true;
                            expect(lbaasDetailsPage.healthMonitoringModal.txtHealthMonitorBodyRegex.isDisplayed())
                                .to.eventually.be.true;
                        });

                        it('should close the modal when the cancel button is clicked @dev', function () {
                            lbaasDetailsPage.healthMonitoringModal.cancel();
                            expect(lbaasDetailsPage.healthMonitoringModal.isDisplayed()).to.eventually.be.false;
                        });

                    });

                });

                describe('Update Temporary RateLimit modals checking', function () {
                    var lb = {};
                    before(function () {
                        lbaasDetailsPage.go('57000');
                        lb = {
                            maxRequestsPerSecond: 0,
                            expirationTime: '2016-07-07 17:30:00'
                        };
                        lbaasDetailsPage.settingsTable.btnUpdateTemporaryRateLimit.click();
                    });

                    it('should exits the elements of temporary ratelimit @dev', function () {
                        expect(element(by.model(lbaasDetailsPage.addTemporaryRateLimitModal.modelMaxRequestsPerSecond))
                            .isPresent()).to.eventually.true;
                        expect(element(by.model(lbaasDetailsPage.addTemporaryRateLimitModal.modelExpirationTime))
                            .isPresent()).to.eventually.true;
                    });

                    it('should match the label of temporary ratelimit modal pop up @dev', function () {
                        expect(lbaasDetailsPage.addTemporaryRateLimitModal.lblMaxRequestsPerSecond).to.eventually
                            .equal('Max Connections:');
                        expect(lbaasDetailsPage.addTemporaryRateLimitModal.lblExpirationTime).to.eventually
                            .equal('Expiration Time:');
                        expect(lbaasDetailsPage.addTemporaryRateLimitModal.btnSubmitRateLimit).to.eventually
                            .equal('Submit');
                        expect(lbaasDetailsPage.addTemporaryRateLimitModal.btnCancelRateLimit).to.eventually
                            .equal('Cancel');
                    });

                    it('should disable the submit button when max connections field is below range @dev', function () {
                        lbaasDetailsPage.addTemporaryRateLimitModal.filloutFields(lb);
                        expect(lbaasDetailsPage.addTemporaryRateLimitModal.canSubmit()).to.eventually.be.false;
                    });

                    it('should disable the submit button when max connections field is above range @dev', function () {
                        lb.maxRequestsPerSecond = 1000000;
                        lbaasDetailsPage.addTemporaryRateLimitModal.filloutFields(lb);
                        expect(lbaasDetailsPage.addTemporaryRateLimitModal.canSubmit()).to.eventually.be.false;
                    });

                    it('should close the modal when the cancel button is clicked @dev', function () {
                        lbaasDetailsPage.addTemporaryRateLimitModal.cancel();
                        expect(lbaasDetailsPage.addTemporaryRateLimitModal.isDisplayed()).to.eventually.be.false;
                    });

                });

                describe('Add Temporary RateLimit modals checking ', function () {
                    var lb = {};
                    before(function () {
                        lbaasDetailsPage.go('57001');
                        lb = {
                            maxRequestsPerSecond: 0,
                            expirationTime: '2016-07-07 17:30:00',
                            ticketId: 1234,
                            comment: 'things'
                        };
                        lbaasDetailsPage.settingsTable.btnAddTemporaryRateLimit.click();
                    });

                    it('should exits the elements of temporary ratelimit @dev', function () {
                        expect(element(by.model(lbaasDetailsPage.addTemporaryRateLimitModal.modelMaxRequestsPerSecond))
                            .isPresent()).to.eventually.true;
                        expect(element(by.model(lbaasDetailsPage.addTemporaryRateLimitModal.modelExpirationTime))
                            .isPresent()).to.eventually.true;
                        expect(element(by.model(lbaasDetailsPage.addTemporaryRateLimitModal.modelTicketId))
                            .isPresent()).to.eventually.true;
                        expect(element(by.model(lbaasDetailsPage.addTemporaryRateLimitModal.modelComment))
                            .isPresent()).to.eventually.true;
                    });

                    it('should match the label of temporary ratelimit modal pop up @dev', function () {
                        expect(lbaasDetailsPage.addTemporaryRateLimitModal.lblMaxRequestsPerSecond).to.eventually
                            .equal('Max Connections:');
                        expect(lbaasDetailsPage.addTemporaryRateLimitModal.lblExpirationTime).to.eventually
                            .equal('Expiration Time:');
                        expect(lbaasDetailsPage.addTemporaryRateLimitModal.lblTicketId).to.eventually
                            .equal('Ticket Number:');
                        expect(lbaasDetailsPage.addTemporaryRateLimitModal.lblComment).to.eventually
                            .equal('Reason:');
                        expect(lbaasDetailsPage.addTemporaryRateLimitModal.btnSubmitRateLimit).to.eventually
                            .equal('Submit');
                        expect(lbaasDetailsPage.addTemporaryRateLimitModal.btnCancelRateLimit).to.eventually
                            .equal('Cancel');
                    });

                    it('should disable the submit button when max connections field is below range @dev', function () {
                        expect(lbaasDetailsPage.addTemporaryRateLimitModal.canSubmit()).to.eventually.be.false;
                    });

                    it('should disable the submit button when max connections field is above range @dev', function () {
                        lb.maxRequestsPerSecond = 1000000;
                        lbaasDetailsPage.addTemporaryRateLimitModal.filloutFields(lb);
                        expect(lbaasDetailsPage.addTemporaryRateLimitModal.canSubmit()).to.eventually.be.false;
                    });

                    it('should close the modal when the cancel button is clicked @dev', function () {
                        lbaasDetailsPage.addTemporaryRateLimitModal.cancel();
                        expect(lbaasDetailsPage.addTemporaryRateLimitModal.isDisplayed()).to.eventually.be.false;
                    });
                });
            });

        });

        describe('Failures', function () {

            var detailsTable;
            before(function () {
                lbaasDetailsPage.go('12345');
                lbaasDetailsPage.detailsTable.data().then(function (details) {
                    detailsTable = details;
                });
            });

            describe('error messages on failed loads', function () {

                it('should have the correct region @dev', function () {
                    expect(detailsTable[0]).to.eql('Region:\nSTAGING');
                });

                it('should have the correct status @dev', function () {
                    expect(detailsTable[1]).to.eql('Status:\nACTIVE');
                });

                it('should have the correct created @dev', function () {
                    expect(detailsTable[3]).to.match(timePattern).to.contain('Created:\n');
                });

                it('should have the correct last updated @dev', function () {
                    expect(detailsTable[4]).to.match(timePattern).to.contain('Last Updated:\n');
                });

                it('should have the correct protocol/Port @dev', function () {
                    expect(detailsTable[5]).to.eql('Protocol/Port:\nHTTP (80)');
                });

                it('should have the correct time out @dev', function () {
                    expect(detailsTable[6]).to.eql('Time Out:\n30 seconds');
                });

                it('should have the correct algorithm @dev', function () {
                    expect(detailsTable[7]).to.eql('Algorithm:\nRANDOM');
                });

                it('should have the correct node count @dev', function () {
                    expect(detailsTable[8]).to.eql('Node Count:\nN/A');
                });

                it('should have the correct cluster name @dev', function () {
                    expect(detailsTable[9]).to.eql('Cluster Name:\nN/A');
                });

                it('should have the correct cluster id @dev', function () {
                    expect(detailsTable[10]).to.eql('Cluster ID:\n12345');
                });

                it('should have the correct error page @dev', function () {
                    expect(detailsTable[12]).to.eql('Error Page:\nError loading Error Page details');
                });
            });
        });

        describe('Load Balancer 404 Detail page', function () {
            before(function () {
                lbaasDetailsPage.go('98765');
            });

            it('should fail to load @dev', function () {
                var errorMsg = 'Error loading Load Balancer details';
                expect(encore.rxNotify.all.exists(errorMsg, 'error')).to.eventually.be.true;
            });
        });

        describe('Add Virtual Ip link', function () {
            before(function () {
                lbaasDetailsPage.go('/57361');
            });

            //I had to keep this separate because it doesn't work inside below describe.
            it('should be hidden when the user is missing the required LDAP groups @dev', function () {
                expect(lbaasDetailsPage.btnAddVirtualIp.isPresent()).to.eventually.be.false;
            });
        });

        describe('Add Virtual Ip Modal', function () {
            var lb;
            before(function () {
                loginPage.loginLocalhost();
                lbaasDetailsPage.go('/57361');
                lbaasDetailsPage.btnAddVirtualIp.click();
            });

            beforeEach(function () {
                lb = {
                    vipType: 'PUBLIC',
                    ticketNumber: 123,
                    reason: 'test reason'
                };
            });

            it('should disable the submit button initially @dev', function () {
                expect(lbaasDetailsPage.addVirtualIpModal.canSubmit()).to.eventually.be.false;
            });

            it('should have correct title for add virtual ip @dev', function () {
                expect(lbaasDetailsPage.addVirtualIpModal.title).to.eventually
                    .equal('Add Virtual IP');
            });

            it('should enable the submit button when all fields are provided @dev', function () {
                lbaasDetailsPage.addVirtualIpModal.filloutFields(lb);
                expect(lbaasDetailsPage.addVirtualIpModal.canSubmit()).to.eventually.be.true;
            });

            it('should enable the submit button when only the reason field is empty @dev', function () {
                lb.reason = '';
                lbaasDetailsPage.addVirtualIpModal.filloutFields(lb);
                expect(lbaasDetailsPage.addVirtualIpModal.canSubmit()).to.eventually.be.true;
            });

            it('should disable the submit button when ticket number is empty @dev', function () {
                lb.ticketNumber = '';
                lbaasDetailsPage.addVirtualIpModal.filloutFields(lb);
                expect(lbaasDetailsPage.addVirtualIpModal.canSubmit()).to.eventually.be.false;
            });

        });

        describe('Add Access Rule Modal', function () {

            describe('Modal Startup', function () {
                before(function () {
                    lbaasDetailsPage.go('/57361');
                    lbaasDetailsPage.btnAddAccessControlRule.click();
                });

                it('should have title "Add Hosts/Networks" @dev', function () {
                    expect(lbaasDetailsPage.addAccessControlRule.title).to.eventually.equal('Add Hosts/Networks');
                });

                it('should have subtitle equal to 57361 @dev', function () {
                    expect(lbaasDetailsPage.addAccessControlRule.subtitle).to.eventually.equal('57361');
                });

                it('should disable the submit button initially @dev', function () {
                    expect(lbaasDetailsPage.addAccessControlRule.canSubmit()).to.eventually.be.false;
                });
            });

            describe('Valid Addresses', function () {
                var lbRules = [{
                        address: '10.182.86.18'
                    }, {
                        address: '2001:2011:79f1:1212:07b4:0a0b:0000:0002'
                    }, {
                        address: '10.182.86.18/32'
                    }, {
                        address: '2001:2011:79f1:1212:07b4:0a0b:0000:0002/128'
                    }];

                before(function () {
                    lbaasDetailsPage.go('/57361');
                    lbaasDetailsPage.btnAddAccessControlRule.click();
                });

                it('should enable the submit button with IPv4 w/o CIDR @dev', function () {
                    expect(lbaasDetailsPage.addAccessControlRule.filloutFields(0, lbRules[0].address));
                    expect(lbaasDetailsPage.addAccessControlRule.canSubmit()).to.eventually.be.true;
                });

                it('should disable the submit button when new row added by clicking add more link @dev', function () {
                    lbaasDetailsPage.addAccessControlRule.btnAddMoreNode.click();
                    expect(lbaasDetailsPage.addAccessControlRule.canSubmit()).to.eventually.be.false;
                });

                it('should enable the submit button with IPV6 w/o CIDR @dev', function () {
                    expect(lbaasDetailsPage.addAccessControlRule.filloutFields(1, lbRules[1].address));
                    expect(lbaasDetailsPage.addAccessControlRule.canSubmit()).to.eventually.be.true;
                });

                it('should enable the submit button with IPv4 w/CIDR @dev', function () {
                    lbaasDetailsPage.addAccessControlRule.btnAddMoreNode.click();
                    expect(lbaasDetailsPage.addAccessControlRule.filloutFields(2, lbRules[2].address));
                    expect(lbaasDetailsPage.addAccessControlRule.canSubmit()).to.eventually.be.true;
                });

                it('should enable the submit button with IPv6 w/CIDR @dev', function () {
                    lbaasDetailsPage.addAccessControlRule.btnAddMoreNode.click();
                    expect(lbaasDetailsPage.addAccessControlRule.filloutFields(3, lbRules[3].address));
                    expect(lbaasDetailsPage.addAccessControlRule.canSubmit()).to.eventually.be.true;
                });

                it('should have delete button when more than one row present @dev', function () {
                    expect(lbaasDetailsPage.addAccessControlRule.btnDeleteAccessRule(0)
                        .isPresent()).to.eventually.be.true;
                    expect(lbaasDetailsPage.addAccessControlRule.btnDeleteAccessRule(1)
                        .isPresent()).to.eventually.be.true;
                    expect(lbaasDetailsPage.addAccessControlRule.btnDeleteAccessRule(2)
                        .isPresent()).to.eventually.be.true;
                    expect(lbaasDetailsPage.addAccessControlRule.btnDeleteAccessRule(3)
                        .isPresent()).to.eventually.be.true;
                });

                it('should not have delete button when only one row present @dev', function () {
                    lbaasDetailsPage.addAccessControlRule.btnDeleteAccessRule(0).click();
                    lbaasDetailsPage.addAccessControlRule.btnDeleteAccessRule(1).click();
                    lbaasDetailsPage.addAccessControlRule.btnDeleteAccessRule(1).click();
                    expect(lbaasDetailsPage.addAccessControlRule.btnDeleteAccessRule(3).isPresent())
                        .to.eventually.be.false;
                });

                it('should close the modal when the cancel button is clicked @dev', function () {
                    lbaasDetailsPage.addAccessControlRule.cancel();
                    expect(lbaasDetailsPage.addAccessControlRule.isDisplayed()).to.eventually.be.false;
                });

            });

            describe('Invalid Addresses', function () {
                var invalidLbRules = [{
                        address: 'Test Me This Ip',
                    }, {
                        address: '10.182.86.'
                    }, {
                        address: '2001:2011:79f1:1212:07b4:0a0b:0000:'
                    }, {
                        address: '10.182.86.18/33'
                    }, {
                        address: '2001:2011:79f1:1212:07b4:0a0b:0000:0002/129'
                    }];
                before(function () {
                    lbaasDetailsPage.go('/57361');
                    lbaasDetailsPage.btnAddAccessControlRule.click();
                });

                it('should disable the submit button when host is alpha value @dev', function () {
                    expect(lbaasDetailsPage.addAccessControlRule.filloutFields(0, invalidLbRules[0].address));
                    expect(lbaasDetailsPage.addAccessControlRule.canSubmit()).to.eventually.be.false;
                });

                it('should disable the submit button when host invalid IPv4 value @dev', function () {
                    expect(lbaasDetailsPage.addAccessControlRule.filloutFields(0, invalidLbRules[1].address));
                    expect(lbaasDetailsPage.addAccessControlRule.canSubmit()).to.eventually.be.false;
                });

                it('should disable the submit button when host invalid IPv6 value @dev', function () {
                    expect(lbaasDetailsPage.addAccessControlRule.filloutFields(0, invalidLbRules[2].address));
                    expect(lbaasDetailsPage.addAccessControlRule.canSubmit()).to.eventually.be.false;
                });

                it('should disable the submit button when host invalid CIDR IPv4 @dev', function () {
                    expect(lbaasDetailsPage.addAccessControlRule.filloutFields(0, invalidLbRules[3].address));
                    expect(lbaasDetailsPage.addAccessControlRule.canSubmit()).to.eventually.be.false;
                });

                it('should disable the submit button when host number invalid CIDR IPv6 @dev', function () {
                    expect(lbaasDetailsPage.addAccessControlRule.filloutFields(0, invalidLbRules[4].address));
                    expect(lbaasDetailsPage.addAccessControlRule.canSubmit()).to.eventually.be.false;
                });
            });
        });

        describe('Add External Nodes Modal', function () {
            var lb;
            before(function () {
                lbaasDetailsPage.go('/57361');
                lbaasDetailsPage.btnAddExternalNodes.click();

                lb = [{
                        externalNodeAddress: '10.182.86.18',
                        externalNodePort: '80'
                    },
                    {
                        externalNodeAddress: '2001:2011:79f1:1212:07b4:0a0b:0000:0002',
                        externalNodePort: '88'
                    }];
            });

            it('should have title and subtitle on Add External Nodes modal @dev', function () {
                expect(lbaasDetailsPage.addExternalNodes.title).to.eventually
                .equal('Add External Nodes');
                expect(lbaasDetailsPage.addExternalNodes.subtitle).to.eventually
                .equal('57361');
            });

            it('should disable the submit button initially @dev', function () {
                expect(lbaasDetailsPage.addExternalNodes.canSubmit()).to.eventually.be.false;
            });

            it('should enable the submit button when default row entered with valid values @dev', function () {
                lbaasDetailsPage.addExternalNodes.filloutFields([lb[0]]);
                expect(lbaasDetailsPage.addExternalNodes.canSubmit()).to.eventually.be.true;
            });

            it('should disable the submit button when new row added by clicking add more link @dev', function () {
                lbaasDetailsPage.addExternalNodes.btnAddMoreNode.click();
                expect(lbaasDetailsPage.addExternalNodes.canSubmit()).to.eventually.be.false;
            });

            it('should enable the submit button when new row values have been entered @dev', function () {
                lbaasDetailsPage.addExternalNodes.filloutFields(lb);
                expect(lbaasDetailsPage.addExternalNodes.canSubmit()).to.eventually.be.true;
            });

            it('should disable the submit button when port number is alphanumeric value @dev', function () {
                lb[1].externalNodePort = 'ABC 123';
                lbaasDetailsPage.addExternalNodes.filloutFields(lb);
                expect(lbaasDetailsPage.addExternalNodes.canSubmit()).to.eventually.be.false;
            });

            it('should disable the submit button when ip address is invalid format @dev', function () {
                lb[1].externalNodePort = '88';
                lb[1].externalNodeAddress = '12:34:56';
                lbaasDetailsPage.addExternalNodes.filloutFields(lb);
                expect(lbaasDetailsPage.addExternalNodes.canSubmit()).to.eventually.be.false;
            });

            it('should have delete button when more than one row present @dev', function () {
                expect(lbaasDetailsPage.addExternalNodes.btnDeleteExternalNode(0).isPresent()).to.eventually.be.true;
                expect(lbaasDetailsPage.addExternalNodes.btnDeleteExternalNode(1).isPresent()).to.eventually.be.true;
            });

            it('should not have delete button when only one row present @dev', function () {
                lbaasDetailsPage.addExternalNodes.btnDeleteExternalNode(1).click();
                expect(lbaasDetailsPage.addExternalNodes.btnDeleteExternalNode(0).isPresent()).to.eventually.be.false;
            });

            it('should close the modal when the cancel button is clicked @dev', function () {
                lbaasDetailsPage.addExternalNodes.cancel();
                expect(lbaasDetailsPage.addExternalNodes.isDisplayed()).to.eventually.be.false;
            });
        });
    });

    describe('Smoke Tests', function () {

        describe('Main Details', function () {

            var detailsTable;
            before(function () {
                if (basePage.isInMidwayEnvironment()) {
                    lbaasDetailsPage.go('57361');
                } else {
                    lbaasDetailsPage.open(lbName);
                }
                lbaasDetailsPage.detailsTable.data().then(function (details) {
                    detailsTable = details;
                });
            });

            it('should have proper labels on details table', function () {
                var expectedLabels = ['Region', 'Status', 'Age', 'Created', 'Last Updated',
                    'Protocol/Port', 'Time Out', 'Algorithm', 'Node Count', 'Cluster Name',
                    'Cluster ID', 'Host', 'Error Page'];

                lbaasDetailsPage.detailsTable.data().then(function (lbaasDetails) {
                    var index = 0;
                    _.each(expectedLabels, function (label) {
                        expect(lbaasDetails[index]).to.contain(label);
                        index++;
                    });
                });
            });

            it('should have the correct region', function () {
                expect(detailsTable[0]).to.eql('Region:\nSTAGING');
            });

            it('should have the correct status', function () {
                expect(detailsTable[1]).to.eql('Status:\nACTIVE');
            });

            it('should have the correct created @dev', function () {
                expect(detailsTable[3]).to.match(timePattern).to.contain('Created:\n');
            });

            it('should have the correct last updated @dev', function () {
                expect(detailsTable[4]).to.match(timePattern).to.contain('Last Updated:\n');
            });

            it('should have the correct protocol/Port', function () {
                expect(detailsTable[5]).to.eql('Protocol/Port:\nHTTP (80)');
            });

            it('should have the correct time out', function () {
                expect(detailsTable[6]).to.eql('Time Out:\n30 seconds');
            });

            it('should have the correct algorithm', function () {
                expect(detailsTable[7]).to.eql('Algorithm:\nRANDOM');
            });

            it('should have the correct node count', function () {
                expect(detailsTable[8]).to.eql('Node Count:\n2');
            });

            it('should have the correct cluster name', function () {
                expect(detailsTable[9]).to.eql('Cluster Name:\nN/A');
            });

            it('should have the correct cluster id', function () {
                expect(detailsTable[10]).to.eql('Cluster ID:\n57361');
            });

            it('should have the correct host', function () {
                expect(detailsTable[11]).to.eql('Host:\nztm-n02.staging1.lbaas.rackspace.net');
            });

            it('should have the correct error page', function () {
                expect(detailsTable[12]).to.eql('Error Page:\nDefault Error Page');
            });

        });

        describe('Virtual IPs Table', function () {
            var message = 'No Virtual IPs have been added.';

            before(function () {
                if (basePage.isInMidwayEnvironment()) {
                    lbaasDetailsPage.go('57361');
                } else {
                    lbaasDetailsPage.open(lbName);
                }
            });

            it('should display virtual IPs table', function () {
                expect(lbaasDetailsPage.ipsTable.isDisplayed()).to.eventually.be.true;
            });

            it('should have proper headers on the virtual IPs table', function () {
                var expectedHeaders = ['IP Address', 'Type', ''];
                expect(lbaasDetailsPage.ipsTable.headers).to.eventually.eql(expectedHeaders);
            });

            it('should Sort all columns on the Virtual IPs table');

            it('should display the Virtual IPs table filter @dev', function () {
                expect(lbaasDetailsPage.ipsTable.txtFilter.isDisplayed()).to.eventually.be.true;
            });

            it('should have rows expected on Virtual IP table @dev', function () {
                expect(lbaasDetailsPage.ipsTable.length).to.eventually.equal(4);
            });

            it('should be filterable by IP Address on Virtual IP table @dev', function () {
                lbaasDetailsPage.ipsTable.filterBy('184.106');
                expect(lbaasDetailsPage.ipsTable.length).to.eventually.equal(2);
            });

            it('should be filterable by Type on Virtual IP table @dev', function () {
                lbaasDetailsPage.ipsTable.filterBy('PUBLIC');
                expect(lbaasDetailsPage.ipsTable.length).to.eventually.equal(3);
            });

            it('should display No items found message in Virtual IP table @dev', function () {
                lbaasDetailsPage.ipsTable.filterBy('shouldFilterNoRecord');
                lbaasDetailsPage.ipsTable.data().then(function (data) {
                    expect(data[0]['IP Address']).to.equal('No items found');
                });
            });

            it('should display ' + message + ' message in Virual IP table @dev', function () {
                lbaasDetailsPage.go('57364');
                lbaasDetailsPage.ipsTable.data().then(function (data) {
                    expect(data[0]['IP Address']).to.equal(message);
                });
            });
        });

        describe('Access Controls Table', function () {
            var message = 'No Access Controls have been created.';

            before(function () {
                if (basePage.isInMidwayEnvironment()) {
                    lbaasDetailsPage.go('57361');
                } else {
                    lbaasDetailsPage.open(lbName);
                }
            });

            var accessTable = {
                display: {
                    'access controls table': lbaasDetailsPage.accessTable,
                },
                equal: {
                    'label above table | Access Controls': lbaasDetailsPage.accessTable.tableHeader
                }
            };

            commonTests(accessTable);

            it('should have proper headers on the Access Controls table', function () {
                var expectedHeaders = ['IP Address', 'Type', ''];
                expect(lbaasDetailsPage.accessTable.headers).to.eventually.eql(expectedHeaders);
            });

            it('should Search for data in the Access Controls table');

            it('should Sort all columns on the Access Controls table');

            it('should display the access control table filter @dev', function () {
                expect(lbaasDetailsPage.accessTable.txtFilter.isDisplayed()).to.eventually.be.true;
            });

            it('should have rows expected on Access Controls table @dev', function () {
                expect(lbaasDetailsPage.accessTable.length).to.eventually.equal(2);
            });

            it('should be filterable by IP Address on Access Controls table @dev', function () {
                lbaasDetailsPage.accessTable.filterBy('6.3.9.6');
                expect(lbaasDetailsPage.accessTable.length).to.eventually.equal(1);
            });

            it('should be filterable by Type on Access Controls table @dev', function () {
                lbaasDetailsPage.accessTable.filterBy('DENY');
                expect(lbaasDetailsPage.accessTable.length).to.eventually.equal(1);
            });

            it('should display No items found message into the table @dev', function () {
                lbaasDetailsPage.accessTable.filterBy('shouldFilterNoRecord');

                lbaasDetailsPage.accessTable.data().then(function (accesses) {
                    expect(accesses[0]['IP Address']).to.equal('No items found');
                });
            });

            it('should display ' + message + ' message in Virual IP table @dev', function () {
                lbaasDetailsPage.go('57364');
                lbaasDetailsPage.accessTable.data().then(function (data) {
                    expect(data[0]['IP Address']).to.equal(message);
                });
            });

            it('should remove one IP from the Access Controls list @dev', function () {
                /* added .go to refresh the page otherwise
                you will get "no elements found" */
                lbaasDetailsPage.go('57361');
                lbaasDetailsPage.accessTable.clickRemove;
                expect(lbaasDetailsPage.accessTable.length).to.eventually.equal(1);
            });
        });

        describe('Unsuspend Load Balancer @dev', function () {

            var commonBeforeCalls = function () {
                lbaasDetailsPage.go('57366');
                lbaasDetailsPage.btnUnSuspendLoadBalancer.click();
                basePage.disableRxNotifyTimeout();
            };

            var commonModalCases = function (modal) {
                it('should open the expected modal of unsuspend load balancer @dev', function () {
                    expect(modal.title).to.eventually
                        .equal('Unsuspend Load Balancer');
                });

                it('should have match the unsuspend submit button label of the modal @dev', function () {
                    expect(modal.unSuspendBeginSubmit).
                        eventually.equal('Unsuspend Load Balancer');
                });

                it('should be displayed the unsuspend submit button of the modal @dev', function () {
                    expect(modal.unSuspendBeginSubmit.isDisplayed()).
                        to.eventually.be.true;
                });

                it('should not display the unsuspend modal on click of "Cancel" button @dev', function () {
                    modal.unSuspendBeginCancel.click();
                    expect(modal.isDisplayed()).to.eventually.be.false;
                    //reopening the modal for next cases
                    lbaasDetailsPage.btnUnSuspendLoadBalancer.click();
                });
            };

            describe('When User Has Valid Permission @dev', function () {
                before(function () {
                    commonBeforeCalls();
                });

                var modal = lbaasDetailsPage.unSuspendLoadBalancerModal;
                //Below common method call is required in both describe blocks
                commonModalCases(modal);

                it('should have match the unsuspend submit confirm button label of the modal @dev', function () {
                    modal.unSuspendBeginSubmit.click();
                    expect(modal.unSuspendConfirmButton).eventually.equal('Yes');
                });

                it('should be displayed the unsuspend confirmation button of the modal @dev', function () {
                    expect(modal.unSuspendConfirmButton.isDisplayed()).to.eventually.be.true;
                });

                it('should not display the unsuspend modal on click of "No" button @dev', function () {
                    modal.unSuspendCancelButton.click();
                    expect(modal.isDisplayed()).to.eventually.be.false;
                });
            });

            describe('When User Do Not Have Valid Permission @dev', function () {
                before(function () {
                    loginPage.logout();
                    commonBeforeCalls();
                });

                var modal = lbaasDetailsPage.unSuspendLoadBalancerModal;
                //Below common method call is required in both describe blocks
                commonModalCases(modal);

                it('should exits the notification of permission denied to un-suspned @dev', function () {
                    modal.unSuspendBeginSubmit.click();
                    modal.notification.then(function (items) {
                        expect(items[1]).to.equal(
                            'You do not have permissions to take this action! Please contact your manager.');
                    });
                });

                it('should not display the unsuspend modal on click of "OK" button @dev', function () {
                    modal.noPermissionCloseModal.click();
                    expect(modal.isDisplayed()).to.eventually.be.false;
                });
            });

        });

        describe('For All Links @dev', function () {
            var unionLinksArray;
            var Links = {
                active: [
                    'btnGoToReach',
                    'btnViewHistoricalUsage'
                ],
                inactive: [
                    'btnSyncLoadBalancer',
                    'btnErrorPage',
                    'btnEditLoadBalancer',
                    'btnMoveHost',
                    'btnDeleteLoadBalancer',
                    'btnAddCloudServers',
                    'btnAddExternalNodes',
                    'btnAddVirtualIp'
                ],
                settingsToggle: [
                    'connectionLoggingToggle',
                    'connectionThrottleToggle',
                    'btnAddTemporaryRateLimit',
                    'contentCachingToggle',
                    'healthMonitoringToggle',
                    'sessionPersistenceToggle',
                    'sslTerminationToggle'
                ]
            };

            var addSpaceBtwCamelCase = function (camelCaseStr) {
                return camelCaseStr.replace('btn', '').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
            };

            describe('When Load Balancer Is Suspended @dev', function () {
                before(function () {
                    loginPage.loginLocalhost();
                    lbaasDetailsPage.go('57366');
                });

                _.each(Links.active, function (linkName) {
                    it(addSpaceBtwCamelCase(linkName) + ' should be clickable @dev', function () {
                        expect(lbaasDetailsPage.isClickable(linkName)).to.eventually.be.true;
                    });
                });

                //note: Un suspend link is visible when Lbaas is suspended mode.
                it('unsuspend load balancer should be clickable @dev', function () {
                    expect(lbaasDetailsPage.isClickable('btnUnSuspendLoadBalancer')).to.eventually.be.true;
                });

                _.each(Links.inactive, function (linkName) {
                    it(addSpaceBtwCamelCase(linkName) + ' should be non-clickable @dev', function () {
                        expect(lbaasDetailsPage.isClickable(linkName)).to.eventually.be.false;
                    });
                });

                //Toggle Switches in settings table.
                _.each(Links.settingsToggle, function (linkName) {
                    it(addSpaceBtwCamelCase(linkName) + ' should be non-clickable @dev', function () {
                        expect(lbaasDetailsPage.settingsTable.isToggleClickable(linkName)).to.eventually.be.false;
                    });
                });

                //Edit Links in settings table.
                it('settings table edit links should be non-clickable @dev', function () {
                    lbaasDetailsPage.settingsTable.getEditLinks().then(function (items) {
                        unionLinksArray = _.union(items);
                        expect(unionLinksArray.length === 1 && unionLinksArray[0] === 'none').to.be.true;
                    });
                });

                //Below is the special case for all action cog
                it('all actions menu should be non-clickable @dev', function () {
                    lbaasDetailsPage.IsActionsMenuClickable().then(function (items) {
                        unionLinksArray = _.union(items);
                        expect(unionLinksArray.length === 1 && unionLinksArray[0] === 'none').to.be.true;
                    });
                });

                //Below is special case for access table delete row
                it('access control in action cog should be non-clickable @dev', function () {
                    expect(lbaasDetailsPage.accessTable.isClickable('cssDeleteRow')).to.eventually.be.false;
                });

                //Below is special case for well message at the top
                it('should display notification about suspended @dev', function () {
                    lbaasDetailsPage.notification.then(function (items) {
                        expect(items[0]).to.equal(
                            'Load Balancer is suspended. Some actions will be disabled.');
                    });
                });
            });

            describe('When Load Balancer Is Unsuspended @dev', function () {
                before(function () {
                    lbaasDetailsPage.go('57361');
                });

                _.each(Links.active, function (linkName) {
                    it(addSpaceBtwCamelCase(linkName) + ' should be clickable @dev', function () {
                        expect(lbaasDetailsPage.isClickable(linkName)).to.eventually.be.true;
                    });
                });

                //note: suspend link is visible when Lbaas is unsuspended mode.
                it('suspend load balancer should be clickable @dev', function () {
                    expect(lbaasDetailsPage.isClickable('btnSuspendLoadBalancer')).to.eventually.be.true;
                });

                _.each(Links.inactive, function (linkName) {
                    it(addSpaceBtwCamelCase(linkName) + ' should be clickable @dev', function () {
                        expect(lbaasDetailsPage.isClickable(linkName)).to.eventually.be.true;
                    });
                });

                //Toggle Switches in settings table.
                _.each(Links.settingsToggle, function (linkName) {
                    it(addSpaceBtwCamelCase(linkName) + ' should be clickable @dev', function () {
                        expect(lbaasDetailsPage.settingsTable.isToggleClickable(linkName)).to.eventually.be.true;
                    });
                });

                //Edit Links in settings table.
                it('settings table edit links should be clickable @dev', function () {
                    lbaasDetailsPage.settingsTable.getEditLinks().then(function (items) {
                        unionLinksArray = _.union(items);
                        expect(unionLinksArray.length === 1 && unionLinksArray[0] === 'auto').to.be.true;
                    });
                });

                //Below is the special case for all action cog
                it('all actions menu should be clickable @dev', function () {
                    lbaasDetailsPage.IsActionsMenuClickable().then(function (items) {
                        unionLinksArray = _.union(items);
                        expect(unionLinksArray.length === 1 && unionLinksArray[0] === 'auto').to.be.true;
                    });
                });

                //Below is special case for access table delete row
                it('access control in action cog should be clickable @dev', function () {
                    expect(lbaasDetailsPage.accessTable.isClickable('cssDeleteRow')).to.eventually.be.true;
                });
            });
        });
    });
});

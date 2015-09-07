var lbaasOverviewPage = require('../../../pages/lbaas/overview.page');
var commonTests = require('../../common');

describe('Load Balancers Overview Page - Page Layout', function () {
    var user = loginPage.driver.params.user;
    var accountNumber = loginPage.driver.params.accountNumber;
    var lbQuery, filter;

    before(function () {
        if (basePage.isInMidwayEnvironment()) {
            lbQuery = { name: 'test_create_lb' };
        } else {
            lbQuery = { name: 'lbaasDetails' };
        }
        filter = lbQuery.name;
        lbaasOverviewPage.go();
        lbaasOverviewPage.openStatusFilterDropDown();
        lbaasOverviewPage.toggleStatus('all', true);
    });

    var expected = {
        url: ptor.baseUrl + lbaasOverviewPage.url,
        breadcrumbs: ['Home', 'User hub_cap', 'Load Balancers', 'All Load Balancers'],
        title: 'Load Balancers',
        subtitle: new RegExp('(\\d+\\s)Load Balancers found for ' + user),
        table: {
            object: lbaasOverviewPage.table,
            hasFloatingHeader: true,
            sort: {
                useRxSortableColumn: true,
                columns: {
                    'Name (ID)': {
                        sortProperty: 'name',
                        dataFn: commonTests.dataFunctions.name,
                        // protractor is grabbing two columns, Name (ID) and Cluster.
                        // specifying Name (ID) column only here.
                        selector: 'td:nth-of-type(2)'
                    },
                    'Status': {
                        sortProperty: 'Status',
                        dataFn: commonTests.dataFunctions.status,
                        selector: 'td.rx-status-column'
                    },
                    'Protocol (Port)': {
                        sortProperty: 'protocol',
                        dataFn: commonTests.dataFunctions.protocol
                    },
                    'Node Count': {
                        sortProperty: 'Node Count',
                        dataFn: commonTests.dataFunctions.nodeCount
                    },
                    'Cluster': {
                        sortProperty: 'Cluster'
                    },
                    'Region': {
                        sortProperty: 'Region'
                    },
                    'Created Date': {
                        sortProperty: 'createdAt'
                    },
                    'Updated Date': {
                        sortProperty: 'updatedAt'
                    },
                    // We currently do not support sorting by port.
                    // 'Protocol (Port)': {
                    //     isPort: true,
                    //     sortProperty: 'protocol',
                    //     dataFn: commonTests.dataFunctions.port,
                    //     selector: 'td:nth-of-type(4)'
                    // }
                },
                repeater: 'loadBalancer in loadBalancers'
            },
            root: $('table.loadbalancers-list')
        },
        display: {
            'user products sidebar': basePage.userProducts,
            'user details sidebar': basePage.userDetails,
            'the load balancers overview table': lbaasOverviewPage.table,
            'the load balancers overview pagination table': lbaasOverviewPage.table.pagination.rootElement,
            '"Create New Load Balancer" Link': lbaasOverviewPage.lnkCreateLoadBalancer,
            '"Go to Reach Load Balancers" Link': lbaasOverviewPage.lnkReach,
            'Account Info Banner': basePage.accountInfoBanner
        }
    };

    commonTests(expected);

    describe('Smoke Tests', function () {
        it('should display the load balancers overview table filter', function () {
            expect(lbaasOverviewPage.table.txtFilter.isDisplayed()).to.eventually.be.true;
        });

        it('should display the load balancers overview table headers correctly', function () {
            // refresh page to avoid floating header from causeing duplicate headers
            browser.refresh();
            var expectedHeaders = ['Status', 'Name (ID)', 'IP Address', 'Protocol (Port)',
                                   'Node Count', 'Cluster', 'Region', 'Created Date', 'Updated Date', ''];
            expect(lbaasOverviewPage.table.headers).to.eventually.eql(expectedHeaders);
        });

        it('should link to a Load balancer on the table', function () {
            lbaasOverviewPage.table.row(1).then(function (row) {
                var expectedUrl = ptor.baseUrl + '/cloud/' + accountNumber + '/' +
                    user + '/loadbalancers/' + row.Region + '/' + row.id;
                row.viewDetails();

                expect(lbaasOverviewPage.currentUrl).to.eventually.eql(expectedUrl);
                lbaasOverviewPage.go();
            });
        });

    });

    describe('Midway Tests', function () {
        before(function () {
            lbaasOverviewPage.go();
        });

        it('should display the tooltip with the correct information @dev', function () {
            var ipTooltipContent = 'IPV4:174.106.24.22\nIPV6:3003:4801:79d2:0000:07b4:0a0b:0000:0001';
            var ipColumn = lbaasOverviewPage.table.ipColumns(0);
            var ipTooltip = lbaasOverviewPage.table.ipTooltips(0);

            browser.actions().mouseMove(ipColumn).perform();
            expect(ipTooltip.isDisplayed()).to.eventually.be.true;
            expect(ipTooltip.getText()).to.eventually.eql(ipTooltipContent);
        });

        it('should show "Enable Logging" in action cog menu when logging is disabled @dev', function () {
            // https://jira.rax.io/browse/DCXAPPS-1106
            var lbQuery = { name: 'test_disabled_lb' };
            var filter = lbQuery.name;
            lbaasOverviewPage.table.findLoadBalancer(lbQuery, filter).then(function (row) {
                expect(row.actionMenu.action('Enable Logging').rootElement.isPresent()).to.eventually.be.true;
            });
        });

        it('should show "Enable Connection Throttling" when throttling is disabled @dev', function () {
            // https://jira.rax.io/browse/DCXAPPS-1108
            var lbQuery = { name: 'test_disabled_lb' };
            var filter = lbQuery.name;
            lbaasOverviewPage.table.findLoadBalancer(lbQuery, filter).then(function (row) {
                expect(row.actionMenu.action('Enable Connection Throttling').rootElement.isPresent()
                    ).to.eventually.be.true;
            });
        });

        it('should show "Enable Content Caching" when caching is disabled @dev', function () {
            // https://jira.rax.io/browse/DCXAPPS-1108
            var lbQuery = { name: 'test_disabled_lb' };
            var filter = lbQuery.name;
            lbaasOverviewPage.table.findLoadBalancer(lbQuery, filter).then(function (row) {
                expect(row.actionMenu.action('Enable Content Caching').rootElement.isPresent()
                    ).to.eventually.be.true;
            });
        });

        it('should show "Disable Logging" in action cog menu when logging is enabled @dev', function () {
            // https://jira.rax.io/browse/DCXAPPS-1106
            var lbQuery = { name: 'test_enabled_lb' };
            var filter = lbQuery.name;
            lbaasOverviewPage.table.findLoadBalancer(lbQuery, filter).then(function (row) {
                expect(row.actionMenu.action('Disable Logging').rootElement.isPresent()).to.eventually.be.true;
            });
        });

        it('should show "Disable Connection Throttling" when throttling is enabled @dev', function () {
            // https://jira.rax.io/browse/DCXAPPS-1108
            var lbQuery = { name: 'test_enabled_lb' };
            var filter = lbQuery.name;
            lbaasOverviewPage.table.findLoadBalancer(lbQuery, filter).then(function (row) {
                expect(row.actionMenu.action('Disable Connection Throttling').rootElement.isPresent()
                    ).to.eventually.be.true;
            });
        });

        it('should show "Disable Content Caching" when caching is enabled @dev', function () {
            // https://jira.rax.io/browse/DCXAPPS-1108
            var lbQuery = { name: 'test_enabled_lb' };
            var filter = lbQuery.name;
            lbaasOverviewPage.table.findLoadBalancer(lbQuery, filter).then(function (row) {
                expect(row.actionMenu.action('Disable Content Caching').rootElement.isPresent()
                    ).to.eventually.be.true;
            });
        });

        describe('Verify Status Filter', function () {
            var expectedStatus = ['ACTIVE', 'BUILD', 'PENDING_UPDATE', 'PENDING_DELETE',
                'SUSPENDED', 'ERROR', 'DELETED'];
            before(function () {
                browser.refresh();
                lbaasOverviewPage.openStatusFilterDropDown();
            });

            after(function () {
                lbaasOverviewPage.toggleStatus('all', true);
            });

            it('should show all elements when all statuses are selected @dev', function () {
                // https://jira.rax.io/browse/EN-1787
                lbaasOverviewPage.toggleStatus('all', true);
                var statuses = lbaasOverviewPage.table.getAllStatuses();
                expect(statuses).to.eventually.have.members(expectedStatus);
            });

            it('should not show elements when no statuses are selected @dev', function () {
                 // https://jira.rax.io/browse/EN-1787
                lbaasOverviewPage.toggleStatus('all', false);
                var statuses = lbaasOverviewPage.table.getAllStatuses();
                expect(statuses).to.eventually.be.empty;
            });

            _.each(expectedStatus, function (status) {
                it('should filter load balancers based on: ' + status + ' @dev', function () {
                    lbaasOverviewPage.toggleStatus('all', false);
                    lbaasOverviewPage.toggleStatus(status, true);
                    var statuses = lbaasOverviewPage.table.getAllStatuses();
                    expect(statuses).to.eventually.eql([status]);
                });
            });
        });

        describe('Verify Data', function () {
            var row;
            before(function (done) {
                lbQuery = { name: 'test_create_lb', status: 'BUILD' };
                filter = lbQuery.name;
                lbaasOverviewPage.table.findLoadBalancer(lbQuery, filter).then(function (rowData) {
                    row = rowData;
                    done();
                });
            });

            it('should display correct name @dev', function () {
                var expectedName = ['lbaasDetails', 'test_create_lb'];
                expect(_.contains(expectedName, row.name)).to.be.true;
            });

            it('should display correct ID @dev', function () {
                expect(row.id).to.equal('59247');
            });

            it('should display correct status @dev', function () {
                expect(row.status).to.equal('BUILD');
            });

            it('should display correct protocol @dev', function () {
                expect(row.protocol).to.equal('HTTP');
            });

            it('should display correct port @dev', function () {
                expect(row.port).to.equal('(80)');
            });

            it('should display correct region @dev', function () {
                var expectedRegion = [browser.params.region, 'STAGING'];
                expect(_.contains(expectedRegion, row.region)).to.be.true;
            });

            it('should display created date in correct format @dev', function () {
                expect(row['Created Date']).to.match(/(\d+\/\d+\/\d+)\s(\d+:\d+)\s(.M)/);
            });

            it('should display last updated in correct format @dev', function () {
                expect(row['Updated Date']).to.match(/(\d+\/\d+\/\d+)\s(\d+:\d+)\s(.M)/);
            });

            it('should not display an Action Cog @dev', function () {
                expect(row.cogVisible).to.eventually.be.false;
            });
        });

        // LB Rename not currently enabled on overview page
        describe.skip('Rename Modal', function () {
            before(function () {
                lbaasOverviewPage.table.findLoadBalancer(lbQuery, filter).then(function (lb) {
                    lb.actionMenu.action('Change Name').openModal();
                });
            });

            it('should have the current name in the text box @dev', function () {
                expect(lbaasOverviewPage.renameLbModal.txtLbName.getText()).to.eventually.equal(lbQuery.name);
            });
            it('should have a submit button @dev', function () {
                expect(lbaasOverviewPage.renameLbModal.btnSubmit.isPresent()).to.be.true;
            });
            it('should have a cancel button @dev', function () {
                expect(lbaasOverviewPage.renameLbModal.btnCancel.isPresent()).to.be.true;
            });
            it('should disable the submit button until the name is changed @dev', function () {
                expect(lbaasOverviewPage.renameLbModal.btnSubmit.isEnabled()).to.be.false;
            });
            it('should eanble the submit button after the name is changed @dev', function () {
                lbaasOverviewPage.renameLbModal.txtLbName.sendKeys('rename_load_balancer_target');
                expect(lbaasOverviewPage.renameLbModal.btnSubmit.isEnabled()).to.be.true;
            });
            it('should close the modal when the cancel button is clicked @dev', function () {
                lbaasOverviewPage.renameLbModal.cancel();
                expect(lbaasOverviewPage.renameLbModal.modalTitle.isPresent()).to.be.false;
            });
        });

        describe('Enable Health Monitoring Modal', function () {
            var lb = {};

            before(function () {
                var lbQuery = { name: 'test_disabled_lb' };
                lbaasOverviewPage.table.findLoadBalancer(lbQuery, lbQuery.name).then(function (lb) {
                    lb.actionMenu.action('Enable Health Monitoring').openModal();
                });
            });

            beforeEach(function () {
                lb = {
                    type: 'CONNECT',
                    delay: 2,
                    timeout: 10,
                    attemptsBeforeDeactivation: 5
                };
                lbaasOverviewPage.healthMonitoringModal.filloutFields(lb);
            });

            it('should disable the submit button initially @dev', function () {
                lb.timeout = '';
                lb.delay = '';
                lb.attemptsBeforeDeactivation = '';
                lb.type = '';
                lbaasOverviewPage.healthMonitoringModal.filloutFields(lb);
                expect(lbaasOverviewPage.healthMonitoringModal.canSubmit()).to.eventually.be.false;
            });

            it('should disable the submit button if the timeout is not entered @dev', function () {
                lb.type = 'CONNECT';
                lb.timeout = '';
                lb.delay = 2;
                lb.attemptsBeforeDeactivation = 3;
                lbaasOverviewPage.healthMonitoringModal.filloutFields(lb);
                expect(lbaasOverviewPage.healthMonitoringModal.canSubmit()).to.eventually.be.false;
            });

            it('should disable the submit button if the delay is not entered @dev', function () {
                lb.type = 'CONNECT';
                lb.timeout = 20;
                lb.delay = '';
                lb.attemptsBeforeDeactivation = 10;
                lbaasOverviewPage.healthMonitoringModal.filloutFields(lb);
                expect(lbaasOverviewPage.healthMonitoringModal.canSubmit()).to.eventually.be.false;
            });

            it('should disable the submit button if the attempt count is not entered @dev', function () {
                lb.type = 'CONNECT';
                lb.timeout = 18;
                lb.delay = 21;
                lb.attemptsBeforeDeactivation = '';
                lbaasOverviewPage.healthMonitoringModal.filloutFields(lb);
                expect(lbaasOverviewPage.healthMonitoringModal.canSubmit()).to.eventually.be.false;
            });

            it('should eanble the submit button after all the data is entered @dev', function () {
                lb.timeout = 1;
                lb.delay = 2;
                lb.attempts = 3;
                lb.type = 'CONNECT';
                lbaasOverviewPage.healthMonitoringModal.filloutFields(lb);
                expect(lbaasOverviewPage.healthMonitoringModal.canSubmit()).to.eventually.be.true;
            });

            it('should close the modal when the cancel button is clicked @dev', function () {
                lbaasOverviewPage.healthMonitoringModal.cancel();
                expect(lbaasOverviewPage.healthMonitoringModal.isDisplayed()).to.eventually.be.false;
            });
        });
    });
});

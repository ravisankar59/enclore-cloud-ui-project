var serversOverviewPage = require('../../../pages/servers/overview');
var commonTests = require('../../common');
var tf = require('../../../pages/test-fixtures/api');
var rxSelectFilter = encore.rxSelectFilter;

describe('Cloud Overview Page - Cloud Servers Table', function () {

    var user = ptor.params.user;
    var accountNumber = ptor.params.accountNumber;
    var firstGenServerName, nextGenServerName;
    var cloudBaseUrl = ptor.baseUrl + '/cloud/' + accountNumber + '/' + user;
    var selectFilter = rxSelectFilter.main;

    before(function () {
        serversOverviewPage.go();

        if (basePage.isInMidwayEnvironment()) {
            firstGenServerName = 'kacieissoawesome';
            nextGenServerName = 'Kevin\'s Test Demo';
        } else {
            firstGenServerName = tf.firstGenChangeName.name;
            nextGenServerName = tf.nextGenChangeName.name;
        }
    });

    var expected = {
        table: {
            object: serversOverviewPage.table,
            sort: {
                columns: {
                    'Status': 'Status',
                    'Gen': 'Gen',
                    'Name (UUID)': 'name',
                    'Image (OS)': 'Image (OS)',
                    'Created': 'created_date',
                    'Region': 'Region'
                }
            }
        }
    };

    commonTests(expected);

    describe('Smoke Tests', function () {

        it('should link to a FirstGen server', function () {
            serversOverviewPage.go();
            serversOverviewPage.table.filterBy(firstGenServerName);

            serversOverviewPage.table.row(1).then(function (row) {
                row.viewDetails();
                var expectedUrl = cloudBaseUrl + '/servers/firstgen/' + row.id;
                expect(serversOverviewPage.currentUrl).to.eventually.equal(expectedUrl);
            });
        });

        it('should link to a NextGen server', function () {
            serversOverviewPage.go();
            serversOverviewPage.table.filterBy(nextGenServerName);

            serversOverviewPage.table.row(1).then(function (row) {
                row.viewDetails();
                var expectedUrl = cloudBaseUrl + '/servers/' + row.Region + '/' + row.id;
                expect(serversOverviewPage.currentUrl).to.eventually.equal(expectedUrl);
            });
        });

        it('should filter overview table', function () {
            serversOverviewPage.go();
            serversOverviewPage.table.filterBy(nextGenServerName);

            serversOverviewPage.table.row(1).then(function (row) {
                expect(row.name).to.equal(nextGenServerName);
            });
        });

        describe('Bulk Tests', function () {
            var cbSelect = null;
            before(function () {
                serversOverviewPage.go();
                serversOverviewPage.table.data().then(function (row) {
                    cbSelect = row[0].select;
                });
            });

            it('should select all servers by checkbox', function () {
                serversOverviewPage.table.selectAll();
                expect(serversOverviewPage.table.anyUnselected.isPresent()).to.eventually.be.false;
                expect(serversOverviewPage.table.anySelected.isPresent()).to.eventually.be.true;
            });

            it('should deselect all servers by checkbox', function () {
                serversOverviewPage.table.selectAll();
                serversOverviewPage.table.deselectAll();
                expect(serversOverviewPage.table.anyUnselected.isPresent()).to.eventually.be.true;
                expect(serversOverviewPage.table.anySelected.isPresent()).to.eventually.be.false;
            });

            it('should select all servers by link', function () {
                cbSelect.click();
                serversOverviewPage.table.eleBulkSelectAll.click();
                expect(serversOverviewPage.table.anyUnselected.isPresent()).to.eventually.be.false;
                expect(serversOverviewPage.table.anySelected.isPresent()).to.eventually.be.true;
            });

            it('should deselect all servers by link', function () {
                cbSelect.click();
                serversOverviewPage.table.eleBulkDeselectAll.click();
                expect(serversOverviewPage.table.anyUnselected.isPresent()).to.eventually.be.true;
                expect(serversOverviewPage.table.anySelected.isPresent()).to.eventually.be.false;
            });
        });
    });

    describe('Midway Tests', function () {
        var timePattern = /Nov \d{1,2}, 2013 @ \d{1,2}:\d{2} \(UTC[-+]\d{4}\)/;

        before(function () {
            loginPage.go();
            loginPage.loginLocalhost();
            serversOverviewPage.go();
        });

        afterEach(function () {
            browser.refresh();
        });

        it('should have the expected data for the selected server @dev', function () {
            serversOverviewPage.table.filterBy(nextGenServerName);

            serversOverviewPage.table.row(1).then(function (row) {
                expect(row).to.have.property('Gen', 'Next');
                expect(row).to.have.property('Status', 'ACTIVE');
                expect(row).to.have.property('name', nextGenServerName);
                expect(row).to.have.property('id', '2999ca73-f2d7-4275-ba45-84753332903b');
                expect(row).to.have.property('Flavor', '512 MB Standard');
                expect(row).to.have.property('Image (OS)', 'Red Hat Enterprise Linux 6.4');
                expect(row).to.have.property('Created').to.match(timePattern);
                expect(row).to.have.property('Region', 'ORD');
            });
        });

        it('should suspend selected nextgen servers @dev', function () {
            var servers = [
                { name: 'Kevin\'s Test Demo' },
            ];

            serversOverviewPage.table.selectServers(servers);
            serversOverviewPage.table.batchActionsMenu().expand().then(function (actions) {
                actions['Suspend Selected Servers'].click();
                serversOverviewPage.bulkSuspendModal.txtPassword = 'pass';
                serversOverviewPage.bulkSuspendModal.submit();
            });

            serversOverviewPage.bulkSuspendModal.table.data().then(function (rows) {
                expect(rows).to.not.be.empty;
                _.each(rows, function (row) {
                    expect(row['Status']).to.eql('Successfully suspended!');
                });
            });
        });

        it('should unsuspend selected nextgen servers @dev', function () {
            var servers = [
                { name: 'Suspended Server' },
            ];

            serversOverviewPage.table.selectServers(servers);
            serversOverviewPage.table.batchActionsMenu().expand().then(function (actions) {
                actions['Unsuspend Selected Servers'].click();
                serversOverviewPage.bulkSuspendModal.txtPassword = 'pass';
                serversOverviewPage.bulkSuspendModal.submit();
            });

            serversOverviewPage.bulkSuspendModal.table.data().then(function (rows) {
                expect(rows).to.not.be.empty;
                _.each(rows, function (row) {
                    expect(row['Status']).to.eql('Successfully unsuspended!');
                });
            });
        });

        it('should not suspend selected firstgen servers @dev', function () {
            var servers = [
                { name: 'slice110148310' }
            ];

            serversOverviewPage.table.selectServers(servers);
            serversOverviewPage.table.batchActionsMenu().expand().then(function (actions) {
                actions['Suspend Selected Servers'].click();
                var selectedServerRows = serversOverviewPage.bulkSuspendModal.table.data();
                expect(selectedServerRows).to.eventually.be.empty;
            });
        });

        it('should not unsuspend selected firstgen servers @dev', function () {
            var servers = [
                { name: 'slice110148310' }
            ];

            serversOverviewPage.table.selectServers(servers);
            serversOverviewPage.table.batchActionsMenu().expand().then(function (actions) {
                actions['Unsuspend Selected Servers'].click();
                var selectedServerRows = serversOverviewPage.bulkSuspendModal.table.data();
                expect(selectedServerRows).to.eventually.be.empty;
            });
        });

        it('should add a tag to servers to be migrated @dev', function () {
            serversOverviewPage.go();
            serversOverviewPage.table.filterBy(firstGenServerName);

            serversOverviewPage.table.row(1).then(function (row) {
                expect(row['Name (UUID)']).to.contain('**');
            });
        });

        it('should show the migration warning message @dev', function () {
            var warnTxt = 'This First Generation server will be converted to Next Generation soon ' +
                '(hover over server names to see specific dates).';
            var lnkHref = 'http://www.rackspace.com/knowledge_center/article/' +
                'next-generation-cloud-servers-migration-considerations-and-options';
            var lnkTxt = 'More info on server conversion and scheduling.';

            serversOverviewPage.go();
            expect(serversOverviewPage.lnkMigrationWarningHref).to.eventually.equal(lnkHref);
            expect(serversOverviewPage.lnkMigrationWarningTxt).to.eventually.equal(lnkTxt);
            expect(encore.rxNotify.all.exists(warnTxt)).to.eventually.be.true;
        });

        it('should display a warning on reboot if migration information found @dev', function () {
            var warnTxt = 'Note: Soft rebooting will convert this server to a Next Generation server.';
            var lnkHref = 'http://www.rackspace.com/knowledge_center/article/' +
                'next-generation-cloud-servers-migration-considerations-and-options';
            var lnkTxt = 'More info on server conversion and scheduling.';

            serversOverviewPage.go();
            serversOverviewPage.table.filterBy(firstGenServerName);

            serversOverviewPage.table.row(1).then(function (server) {
                server.actionMenu.action('Reboot Server').openModal();
                expect(serversOverviewPage.rebootServerModal.lnkMigrationWarningHref).to.eventually.equal(lnkHref);
                expect(serversOverviewPage.rebootServerModal.lnkMigrationWarningTxt).to.eventually.equal(lnkTxt);
                expect(encore.rxNotify.all.exists(warnTxt)).to.eventually.be.true;
            });
        });

        it('should show pending status for server in "PREP_RESCUE" @dev', function () {
            var serverName = 'Prep Rescue Server';
            serversOverviewPage.go();
            serversOverviewPage.table.filterBy(serverName);

            serversOverviewPage.table.row(1).then(function (server) {
                var statusClass = server['statusElement'].getAttribute('class');
                expect(statusClass).to.eventually.contain('status-PENDING');
            });
        });

        describe('Gen Select Filter', function () {
            before(function () {
                browser.refresh();
            });

            it('should load all servers by default @dev', function () {
                serversOverviewPage.table.getAllGenTypes.then(function (elements) {
                    var promises = _.map(elements, function (element) {
                        return element.getText();
                    });

                    protractor.promise.all(promises).then(function (gens) {
                        expect(_.uniq(gens)).to.eql(['Next', 'First']);
                    });
                });
            });

            it('should load FirstGen servers by only when selected from filter @dev', function () {
                selectFilter.multiSelectByLabel('Filter By Gen').openMenu();
                basePage.toggleRxSelectElement('First', true);
                basePage.toggleRxSelectElement('Next', false);
                serversOverviewPage.table.getAllGenTypes.then(function (elements) {
                    _.forEach(elements, function (element) {
                        expect(element.getText()).to.eventually.equal('First');
                    });
                });
            });

            it('should load NextGen servers by only when selected from filter @dev', function () {
                selectFilter.multiSelectByLabel('Filter By Gen').openMenu();
                basePage.toggleRxSelectElement('First', false);
                basePage.toggleRxSelectElement('Next', true);
                serversOverviewPage.table.getAllGenTypes.then(function (elements) {
                    _.forEach(elements, function (element) {
                        expect(element.getText()).to.eventually.equal('Next');
                    });
                });
            });
        });
    });

    describe('Pending Tests', function () {

        it.skip('should suspend selected firstgen servers #regression', function () {
            var servers = [
                { name: tf.firstGenBulk1.name },
                { name: tf.firstGenBulk2.name }
            ];

            serversOverviewPage.table.select(servers);
            serversOverviewPage.table.batchActionsMenu().actions.then(function (actions) {
                actions['Suspend Selected Servers'].click();
                serversOverviewPage.bulkSuspendModal.submit();
            });

            // no success message at this time
            // expect(encore.rxNotify.all.exists('message')).to.eventually.be.true;
        });

        it.skip('should unsuspend selected firstgen servers #regression', function () {
            var servers = [
                { name: tf.firstGenBulk1.name },
                { name: tf.firstGenBulk2.name }
            ];

            serversOverviewPage.table.select(servers);
            serversOverviewPage.table.batchActionsMenu().actions.then(function (actions) {
                actions['Unsuspend Selected Servers'].click();
                serversOverviewPage.bulkUnsuspendModal.submit();
            });

            // no success message at this time
            // expect(encore.rxNotify.all.exists('message')).to.eventually.be.true;
        });

        it.skip('should suspend selected nextgen servers #regression', function () {
            var servers = [
                { name: tf.nextGenBulk1.name },
                { name: tf.nextGenBulk2.name }
            ];

            serversOverviewPage.table.select(servers);
            serversOverviewPage.table.batchActionsMenu().actions.then(function (actions) {
                actions['Suspend Selected Servers'].click();
                serversOverviewPage.bulkSuspendModal.submit();
            });

            // no success message at this time
            // expect(encore.rxNotify.all.exists('message')).to.eventually.be.true;
        });

        it.skip('should unsuspend selected nextgen servers #regression', function () {
            var servers = [
                { name: tf.nextGenBulk1.name },
                { name: tf.nextGenBulk2.name }
            ];

            serversOverviewPage.table.select(servers);
            serversOverviewPage.table.batchActionsMenu().actions.then(function (actions) {
                actions['Unsuspend Selected Servers'].click();
                serversOverviewPage.bulkUnsuspendModal.submit();
            });

            // no success message at this time
            // expect(encore.rxNotify.all.exists('message')).to.eventually.be.true;
        });
    });
});

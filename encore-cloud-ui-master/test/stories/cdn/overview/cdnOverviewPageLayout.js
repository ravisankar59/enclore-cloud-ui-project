var cdnOverviewPage = require('../../../pages/cdn/overview');
var commonTests = require('../../common');

describe('Images Overview Page - Page Layout', function () {

    // If not in midway, we must change users before anything else
    if (!basePage.isInMidwayEnvironment()) {
        loginPage.switchToUser('cloudqe2', '708237');
    }

    var user = ptor.params.user;

    before(function () {
        cdnOverviewPage.go();
        basePage.setItemsPerPage(10);
    });

    var servicesTable = cdnOverviewPage.table.initialize($('table.services-list'));

    var expected = {
        url: ptor.baseUrl + cdnOverviewPage.url,
        breadcrumbs: ['Home', 'User ' + user, 'CDN Services', 'All CDN Services'],
        title: 'CDN Services',
        subtitle: new RegExp('(\\d+\\s)Services found for\\s' + user),
        table: {
            object: servicesTable,
            hasFloatingHeader: true,
            sort: {
                useRxSortableColumn: true,
                columns: {
                    'Status': {
                        sortProperty: 'Status',
                        dataFn: commonTests.dataFunctions.status,
                        selector: 'td.rx-status-column'
                    },
                    'Name': {
                        sortProperty: 'Name'
                    }
                },
                repeater: 'service in services'
            },
            root: servicesTable.tableRoot
        },
        display: {
            'user products sidebar': basePage.userProducts,
            'user details sidebar': basePage.userDetails,
            'cdn services table': servicesTable.tableRoot,
            'cdn services table pagination': servicesTable.tblPagination
        }
    };

    commonTests(expected);

    describe('Midway Tests', function () {
        var query = '00_kitchensink.com';
        var overviewTable, tblHeaders, row, rowData;

        before(function () {
            cdnOverviewPage.go();

            overviewTable = cdnOverviewPage.table.initialize($('table.services-list'));
            overviewTable.filterBy(query);
            tblHeaders = overviewTable.headers;
            row = overviewTable.rowFromElement(0);
            rowData = row.rowData();
        });

        it('should have the expected table headers', function () {
            var expectedHeaders = ['Status', 'Name', 'Domains', 'Origins', ''];
            expect(tblHeaders()).to.eventually.eql(expectedHeaders);
        });

        it('should have the expected data for the selected service @dev', function () {
            var expectedData = ['',
                                '00_kitchensink.com\n1a8e397f-a4cf-4071-b799-d5cb9301eeb3',
                                'test.fsfsmfsfsdfsdofsdcksite888.com\nblog.kitchensink.com',
                                'www.yahoo.com',
                                ''];

            expect(rowData).to.eventually.eql(expectedData);
        });

        it('should display not found error message @dev', function () {
            var errorMsg = 'Error loading CDN Services: Not Found';
            var noServicesUrl = ptor.baseUrl + '/cloud/323676/lost_cap/cdn/services';
            ptor.get(noServicesUrl);

            expect(encore.rxNotify.all.exists(errorMsg)).to.eventually.be.true;
        });

        it('should correctly display 403 error message @dev', function () {
            var errorMsg = 'Error loading CDN Services: Something went wrong with CDN, we ' +
                'couldn\'t find the error, please contact this service.';
            var errorUrl = ptor.baseUrl + '/cloud/323676/bad_cap/cdn/services';
            ptor.get(errorUrl);

            expect(encore.rxNotify.all.exists(errorMsg)).to.eventually.be.true;
        });

    });

    describe('Smoke Tests', function () {
        var overviewTable;

        before(function () {
            cdnOverviewPage.go();

            overviewTable = cdnOverviewPage.table.initialize($('table.services-list'));
        });

        it('should have correct columns ', function () {
            var expectedHeaders = ['Status', 'Name', 'Domains', 'Origins', ''];
            expect(overviewTable.headers()).to.eventually.eql(expectedHeaders);
        });

        it('should show error message if no user found ', function () {
            var tableMsg = 'No CDN Services were found.';

            if (!basePage.isInMidwayEnvironment()) {
                loginPage.switchToLastUser();
            } else {
                loginPage.switchToUser('bad_wolf', '123');
            }

            cdnOverviewPage.go();

            expect(overviewTable.errorRowText()).to.eventually.contain(tableMsg);
        });
    });
});

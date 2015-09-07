var lbaasHistoryPage = require('../../pages/lbaas/history.page');
var commonTests = require('../common');

describe('Load Balancer History Page - Page Layout', function () {

    before(function () {
        lbaasHistoryPage.go('57361/historicalusage');
    });

    var expected = {
        url: ptor.baseUrl + lbaasHistoryPage.url,
        breadcrumbs: ['Home', 'User ' + ptor.params.user, 'Load Balancers', 'Load Balancer Details',
            'Historical Usage'],
        title: 'Load Balancer:',
        table: {
            object: lbaasHistoryPage.historyTable,
            hasFloatingHeader: true,
            sort: {
                columns: {
                    'Name (ID)': 'id',
                    'Start Date': 'Start Date',
                    'End Date': 'End Date',
                    //Looks like flaky column. commenting for now
                    //'Polls': 'Polls',
                    'Avg Connections': 'Avg Connections',
                    'VIPs': 'VIPs',
                    // The BW columns sorting can't be tested with the current
                    // common sorting tests because they compare the on-screen values
                    // rather than the actual values, so '1.672 GB' is considered < '371.612 MB'.
                    // 'BW In': 'BW In',
                    // 'BW Out': 'BW Out'
                }
            }
        }
    };

    commonTests(expected);

    describe('Midway Tests', function () {

        describe('View Historical Usage Table @dev', function () {
            before(function () {
                lbaasHistoryPage.go('57361/historicalusage');
            });

            var historyTable = {
                display: {
                    'history usage table': lbaasHistoryPage.historyTable,
                },
                equal: {
                    'label above table | Historical Usage': lbaasHistoryPage.historyTable.tableHeader
                }
            };

            commonTests(historyTable);

            it('should match the headers within historical usage table @dev', function () {
                expect(lbaasHistoryPage.historyTable.headers).to.eventually.eql(['Name (ID)', 'Start Date',
                    'End Date', 'Polls', 'Avg Connections', 'VIPs', 'BW In', 'BW Out']);
            });

            it('should match the records within historical usage table @dev', function () {
                lbaasHistoryPage.historyTable.data().then(function (history) {

                    expect(history[0]).to.have.property('Name (ID)', '5644867');
                    expect(history[0]).to.have.property('Start Date').to.
                        match(/Jul \d{1,2}, 2015 @ \d{1,2}:\d{2} \(UTC[-+]\d{4}\)/);
                    expect(history[0]).to.have.property('End Date').to.
                        match(/Jul \d{1,2}, 2015 @ \d{1,2}:\d{2} \(UTC[-+]\d{4}\)/);
                    expect(history[0]).to.have.property('Polls', '9');
                    expect(history[0]).to.have.property('Avg Connections', '0');
                    expect(history[0]).to.have.property('VIPs', '1');
                    expect(history[0]).to.have.property('BW In', '652.854 MB');
                    expect(history[0]).to.have.property('BW Out', '371.612 MB');
				});
            });

            it('should match the record count within historical usage table @dev', function () {
                lbaasHistoryPage.historyTable.data().then(function (history) {
                    expect(history.length).to.equal(58);
				});
			});
        });

        describe('Date Range Filter', function () {
            beforeEach(function () {
                lbaasHistoryPage.go('57361/historicalusage');
            });

            it('should filter the table when you enter a date range', function () {
                lbaasHistoryPage.historyTable.tblHistoryUsageRows.count().then(function (count) {
                    lbaasHistoryPage.updateRangeFilter('07/25/15', '07/26/15');
                    expect(lbaasHistoryPage.historyTable.tblHistoryUsageRows.count())
                            .to.eventually.not.equal(count);
                });
            });

            it('should show message when not a valid date', function () {
                lbaasHistoryPage.updateRangeFilter('a', 'b');
                expect(lbaasHistoryPage.dateValidationError.isDisplayed()).to.eventually.be.true;
            });
            
            it('should show message when not a valid date range', function () {
                lbaasHistoryPage.updateRangeFilter('10/10/15', '07/07/15');
                expect(lbaasHistoryPage.dateRangeValidationError.isDisplayed())
                    .to.eventually.be.true;
            });
            
            it('should show message when to date exceeds current date', function () {
                lbaasHistoryPage.updateRangeFilter('07/25/15', '10/10/15');
                expect(lbaasHistoryPage.dateExceedValidationError.isDisplayed()).to.eventually.be.true;
            });

        });
    });
});

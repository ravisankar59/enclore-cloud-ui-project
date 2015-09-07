var networksOverviewPage = require('../../../pages/networks/overview');
var commonTests = require('../../common');

describe('Networks Overview Page - Page Layout', function () {

    before(function () {
        networksOverviewPage.go();
    });

    var expected = {
        url: ptor.baseUrl + networksOverviewPage.url,
        breadcrumbs: ['Home', 'User ' + ptor.params.user, 'Networks', 'All Networks'],
        title: 'Networks',
        subtitle: new RegExp('(\\d+\\s)Networks found for ' + ptor.params.user),
        display: {
            '"Create New Network" Link': networksOverviewPage.lnkCreateNewNetwork,
            'Account Info Banner': basePage.accountInfoBanner
        }
    };

    commonTests(expected);

    describe('Smoke Tests', function () {

        describe('Test Private Networks Tab', function () {
            before(function () {
                networksOverviewPage.showPrivateTab();
            });

            expected = {
                display: {
                    'Private Networks': networksOverviewPage.privateTable,
                },
                table: {
                    object: networksOverviewPage.privateTable,
                    hasFloatingHeader: true,
                    sort: {
                        columns: {
                            'Network ID': 'Network ID',
                            'Name': 'Name',
                            'CIDR': 'CIDR',
                            'Region': 'Region'
                        },
                    }
                }
            };
            commonTests(expected);
        });

        describe('Test Rackspace Networks Tab', function () {
            before(function () {
                networksOverviewPage.showRackspaceTab();
            });

            expected = {
                display: {
                    'Rackspace Networks': networksOverviewPage.rackspaceTable,
                    '"Go to Reach Networks" Link': networksOverviewPage.lnkReach
                },
                table: {
                    object: networksOverviewPage.rackspaceTable,
                    hasFloatingHeader: true,
                    sort: {
                        columns: {
                            'Network ID': 'Network ID',
                            'Name': 'Name',
                            'CIDR': 'CIDR',
                            'Region': 'Region'
                        },
                    }
                }
            };
            commonTests(expected);
        });

        it('should have correct headers for private networks table', function () {
            var expectedHeaders = ['Status', 'Network ID', 'Name', 'CIDR', 'Region', ''];
            networksOverviewPage.showPrivateTab();
            expect(networksOverviewPage.privateTable.headers).to.eventually.eql(expectedHeaders);
        });

        it('should have correct headers for rackspace networks table', function () {
            var expectedHeaders = ['Status', 'Network ID', 'Name', 'CIDR', 'Region', ''];
            networksOverviewPage.showRackspaceTab();
            expect(networksOverviewPage.rackspaceTable.headers).to.eventually.eql(expectedHeaders);
        });
    });
});

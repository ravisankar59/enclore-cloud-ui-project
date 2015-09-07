var dbaasOverviewPage = require('../../../pages/dbaas/overview');
var commonTests = require('../../common');
var breadcrumbs = basePage.breadcrumbs;

describe('Database Instances Page - Page Layout', function () {

    before(function () {
        dbaasOverviewPage.go();
    });

    var expected = {
        url: ptor.baseUrl + dbaasOverviewPage.url,
        breadcrumbs: ['Home', 'User ' + ptor.params.user, 'Instances', 'All Database Instances'],
        title: 'Database Instances',
        table: {
            object: dbaasOverviewPage.table,
            hasFloatingHeader: true,
            sort: {
                empty: {
                    'Name': 'N/A',
                    'RAM': 'N/A'
                },
                columns: {
                    'Status': 'Status',
                    'Name': 'Name',
                    'Instance ID': 'Instance ID',
                    'Volume Size': 'size',
                    'RAM': 'RAM',
                    'Region': 'Region'
                }
            }
        },
        display: {
            'the instances table': dbaasOverviewPage.table,
            '"Create New Instance" Link': dbaasOverviewPage.createInstanceLink,
            '"Go to Reach Databases" Link': dbaasOverviewPage.lnkReach,
            'Account Info Banner': basePage.accountInfoBanner
        }
    };

    commonTests(expected);

    describe('Midway Tests', function () {
        var query = {
            name: 'test_instance',
            id: 'f46c9c04-32f7-4e81-ab73-a1446b0576ad',
            Region: 'STAGING'
        };
        var filter = query.name;

        before(function () {
            dbaasOverviewPage.go();
            basePage.dismissPageStatus();
        });

        it('should have the expected data for the selected instance @dev', function () {

            dbaasOverviewPage.table.findInstance(query, filter).then(function (database) {
                expect(database).to.have.property('Status', 'ACTIVE');
                expect(database).to.have.property('Name', query.name);
                expect(database).to.have.property('Instance ID', query.id);
                expect(database).to.have.property('Volume Size', '8 GB');
                expect(database).to.have.property('RAM', '512MB Instance');
                expect(database).to.have.property('Region', query.region);
            });
        });

        it('should have the N/A data for the selected instance with blank/null values @dev', function () {
            var query = {
                id: '7c227e01-50ad-4fe3-a3c6-d1b6fddf578a',
                Region: 'STAGING'
            };
            var filter = query.id;
            dbaasOverviewPage.go();
            basePage.dismissPageStatus();

            dbaasOverviewPage.table.findInstance(query, filter).then(function (database) {
                expect(database).to.have.property('Status', 'ACTIVE');
                expect(database).to.have.property('Name', 'N/A');
                expect(database).to.have.property('Instance ID', query.id);
                expect(database).to.have.property('Volume Size', '0 GB');
                expect(database).to.have.property('RAM', 'N/A');
                expect(database).to.have.property('Region', query.region);
            });
        });

    });

    describe('Smoke Tests', function () {

        it('should take you back to the instances page using the breadcrumbs', function () {
            breadcrumbs.getBreadcrumbs().then(function (breadcrumbs) {
                breadcrumbs['Instances'].visit();
            });

            expect(dbaasOverviewPage.currentUrl).to.eventually.equal(ptor.baseUrl + dbaasOverviewPage.url);
            dbaasOverviewPage.go();
        });

        it('should have correct headers for Instances table', function () {
            var expectedHeaders = ['Status', 'Name', 'Instance ID', 'Volume Size', 'RAM', 'Region', ''];
            expect(dbaasOverviewPage.table.headers).to.eventually.eql(expectedHeaders);
        });

        it('should link to a DB Instance on the table', function () {
            dbaasOverviewPage.table.row(1).then(function (row) {
                var user = ptor.params.user;
                var accountNumber = ptor.params.accountNumber;
                var expectedUrl = ptor.baseUrl + '/cloud/' + accountNumber + '/' + user +
                    '/databases/instances/' + row['Region'] + '/' + row['Instance ID'];
                row.viewDetails();

                expect(dbaasOverviewPage.currentUrl).to.eventually.eql(expectedUrl);
                dbaasOverviewPage.go();
            });
        });
    });
});

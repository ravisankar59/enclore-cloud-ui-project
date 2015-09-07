var cdnDetailsPage = require('../../../pages/cdn/details');
var commonTests = require('../../common');

describe('CDN Details Page - Page Layout', function () {

    // If not in midway, we must change users before anything else
    if (!basePage.isInMidwayEnvironment()) {
        loginPage.switchToUser('cloudqe2', '708237');
    }

    var user = ptor.params.user;

    var cdn = {
        'localhost': '00_kitchensink.com',
        'preprod': 'Kacie is Awesome',
        'prod': 'Kacie is Awesome'
    };

    var query = { name: cdn[ptor.params.env] || cdn['localhost'] };
    var filter = query.name;

    before(function () {
        cdnDetailsPage.open(query, filter);
    });

    var tables = {
        details: $('rx-metadata.service-metadata'),
        origins: $('.service-origins'),
        caching: $('.service-caching'),
        restrictions: $('.service-restrictions')
    };

    var expected = {
        url: ptor.baseUrl + cdnDetailsPage.url,
        breadcrumbs: ['Home', 'User ' + user, 'CDN Services', 'CDN Service Details'],
        title: 'CDN Service',
        display: {
            'user products sidebar': basePage.userProducts,
            'user details sidebar': basePage.userDetails,
            'cdn details table': tables.details,
            'cdn origins table': tables.origins,
            'cdn caching table': tables.caching,
            'cdn restrictions table': tables.restrictions,
        }
    };

    commonTests(expected);

    describe('Midway Tests', function () {

        before(function () {
            cdnDetailsPage.open(query, filter);
        });

        describe('Details Table', function () {
            it('should list correct cdn details @dev', function () {
                cdnDetailsPage.cdnDetails().then(function (details) {
                    expect(details[0]).to.eql('Service Status:\nDeployed');
                    expect(details[1]).to.eql('ID:\n1a8e397f-a4cf-4071-b799-d5cb9301eeb3');
                });
            });
        });

        describe('Origins Table', function () {
            var originsTable, tblHeaders, row, rowData, subTable, subRows = [];

            before(function () {
                originsTable = cdnDetailsPage.table.initialize(tables.origins);
                tblHeaders = originsTable.headers();
                row = originsTable.rowFromElement(0);
                rowData = row.rowData();

                row.toggle().then(function () {
                    subTable = row.subtable;
                    subRows.push(subTable.rowFromElement(0));
                    subRows.push(subTable.rowFromElement(1));
                });
            });

            it('should have the correct columns @dev', function () {
                var expectedHeaders = ['Origin', 'Port', 'SSL?', 'Rules', ''];
                expect(tblHeaders).to.eventually.eql(expectedHeaders);
            });
            it('should have the correct data @dev', function () {
                var expectedData = ['www.yahoo.com', '80', 'no', '', ''];
                expect(rowData).to.eventually.eql(expectedData);
            });
            it('should have the correct subtable columns @dev', function () {
                var expectedHeaders = ['Rule Name', 'Applied Path', ''];
                expect(subTable.headers()).to.eventually.eql(expectedHeaders);
            });
            it('should have the correct subtable data @dev', function () {
                var expectedDataRow1 = ['Default Origin', '/', ''];
                var expectedDataRow2 = ['Videos', '/videos/*.mp4', ''];
                expect(subRows[0].rowData()).to.eventually.eql(expectedDataRow1);
                expect(subRows[1].rowData()).to.eventually.eql(expectedDataRow2);
            });
        });

        describe('Caching Table', function () {
            var cachingTable, tblHeaders, row, rowData, subTable, subRows = [];

            before(function () {
                cachingTable = cdnDetailsPage.table.initialize(tables.caching);
                tblHeaders = cachingTable.headers();
                row = cachingTable.rowFromElement(2);
                rowData = row.rowData();

                row.toggle().then(function () {
                    subTable = row.subtable;
                    subRows.push(subTable.rowFromElement(0));
                });
            });

            it('should have the correct columns @dev', function () {
                var expectedHeaders = ['Name', 'TTL', 'Rules', ''];
                expect(tblHeaders).to.eventually.eql(expectedHeaders);
            });
            it('should have the correct data @dev', function () {
                var expectedData = ['Medium Cache', '1800 seconds', '', ''];
                expect(rowData).to.eventually.eql(expectedData);
            });
            it('should have the correct subtable columns @dev', function () {
                var expectedHeaders = ['Rule Name', 'Applied Path', ''];
                expect(subTable.headers()).to.eventually.eql(expectedHeaders);
            });
            it('should have the correct subtable data @dev', function () {
                var expectedData = ['Content Feed', '/atom.xml', ''];
                expect(subRows[0].rowData()).to.eventually.eql(expectedData);
            });
        });

        describe('Restrictions Table', function () {
            var restrictionsTable, tblHeaders, row, rowData, subTable, subRows = [];

            before(function () {
                restrictionsTable = cdnDetailsPage.table.initialize(tables.restrictions);
                tblHeaders = restrictionsTable.headers();
                row = restrictionsTable.rowFromElement(0);
                rowData = row.rowData();

                row.toggle().then(function () {
                    subTable = row.subtable;
                    subRows.push(subTable.rowFromElement(0));
                });
            });

            it('should have the correct columns @dev', function () {
                var expectedHeaders = ['Name', 'Rules', ''];
                expect(tblHeaders).to.eventually.eql(expectedHeaders);
            });
            it('should have the correct data @dev', function () {
                var expectedData = ['website only', '', ''];
                expect(rowData).to.eventually.eql(expectedData);
            });
            it('should have the correct subtable columns @dev', function () {
                var expectedHeaders = ['Rule Name', 'Referrer', ''];
                expect(subTable.headers()).to.eventually.eql(expectedHeaders);
            });
            it('should have the correct subtable data @dev', function () {
                var expectedData = ['mocksite.com', 'www.mocksite.com', ''];
                expect(subRows[0].rowData()).to.eventually.eql(expectedData);
            });
        });
    });
});

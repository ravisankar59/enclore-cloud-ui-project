var snapshotsPage = require('../../../../pages/cbs/snapshots/overview');
var commonTests = require('../../../common');

describe('Block Storage Snapshots - Overview Layout', function () {
    var user = ptor.params.user;

    before(function () {
        snapshotsPage.go();
    });

    var expected = {
        url: ptor.baseUrl + snapshotsPage.url,
        breadcrumbs: ['Home', 'User ' + user, 'Cloud Block Storage', 'All Snapshots'],
        title: 'Block Storage Snapshots',
        subtitle: new RegExp('\\d+\\sSnapshots found for ' + user),
        table: {
            object: snapshotsPage.table,
            hasFloatingHeader: true,
            sort: {
                empty: {
                    'Status': 'N/A',
                    'Name/ID': 'N/A',
                    'Volume': 'N/A',
                    'Created/Age': 'N/A',
                    'Size': 'N/A',
                    'Region': 'N/A'
                },
                columns: {
                    'Status': 'Status',
                    'Name/ID': 'name',
                    'Volume': 'Volume',
                    'Created/Age': 'created_on',
                    'Size': 'size',
                    'Region': 'Region'
                }
            }
        },
        display: {
            'user products sidebar': basePage.userProducts,
            'user details sidebar': basePage.userDetails,
            'snapshots table': snapshotsPage.table,
            'server table pagination': snapshotsPage.table.tblPagination,
            '"Go to Reach Snapshots" Link': snapshotsPage.lnkReach,
            'Account Info Banner': basePage.accountInfoBanner
        },
        paginate: {
            'div.rx-paginate': 1
        }
    };

    commonTests(expected);

    describe('Midway Tests', function () {
    
        it('should display N/A to the volume and name when storage snapshots has no value @dev', function () {
            var query = { id: 'a82760a0-aa03-40a1-ad7e-ffffffffffff' };
            var filter = query.id;
            snapshotsPage.go();
            basePage.dismissPageStatus();

            snapshotsPage.table.findSnapshot(query, filter).then(function (snapshot) {
                expect(snapshot).to.have.property('Size', '0 GB');
                expect(snapshot).to.have.property('name', 'N/A');
                expect(snapshot).to.have.property('id', query.id);
                expect(snapshot).to.have.property('Volume', 'N/A');

            });
        });
    });
    describe('Smoke Tests', function () {

        it('should have correct columns', function () {
            var expectedHeaders = ['Status', 'Name/ID', 'Volume', 'Created/Age', 'Size', 'Region', ''];
            snapshotsPage.go();
            expect(snapshotsPage.table.headers).to.eventually.eql(expectedHeaders);
        });

        it('should show error message if no user found', function () {
            var msg = 'Snapshots: ';
            ptor.get(ptor.baseUrl + '/cloud/123/bad_wolf/cbs/snapshots/');
            expect(encore.rxNotify.all.exists(msg, 'error')).to.eventually.be.true;
        });

    });

});

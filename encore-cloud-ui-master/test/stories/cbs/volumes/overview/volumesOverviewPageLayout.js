var volumesOverviewPage = require('../../../../pages/cbs/volumes/overview');
var volumeDetailsPage = require('../../../../pages/cbs/volumes/details');
var createSnapshotModal = require('../../../../pages/cbs/modals/createSnapshot');
var commonTests = require('../../../common');
var tf = require('../../../../pages/test-fixtures/ui');

describe('Block Storage Volumes - Overview Layout', function () {

    var user = ptor.params.user;
    var accountNumber = loginPage.driver.params.accountNumber;

    before(function () {
        volumesOverviewPage.go();
    });

    var expected = {
        url: ptor.baseUrl + volumesOverviewPage.url,
        breadcrumbs: ['Home', 'User ' + user, 'Cloud Block Storage', 'All Volumes'],
        title: 'Block Storage Volumes',
        subtitle: new RegExp('(\\d+\\s)Volumes found for ' + user),
        table: {
            object: volumesOverviewPage.table,
            hasFloatingHeader: true,
            sort: {
                empty: {
                    'Name/ID': 'N/A',
                    'Created/Age': 'N/A',
                    'Snapshots': 'N/A',
                    'Attached To': 'N/A',
                    'Type': 'N/A'

                },
                columns: {
                    'Status': 'Status',
                    'Name/ID': 'name',
                    /* Cannot test Attached To sorting because the common tests sort test
                     * only understands strings.
                    'Attached To': 'Attached To', */
                    'Created/Age': 'created_on',
                    'Region': 'Region',
                    'Snapshots': 'snapshots_count',
                    'Type': 'Type',
                    'Size': 'size'
                }
            }
        },
        display: {
            'user products sidebar': basePage.userProducts,
            'user details sidebar': basePage.userDetails,
            'volumes table': volumesOverviewPage.table,
            'volumes table pagination': volumesOverviewPage.table.tblPagination,
            'link to create volume': volumesOverviewPage.lnkCreateVolume,
            '"Go to Reach Volumes" Link': volumesOverviewPage.lnkReach,
            'Account Info Banner': basePage.accountInfoBanner
        },
        paginate: {
            'div.rx-paginate': 1
        }
    };
    commonTests(expected);

    describe('Smoke Tests', function () {

        it('should have correct columns', function () {
            var expectedHeaders = ['Status', 'Name/ID', 'Attached To', 'Created/Age', 'Snapshots', 'Region',
                'Type', 'Size', ''
            ];
            volumesOverviewPage.go();
            expect(volumesOverviewPage.table.headers).to.eventually.eql(expectedHeaders);
        });

        it('should show error message if no user found', function () {
            var msg = 'No Block Storage Volumes have been created.';
            ptor.get(ptor.baseUrl + '/cloud/123/bad_wolf/cbs/volumes/');
            expect(volumesOverviewPage.table.errorRowText).to.eventually.contain(msg);
        });
    });

    describe('Regression Tests', function () {

        it('should allow a racker to link to a SATA Volume #regression', function () {
            var query = {
                name: tf.sataVolume.name
            };
            var filter = query.name;
            volumesOverviewPage.go();
            volumesOverviewPage.table.viewVolumeDetails(query, filter);
            expect(volumeDetailsPage.eleDetailsTable.isDisplayed()).to.eventually.be.true;
        });

        it('should allow a racker to link to a SSD Volume #regression', function () {
            var query = {
                name: tf.ssdVolume.name
            };
            var filter = query.name;
            volumesOverviewPage.go();
            volumesOverviewPage.table.viewVolumeDetails(query, filter);
            expect(volumeDetailsPage.eleDetailsTable.isDisplayed()).to.eventually.be.true;
        });
    });

    describe('Create Snapshot Modal Layout', function () {

        before(function () {
            volumesOverviewPage.go();
            volumesOverviewPage.table.row(1).then(function (row) {
                row.Actions.expand().then(function (actions) {
                    actions['Create Snapshot'].click();
                });
            });
        });

        after(function () {
            createSnapshotModal.btnSnapshotCancel.click();
        });

        var snapshotModal = {
            display: {
                'snapshot name field': createSnapshotModal.txtSnapshotName,
                'snapshot description field': createSnapshotModal.txtSnapshotDescription,
                'snapshot force mount selection box': createSnapshotModal.selSnapshotForce
            }
        };

        commonTests(snapshotModal);
    });

    describe('Midway Tests', function () {

        it('should display N/A as the volume name when storage volume has no name @dev', function () {
            volumesOverviewPage.go();
            volumesOverviewPage.table.row(1).then(function (row) {
                expect(row.name).to.contain('N/A');
            });
        });

        it('should link to the storage volume even if it has no name @dev', function () {
            volumesOverviewPage.go();
            volumesOverviewPage.table.row(1).then(function (row) {
                var expectedUrl = ptor.baseUrl + '/cloud/' + accountNumber + '/' + user +
                    '/cbs/volumes/' + row.region + '/' + row.id;
                expect(row.link).to.eventually.equal(expectedUrl);
            });
        });

        it('should have error status for volume in ERROR_DELETING @dev', function () {
            var volumeName = 'ERROR-DELETING volume';
            volumesOverviewPage.go();
            volumesOverviewPage.table.filterBy(volumeName);

            volumesOverviewPage.table.row(1).then(function (volume) {
                var statusClass = volume['statusElement'].getAttribute('class');
                expect(statusClass).to.eventually.contain('status-ERROR ');
            });
        });

        it('should have the expected N/A data for the selected volume @dev', function () {
            var query = {
                name: 'N/A',
                id: 'd989194e-940b-447e-ac12-ffffffffffff',
                Region: 'ORD'
            };
            var filter = query.id;
            volumesOverviewPage.go();
            basePage.dismissPageStatus();
            volumesOverviewPage.table.findVolume(query, filter).then(function (volume) {
                expect(volume).to.have.property('Status', 'AVAILABLE');
                expect(volume).to.have.property('Region', query.Region);
                expect(volume).to.have.property('Attached To', 'N/A');
                expect(volume).to.have.property('Size', '0 GB');
                expect(volume).to.have.property('Snapshots', '0');
                expect(volume).to.have.property('Type', 'N/A');
                expect(volume).to.have.property('name', 'N/A');
                expect(volume).to.have.property('id', query.id);

            });
        });

    });

});

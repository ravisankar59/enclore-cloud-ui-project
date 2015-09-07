var createVolumePage = require('../../../../pages/cbs/volumes/create');
var volumesOverviewPage = require('../../../../pages/cbs/volumes/overview');
var commonTests = require('../../../common');
var user = ptor.params.user;

describe('Block Storage Volumes - Create Layout', function () {

    before(function () {
        createVolumePage.go();
    });

    var expected = {
        url: ptor.baseUrl + createVolumePage.url,
        breadcrumbs: ['Home', 'User ' + user, 'Cloud Block Storage', 'Create New Volume'],
        title: 'Create a New Volume',
        display: {
            'user products sidebar': basePage.userProducts,
            'user details sidebar': basePage.userDetails,
            'Create Volume Name textbox': createVolumePage.txtVolumeName,
            'Create Volume Description textbox': createVolumePage.txtVolumeDescription,
            'Create Volume Size textbox': createVolumePage.txtVolumeSize,
            'Create Volume Type dropdown': createVolumePage.selVolumeType,
            'Create Volume Region dropdown': createVolumePage.selVolumeRegion,
            'Create Volume Region dropdown description': createVolumePage.selVolumeRegionDescription,
            'Create Volume Create button': createVolumePage.btnCreateVolume,
            'Create Volume Cancel button': createVolumePage.btnCancelVolume
        }
    };
    commonTests(expected);

    describe('Midway Tests', function () {
        var snapshotId, datePattern;

        before(function () {
            datePattern = /Aug \d{2}, 2014 @ \d{1,2}:\d{2} \(UTC[+-]\d{4}\)/;
            snapshotId = '2fff15f3-9471-409f-a75d-3eebc2f31ea5';
        });

        it('should have the expected data in the Snapshots table @dev', function () {
            createVolumePage.selVolumeSpecifySnapshot = 'Select a snapshot';
            createVolumePage.findSnapshot(snapshotId).then(function (snapshot) {
                expect(snapshot).to.have.property('id', snapshotId);
                expect(snapshot).to.have.property('name', 'DFW-TEST');
                expect(snapshot).to.have.property('Volume', '6de44ac6-99af-4694-8352-89c8b6b8ed19');
                expect(snapshot).to.have.property('Size', '100 GB');
                // TODO this is going to fail every time since the date keeps changing
                // more comments: https://jira.rax.io/browse/EN-934
                // expect(details['Age']).to.equal('135D');
                expect(snapshot).to.have.property('created').that.match(datePattern);
            });
        });
    });

    describe('Smoke Tests', function () {

        it('should take you back to the volumes page using the breadcrumbs', function () {
            basePage.breadcrumbs.getBreadcrumbs().then(function (breadcrumbs) {
                breadcrumbs['Cloud Block Storage'].visit();
            });

            expect(createVolumePage.currentUrl).to.eventually.equal(ptor.baseUrl + volumesOverviewPage.url);
            createVolumePage.go();
        });

        it('should auto-populate Volume Type to \'SATA\'', function () {
            expect(createVolumePage.selVolumeType.getAttribute('value')).to.eventually.equal('SATA');
        });

        it('should auto-populate Volume Region to \'ORD\'', function () {
            expect(createVolumePage.selVolumeRegion.getAttribute('value')).to.eventually.equal('ORD');
        });

        it('should have the correct columns on the Snapshots table', function () {
            createVolumePage.selVolumeSpecifySnapshot = 'Select a snapshot';
            var expectedHeaders = ['', 'Name/ID', 'Volume', 'Created/Age', 'Size', 'Region'];
            expect(createVolumePage.snapshotsHeaders).to.eventually.eql(expectedHeaders);
        });
    });
});

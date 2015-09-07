var volumeDetailsPage = require('../../../../pages/cbs/volumes/details');
var volumesOverviewPage = require('../../../../pages/cbs/volumes/overview');
var attachVolumeModal = require('../../../../pages/cbs/modals/attachVolume');
var createSnapshotModal = require('../../../../pages/cbs/modals/createSnapshot');
var tf = require('../../../../pages/test-fixtures/ui');
var breadcrumbs = basePage.breadcrumbs;
var commonTests = require('../../../common');

describe('Block Storage Volumes - Details Layout', function () {
    var user = ptor.params.user;
    var attachedVolume, nonExistingVolumeId, unattachedVolume, query, filter, notAvilableVolume;
    var timePattern = /Nov \d{1,2}, 2013 @ \d{1,2}:\d{2} \(UTC[-+]\d{4}\)/;

    before(function () {
        nonExistingVolumeId = '21d811b5-ff93-4d38-b19c-4b913af5fbca';
        unattachedVolume = '88e4605a-80ae-409a-92f0-2a5b8c04a5de';
        attachedVolume = '10225e08-a4bd-49fb-9237-ce1b7eaaddb2';
        notAvilableVolume = 'd989194e-940b-447e-ac12-ffffffffffff';
        query = { name: tf.sataVolume.name };
        filter = query.name;

        if (basePage.isInMidwayEnvironment()) {
            return volumeDetailsPage.go(unattachedVolume);
        }

        volumeDetailsPage.open(query, filter);
    });

    var commonArgs = {
        url: ptor.baseUrl + volumeDetailsPage.url,
        breadcrumbs: ['Home', 'User ' + user, 'Cloud Block Storage', 'Volume Details'],
        title: /Volume: \w/,
        subtitle: /ID:\s(\d|[a-f])+-(\d|[a-f])+-(\d|[a-f])+-(\d|[a-f])+-(\d|[a-f])+/,
        table: {
            object: volumeDetailsPage.snapshotsTable,
            sort: {
                columns: {
                    'Status': 'Status',
                    'Name/ID': 'name',
                    'Description': 'description',
                    'Size': 'size',
                    'Created/Age': 'created_on'
                }
            }
        },
        display: {
            'user products sidebar': basePage.userProducts,
            'user details sidebar': basePage.userDetails,
            'volume details table': volumeDetailsPage.eleDetailsTable,
            'volume snapshots table': volumeDetailsPage.snapshotsTable,
            'link to create snapshot': volumeDetailsPage.btnCreateSnapshot,
            'link to delete button': volumeDetailsPage.btnDeleteVolume,
            'Account Info Banner': basePage.accountInfoBanner
        }
    };

    commonTests(commonArgs);

    describe('Smoke Tests', function () {

        it('should have correct headers on snapshots table', function () {
            var expectedHeaders = ['Status', 'Name/ID', 'Description', 'Size', 'Created/Age', ''];
            expect(volumeDetailsPage.snapshotsTable.headers).to.eventually.eql(expectedHeaders);
        });

        it('should take you back to the volumes page using the breadcrumbs', function () {
            breadcrumbs.getBreadcrumbs().then(function (breadcrumbs) {
                breadcrumbs['Cloud Block Storage'].visit();

            });
            expect(volumeDetailsPage.currentUrl).to.eventually.equal(ptor.baseUrl + volumesOverviewPage.url);

            if (basePage.isInMidwayEnvironment()) {
                volumeDetailsPage.go(attachedVolume);
            } else {
                volumeDetailsPage.open(query, filter);
            }
        });
    });

    describe('Midway Tests', function () {

        it('should list correct volume details @dev', function () {
            // (TODO): How to test increasing duration
            volumeDetailsPage.go(attachedVolume);
            volumeDetailsPage.volumeDetails().then(function (details) {
                expect(details[0]).to.eql('Description:\nthis is a test volume');
                expect(details[1]).to.eql('Attached To:\n"Server123" - 2999ca73-f2d7-4275-ba45-84753332903b');
                expect(details[2]).to.eql('Attachment Location:\n/dev/xvdb');
                expect(details[3]).to.eql('Status:\nAvailable');
                expect(details[4]).to.eql('Size:\n100 GB');
                expect(details[5]).to.eql('Type:\nSATA');
                expect(details[6]).to.eql('Availablity Zone:\nNova');
                expect(details[7]).to.eql('Created from Snapshot:\nN/A');
                // expect(details[8]).to.eql('Age:\nN/A');
                expect(details[9]).to.match(timePattern).to.contain('Created:\n');
            });
        });

        it('should show error message if no volume found @dev', function () {
            volumeDetailsPage.go(nonExistingVolumeId);
            expect(encore.rxNotify.all.exists('Error loading')).to.eventually.be.true;
        });

        it('should display "N/A" if volume is not attached @dev', function () {
            volumeDetailsPage.go(unattachedVolume);
            volumeDetailsPage.volumeDetails().then(function (details) {
                expect(details[0]).to.eql('Description:\nN/A');
                expect(details[1]).to.eql('Attached To:\nN/A');
                expect(details[2]).to.eql('Attachment Location:\nN/A');
                expect(details[3]).to.eql('Status:\nAvailable');
                expect(details[4]).to.eql('Size:\n1 TB');
                expect(details[5]).to.eql('Type:\nSATA');
                expect(details[6]).to.eql('Availablity Zone:\nNova');
                expect(details[7]).to.eql('Created from Snapshot:\nN/A');
                // expect(details[8]).to.eql('Age:\nN/A');
                expect(details[9]).to.match(timePattern).to.contain('Created:\n');
            });
        });

        it('should display "N/A", if volume details are null @dev', function () {
            volumeDetailsPage.go(notAvilableVolume);
            volumeDetailsPage.volumeDetails().then(function (details) {
                expect(details[0]).to.equal('Description:\nN/A');
                expect(details[1]).to.equal('Attached To:\nN/A');
                expect(details[2]).to.equal('Attachment Location:\nN/A');
                expect(details[3]).to.equal('Status:\nN/A');
                expect(details[4]).to.equal('Size:\nN/A');
                expect(details[5]).to.equal('Type:\nN/A');
                expect(details[6]).to.equal('Availablity Zone:\nN/A');
                expect(details[7]).to.equal('Created from Snapshot:\nN/A');
                expect(details[8]).to.equal('Age:\nN/A');
                expect(details[9]).to.equal('Created:\nN/A');
            });
        });

    });

    describe('Regression Tests', function () {
        it('should list correct volume details #regression', function () {
            var volQuery = { name: tf.ssdVolume.name };
            var volFilter = volQuery.name;

            volumeDetailsPage.open(volQuery, volFilter);
            volumeDetailsPage.volumeDetails().then(function (details) {
                expect(details).to.have.property('Description', tf.ssdVolume.description);
                expect(details).to.have.property('Size').to.contain(tf.ssdVolume.size);
                expect(details).to.have.property('Type').to.contain(tf.ssdVolume.type);
            });
        });
    });

    describe('Create Snapshot Modal Layout', function () {

        before(function () {
            if (basePage.isInMidwayEnvironment()) {
                volumeDetailsPage.go(attachedVolume);
            } else {
                volumeDetailsPage.open(query, filter);
            }
            volumeDetailsPage.btnCreateSnapshot.click();
        });

        var modalExpected = {
            display: {
                'the snapshot name textbox': createSnapshotModal.txtSnapshotName,
                'the snapshot description textbox': createSnapshotModal.txtSnapshotDescription,
                'the snapshot force dropdown': createSnapshotModal.selSnapshotForce
            }
        };

        commonTests(modalExpected);
    });

    describe('Attach Volume Modal Layout', function () {

        before(function () {
            query = { name: tf.sataVolumeAttach.name };
            filter = query.name;

            if (basePage.isInMidwayEnvironment()) {
                volumeDetailsPage.go(unattachedVolume);
            } else {
                volumeDetailsPage.open(query, filter);
            }
            volumeDetailsPage.lnkAttachVolume.click();
        });

        var modalExpected = {
            display: {
                'the server name dropdown': attachVolumeModal.selServerName,
                'the server device path': attachVolumeModal.selDevicePath
            }
        };

        commonTests(modalExpected);
    });
});

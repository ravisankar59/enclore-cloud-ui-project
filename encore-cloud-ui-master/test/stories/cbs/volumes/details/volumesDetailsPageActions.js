var volumeDetailsPage = require('../../../../pages/cbs/volumes/details');
var volumesOverviewPage = require('../../../../pages/cbs/volumes/overview');
var tf = require('../../../../pages/test-fixtures/ui');
var api = require('../../../../api-helper/api');

describe('Block Storage Volumes - Details Actions', function () {

    var user;
    before(function () {
        user = ptor.params.user;
        volumesOverviewPage.go();
        basePage.disableRxNotifyTimeout();
    });

    describe('Midway Tests', function () {
        var attachedVolume = '10225e08-a4bd-49fb-9237-ce1b7eaaddb2';
        var unattachedVolume = '128124a8-e2e0-4107-b56b-8b7572af2c58';
        var cloudControlUrl = 'cloudcontrol.staging.us.ccp.rackspace.net';

        it('should have non-active servers disabled @dev', function () {
            volumeDetailsPage.go(unattachedVolume);

            volumeDetailsPage.lnkAttachVolume.click();
            var servers = volumeDetailsPage.attachVolumeModal.tblServerOptions;
            servers.then(function (options) {
                expect(options[2].isEnabled()).to.eventually.be.false;
                expect(options[3].isEnabled()).to.eventually.be.true;
            });
            volumeDetailsPage.attachVolumeModal.close();
        });

        it('should allow you to attach a volume when unattached @dev', function () {
            var serverName = 'Kevin\'s Test Demo';
            var mntPath = '/dev/xvdb';
            var successMessage = 'Successfully submitted request to attach volume.';

            volumeDetailsPage.go(unattachedVolume);
            basePage.disableRxNotifyTimeout();

            volumeDetailsPage.attachVolume(serverName, mntPath);

            expect(encore.rxNotify.all.exists(successMessage)).to.eventually.be.true;
            basePage.dismissPageStatus();
        });

        it('should allow you to detach a volume from top @dev', function () {
            var successMessage = 'Successfully submitted request to detach volume.';

            volumeDetailsPage.go(attachedVolume);
            basePage.disableRxNotifyTimeout();

            volumeDetailsPage.detachVolumeByAction();

            expect(encore.rxNotify.all.exists(successMessage)).to.eventually.be.true;
            basePage.dismissPageStatus();
        });

        it('should not allow you to delete a volume when attached @dev', function () {
            expect(ptor.isElementPresent(protractor.By.linkText('Delete Volume'))).to.eventually.be.false;
        });

        it('should allow you to delete a volume when unattached @dev', function () {
            //go to page w/o attachment
            volumeDetailsPage.go(unattachedVolume);
            volumeDetailsPage.deleteVolume();

            // should be back on main page
            expect(volumeDetailsPage.currentUrl).to.eventually.equal(ptor.baseUrl + volumesOverviewPage.url);
        });

        it('should allow you to open the volume details in Cloud Control @dev', function () {
            volumeDetailsPage.go(attachedVolume);
            volumeDetailsPage.lnkForceDetach.click();
            expect(basePage.newWindowUrl).to.eventually.contain(cloudControlUrl);
        });
    });

    describe('Midway Snapshot Tests', function () {
        var attachedVolume = '10225e08-a4bd-49fb-9237-ce1b7eaaddb2';
        var noSnapshotsVolume = '128124a8-e2e0-4107-b56b-8b7572af2c58';

        before(function () {
            volumeDetailsPage.go(attachedVolume);
            basePage.disableRxNotifyTimeout();
        });

        it('should allow you to create a snapshot from a volume @dev', function () {
            var snapshot = {
                name: 'SNAP-001',
                description: '',
                force: 'Yes'
            };

            volumeDetailsPage.createSnapshot(snapshot);

            expect(encore.rxNotify.all.exists('Snapshot Created')).to.eventually.be.true;
            basePage.dismissPageStatus();
        });

        it('should list snapshots for volume @dev', function () {
            volumeDetailsPage.snapshotsTable.row(1).then(function (snapshot) {
                expect(snapshot['name']).to.equal('SNAP-TEST');
                expect(snapshot['id']).to.equal('a82760a0-aa03-40a1-ad7e-63decfc95a5e');
                expect(snapshot['Description']).to.equal('Test snapshot.');
                expect(snapshot['Status']).to.equal('AVAILABLE');
                expect(snapshot['Size']).to.equal('100 GB');
            });
            // (TODO): How to test increasing duration
        });

        it('should allow you to remove a snapshot @dev', function () {
            volumeDetailsPage.snapshotsTable.row(1).then(function (snapshot) {
                snapshot.Actions.expand().then(function (actions) {
                    actions['Delete snapshot'].click();
                    volumeDetailsPage.deleteSnapshotModal.submit();
                });
            });

            expect(encore.rxNotify.all.exists('Snapshot deleted.')).to.eventually.be.true;
            basePage.dismissPageStatus();
        });

        it('should allow you to create a volume from a snapshot @dev', function () {
            var volume = {
                name: 'test',
                description: '',
                size: '100',
                type: 'SATA'
            };
            volumeDetailsPage.snapshotsTable.row(1).then(function (snapshot) {
                snapshot.Actions.expand().then(function (actions) {
                    actions['Create Volume'].click();
                    volumeDetailsPage.createVolumeModal.createVolume(volume);
                });
            });

            expect(encore.rxNotify.all.exists('Volume Created')).to.eventually.be.true;
            basePage.dismissPageStatus();
        });

        it('should show an error message when no snapshots are present @dev', function () {
            var error = 'No Snapshots found for this Volume.';
            volumeDetailsPage.go(noSnapshotsVolume);
            expect(volumeDetailsPage.snapshotsTable.emptySnapshotTableText()).to.eventually.equal(error);
        });
    });

    describe('Regression Tests', function () {

        it('should create a ssd snapshot #regression', function () {
            var volumeQuery = { name: tf.ssdVolume.name };
            var snapshotQuery = { name: tf.ssdSnapshotNew.name };
            var filter = volumeQuery.name;

            volumeDetailsPage.open(volumeQuery, filter);
            volumeDetailsPage.createSnapshot(tf.ssdSnapshotNew);

            expect(encore.rxNotify.all.exists('Snapshot Created')).to.eventually.be.true;
            volumeDetailsPage.snapshotsTable.findSnapshot(snapshotQuery).then(function (snapshot) {
                expect(snapshot).to.not.be.empty;
            });
        });

        it('should create a sata snapshot #regression', function () {
            var volumeQuery = { name: tf.sataVolume.name };
            var snapshotQuery = { name: tf.sataSnapshotNew.name };
            var filter = volumeQuery.name;

            volumeDetailsPage.open(volumeQuery, filter);
            volumeDetailsPage.createSnapshot(tf.sataSnapshotNew);

            expect(encore.rxNotify.all.exists('Snapshot Created')).to.eventually.be.true;
            volumeDetailsPage.snapshotsTable.findSnapshot(snapshotQuery).then(function (snapshot) {
                expect(snapshot).to.not.be.empty;
            });
        });

        it('should delete a ssd snapshot #regression', function () {
            var volumeQuery = { name: tf.ssdVolumeDeleteSnapshot.name };
            var snapshotQuery = { name: tf.ssdSnapshotVolumeDelete.name, Status: 'Available' };
            var filter = volumeQuery.name;

            volumeDetailsPage.open(volumeQuery, filter);
            volumeDetailsPage.snapshotsTable.deleteSnapshot(snapshotQuery);

            expect(encore.rxNotify.all.exists('Snapshot deleted')).to.eventually.be.true;
        });

        it('should delete a sata snapshot #regression', function () {
            var volumeQuery = { name: tf.sataVolumeDeleteSnapshot.name };
            var snapshotQuery = { name: tf.sataSnapshotVolumeDelete.name, Status: 'Available' };
            var filter = volumeQuery.name;

            volumeDetailsPage.open(volumeQuery, filter);
            volumeDetailsPage.snapshotsTable.deleteSnapshot(snapshotQuery);

            expect(encore.rxNotify.all.exists('Snapshot deleted')).to.eventually.be.true;
        });

        it('should create a ssd volume from snapshot #regression', function () {
            var volumeQuery = { name: tf.ssdVolume.name };
            var volumeNewQuery = { name: tf.ssdVolumeNew.name };
            var snapshotQuery = { name: tf.ssdSnapshot.name, Status: 'Available' };
            var filter = volumeQuery.name;

            volumeDetailsPage.open(volumeQuery, filter);
            volumeDetailsPage.snapshotsTable.createVolumeFromSnapshot(snapshotQuery, tf.ssdVolumeNew);

            expect(encore.rxNotify.all.exists('Volume Created')).to.eventually.be.true;

            volumesOverviewPage.go();
            volumesOverviewPage.table.findVolume(volumeNewQuery).then(function (newVolume) {
                expect(newVolume.name).to.eql(volumeNewQuery.name);
            });

            // volumes build from snapshots take decades to build
            // api.volumes.deleteVolume(volumeNewQuery.name);
        });

        it('should create a sata volume from a snapshot #regression', function () {
            var volumeQuery = { name: tf.sataVolume.name };
            var volumeNewQuery = { name: tf.sataVolumeNew.name };
            var snapshotQuery = { name: tf.sataSnapshot.name, Status: 'Available' };
            var filter = volumeQuery.name;

            volumeDetailsPage.open(volumeQuery, filter);
            volumeDetailsPage.snapshotsTable.createVolumeFromSnapshot(snapshotQuery, tf.sataVolumeNew);

            expect(encore.rxNotify.all.exists('Volume Created')).to.eventually.be.true;

            volumesOverviewPage.go();
            volumesOverviewPage.table.findVolume(volumeNewQuery).then(function (newVolume) {
                expect(newVolume.name).to.eql(volumeNewQuery.name);
            });

            // volumes build from snapshots take decades to build
            // api.volumes.deleteVolume(volumeNewQuery.name);
        });

        it('should attach a ssd volume to server #regression', function () {
            var successMsg = 'Successfully submitted request to attach volume.';
            var mntPath = '/dev/xvde'; // Carefully selected to not conflict with other tests
            var serverName = tf.nextGenAttachVolServer.name;
            var volumeQuery = { name: tf.ssdVolumeAttach.name };
            var filter = volumeQuery.name;
            var attachOpts = {
                fn: volumeDetailsPage.volumeDetails,
                checkFn: function (data) {
                    return (_.contains(data, attachOpts.expectedText));
                },
                expectedText: 'In-use',
                timeout: '15'
            };

            api.common.detachVolumeFromServer(volumeQuery.name, serverName);
            volumeDetailsPage.open(volumeQuery, filter);
            volumeDetailsPage.attachVolume(serverName, mntPath);

            expect(encore.rxNotify.all.exists(successMsg)).to.eventually.be.true;

            volumeDetailsPage.waitForExpectedText(attachOpts).then(function (details) {
                expect(details.Status).to.equal('In-use');
            });
        });

        it('should attach a sata volume to server #regression', function () {
            var successMsg = 'Successfully submitted request to attach volume.';
            var mntPath = '/dev/xvdf'; // Carefully selected to not conflict with other tests
            var serverName = tf.nextGenAttachVolServer.name;
            var volumeQuery = { name: tf.sataVolumeAttach.name };
            var filter = volumeQuery.name;
            var attachOpts = {
                fn: volumeDetailsPage.volumeDetails,
                checkFn: function (data) {
                    return (_.contains(data, attachOpts.expectedText));
                },
                expectedText: 'In-use',
                timeout: '15'
            };

            api.common.detachVolumeFromServer(volumeQuery.name, serverName);
            volumeDetailsPage.open(volumeQuery, filter);
            volumeDetailsPage.attachVolume(serverName, mntPath);

            expect(encore.rxNotify.all.exists(successMsg)).to.eventually.be.true;

            volumeDetailsPage.waitForExpectedText(attachOpts).then(function (details) {
                expect(details.Status).to.equal('In-use');
            });
        });

        it('should detach a ssd volume from a server #regression', function () {
            var serverName = tf.nextGenDetachVolServer.name;
            var mntPath = '/dev/xvdg';  // Carefully selected to not conflict with other tests
            var volumeQuery = { name: tf.ssdVolumeDetach.name };
            var detachOpts = {
                fn: volumeDetailsPage.volumeDetails,
                checkFn: function (data) {
                    return (_.contains(data, detachOpts.expectedText));
                },
                expectedText: 'Available',
                timeout: '15'
            };

            api.common.attachVolumeToServer(volumeQuery.name, serverName, mntPath).then(function () {
                volumeDetailsPage.open(volumeQuery);
                volumeDetailsPage.detachVolume();
                volumeDetailsPage.waitForExpectedText(detachOpts).then(function (details) {
                    expect(details.Status).to.equal('Available');
                });
            });
        });

        it('should detach a sata volume from a server #regression', function () {
            var serverName = tf.nextGenDetachVolServer.name;
            var mntPath = '/dev/xvdh';  // Carefully selected to not conflict with other tests
            var volumeQuery = { name: tf.sataVolumeDetach.name };
            var detachOpts = {
                fn: volumeDetailsPage.volumeDetails,
                checkFn: function (data) {
                    return (_.contains(data, detachOpts.expectedText));
                },
                expectedText: 'Available',
                timeout: '15'
            };

            api.common.attachVolumeToServer(volumeQuery.name, serverName, mntPath).then(function () {
                volumeDetailsPage.open(volumeQuery);
                volumeDetailsPage.detachVolume();
                volumeDetailsPage.waitForExpectedText(detachOpts).then(function (details) {
                    expect(details.Status).to.equal('Available');
                });
            });
        });

        it('should delete a ssd volume #regression', function () {
            var volumeQuery = { name: tf.ssdVolumeDelete.name };
            var filter = volumeQuery.name;
            var successMsg = 'Volume Deleted';

            volumeDetailsPage.open(volumeQuery, filter);
            volumeDetailsPage.deleteVolume();

            expect(encore.rxNotify.all.exists(successMsg)).to.eventually.be.true;
            volumesOverviewPage.table.find(volumeQuery, filter).then(function (results) {
                expect(results).to.be.empty;
            });
        });

        it('should delete a sata volume #regression', function () {
            var volumeQuery = { name: tf.sataVolumeDelete.name };
            var filter = volumeQuery.name;
            var successMsg = 'Volume Deleted';

            volumeDetailsPage.open(volumeQuery, filter);
            volumeDetailsPage.deleteVolume();

            expect(encore.rxNotify.all.exists(successMsg)).to.eventually.be.true;
            volumesOverviewPage.table.find(volumeQuery, filter).then(function (results) {
                expect(results).to.be.empty;
            });
        });
    });
});

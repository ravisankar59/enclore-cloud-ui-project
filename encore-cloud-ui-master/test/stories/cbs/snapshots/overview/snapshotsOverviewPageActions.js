var snapshotsPage = require('../../../../pages/cbs/snapshots/overview');
var tf = require('../../../../pages/test-fixtures/ui');

describe('Block Storage Snapshots - Overview Actions', function () {

    beforeEach(function () {
        snapshotsPage.go();
    });

    describe('Midway Tests', function () {
        it('should allow you to create from a snapshot @dev', function () {
            var query = { id: '22f1ad21-9986-4cbb-bdb2-52ef73bf2024' };
            snapshotsPage.table.findSnapshot(query).then(function (snapshot) {
                snapshot.Actions.expand().then(function (actions) {
                    actions['Create Volume'].click();
                    var volume = {
                        name: 'test',
                        description: '',
                        size: '100',
                        type: 'SATA'
                    };
                    snapshotsPage.createVolumeModal.createVolume(volume);
                });

                expect(encore.rxNotify.all.exists('Volume Created')).to.eventually.be.true;
            });
        });
    });

    describe('Regression Tests', function () {

        it('should create a sata volume from a snapshot #regression', function () {
            var query = { name: tf.sataSnapshot.name };

            snapshotsPage.table.createVolumeFromSnapshot(query, tf.sataVolumeNew);
            expect(encore.rxNotify.all.exists('Volume Created')).to.eventually.be.true;
        });

        it('should create a ssd volume from a snapshot #regression', function () {
            var query = { name: tf.ssdSnapshot.name };

            snapshotsPage.table.createVolumeFromSnapshot(query, tf.ssdVolumeNew);
            expect(encore.rxNotify.all.exists('Volume Created')).to.eventually.be.true;
        });

        it('should delete a sata snapshot #regression', function () {
            var query = { name: tf.sataSnapshotOverviewDelete.name };

            snapshotsPage.table.deleteSnapshot(query);
            expect(encore.rxNotify.all.exists('Snapshot deleted')).to.eventually.be.true;
        });

        it('should delete a ssd snapshot #regression', function () {
            var query = { name: tf.ssdSnapshotOverviewDelete.name };

            snapshotsPage.table.deleteSnapshot(query);
            expect(encore.rxNotify.all.exists('Snapshot deleted')).to.eventually.be.true;
        });
    });
});

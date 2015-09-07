var snapshotDetailsPage = require('../../../../pages/cbs/snapshots/details');
var tf = require('../../../../pages/test-fixtures/ui');

describe('Block Storage Snapshots - Overview Actions', function () {

    var snapshots = {
        'default': '1a50a111-b5f5-4ac3-b5c3-f99b63f3c77d',
        'NullName': '1a50a111-b5f5-4ac3-b5c3-f99b63f3c77x'
    };
    
    describe('Midway Tests', function () {
        it('should allow you to delete a snapshot @dev', function () {
            snapshotDetailsPage.go(snapshots.default);
            basePage.disableRxNotifyTimeout();
            snapshotDetailsPage.deleteSnapshot();

            expect(encore.rxNotify.all.exists('Snapshot deleted')).to.eventually.be.true;
        });

        it('should allow you to create from a snapshot @dev', function () {
            snapshotDetailsPage.go(snapshots.default);
            basePage.disableRxNotifyTimeout();
            var volume = {
                name: 'test',
                description: '',
                size: '100',
                type: 'SATA'
            };

            snapshotDetailsPage.createVolume(volume);

            expect(encore.rxNotify.all.exists('Volume Created')).to.eventually.be.true;
        });

        it('should replace null value with N/A for name @dev', function () {
            snapshotDetailsPage.go(snapshots.NullName);
            expect(basePage.pageTitle).to.eventually.be.equal('Snapshot: N/A');
        });
    });

    describe('Regression Tests', function () {
        it('should delete a sata snapshot #regression', function () {
            var query = { name: tf.sataSnapshotDelete.name };
            var filter = query.name;

            snapshotDetailsPage.open(query, filter);
            snapshotDetailsPage.deleteSnapshot();

            expect(encore.rxNotify.all.exists('Snapshot deleted')).to.eventually.be.true;
        });

        it('should delete a ssd snapshot #regression', function () {
            var query = { name: tf.ssdSnapshotDelete.name };
            var filter = query.name;

            snapshotDetailsPage.open(query, filter);
            snapshotDetailsPage.deleteSnapshot();

            expect(encore.rxNotify.all.exists('Snapshot deleted')).to.eventually.be.true;
        });

        it('should create a sata volume from a snapshot #regression', function () {
            var query = { name: tf.sataSnapshot.name };
            var filter = query.name;

            snapshotDetailsPage.open(query, filter);
            snapshotDetailsPage.createVolume(tf.sataVolumeNew);

            expect(encore.rxNotify.all.exists('Volume Created')).to.eventually.be.true;
        });

        it('should create a ssd volume from a snapshot #regression', function () {
            var query = { name: tf.ssdSnapshot.name };
            var filter = query.name;

            snapshotDetailsPage.open(query, filter);
            snapshotDetailsPage.createVolume(tf.ssdVolumeNew);
            expect(encore.rxNotify.all.exists('Volume Created')).to.eventually.be.true;
        });
    });
});

var volumesOverviewPage = require('../../../../pages/cbs/volumes/overview');
var createSnapshotModal = require('../../../../pages/cbs/modals/createSnapshot');
var tf = require('../../../../pages/test-fixtures/ui');
var api = require('../../../../api-helper/api');

describe('Block Storage Volumes - Overview Actions', function () {

    before(function () {
        volumesOverviewPage.go();
    });

    describe('Midway Tests', function () {

        it('should allow you to create a snapshot from a volume @dev', function () {
            var query = { name: '20test' };
            var snapshot = {
                name: 'SNAP-001',
                description: '',
                force: 'No'
            };

            volumesOverviewPage.table.findVolume(query).then(function (volume) {
                volume.Actions.expand().then(function (actions) {
                    actions['Create Snapshot'].click();
                    createSnapshotModal.createSnapshot(snapshot);
                });
            });

            expect(encore.rxNotify.all.exists('Snapshot Created')).to.eventually.be.true;
        });
    });

    describe('Regression Tests', function () {

        var detachServer, detachSata, detachSsd;
        before(function () {
            detachServer = tf.nextGenDetachVolServer.name;
            detachSsd = tf.ssdVolumeOverviewDetach.name;
            detachSata = tf.sataVolumeOverviewDetach.name;

            api.common.attachVolumeToServer(detachSsd, detachServer, '/dev/xvdc');
            api.common.attachVolumeToServer(detachSata, detachServer, '/dev/xvdd');
            volumesOverviewPage.driver.navigate().refresh();
        });

        it('should create a Snapshot of a SATA Volume #regression', function () {
            var query = { name: tf.sataVolumeOverview.name };
            var filter = query.name;
            var msg = 'Snapshot Created';

            volumesOverviewPage.table.findVolume(query, filter).then(function (row) {
                row.Actions.expand().then(function (actions) {
                    actions['Create Snapshot'].click();
                    createSnapshotModal.createSnapshot(tf.sataSnapshotNew);
                });
            });

            expect(encore.rxNotify.all.exists(msg)).to.eventually.be.true;
        });

        it('should create a Snapshot of a SSD Volume #regression', function () {
            var query = { name: tf.ssdVolumeOverview.name };
            var filter = query.name;
            var msg = 'Snapshot Created';

            volumesOverviewPage.table.findVolume(query, filter).then(function (row) {
                row.Actions.expand().then(function (actions) {
                    actions['Create Snapshot'].click();
                    createSnapshotModal.createSnapshot(tf.ssdSnapshotNew);
                });
            });

            expect(encore.rxNotify.all.exists(msg)).to.eventually.be.true;
        });

        it('should detach a SATA Volume #regression', function () {
            var query = { name: detachSata };
            var filter = query.name;

            volumesOverviewPage.table.detachVolume(query, filter);
            expect(encore.rxNotify.all.exists('Attachment Detached')).to.eventually.be.true;

            volumesOverviewPage.driver.navigate().refresh();
            volumesOverviewPage.table.findVolume(query, filter).then(function (volume) {
                expect(_.contains(volume['Attached To'], 'Detaching from')).to.be.true;
            });
        });

        it('should detach a SSD Volume #regression', function () {
            var query = { name: detachSsd };
            var filter = query.name;

            volumesOverviewPage.table.detachVolume(query, filter);
            expect(encore.rxNotify.all.exists('Attachment Detached')).to.eventually.be.true;

            volumesOverviewPage.driver.navigate().refresh();
            volumesOverviewPage.table.findVolume(query).then(function (volume) {
                expect(_.contains(volume['Attached To'], 'Detaching from')).to.be.true;
            });
        });

        it('should delete a SATA volume that is not attached #regression', function () {
            var query = { name: tf.sataVolumeOverviewDelete.name };
            var filter = query.name;

            volumesOverviewPage.table.deleteVolume(query, filter);
            volumesOverviewPage.driver.navigate().refresh();

            expect(volumesOverviewPage.table.find(query, filter)).to.eventually.be.empty;
        });

        it('should delete a SSD volume that is not attached #regression', function () {
            var query = { name: tf.ssdVolumeOverviewDelete.name };
            var filter = query.name;

            volumesOverviewPage.table.deleteVolume(query, filter);
            volumesOverviewPage.driver.navigate().refresh();

            expect(volumesOverviewPage.table.find(query, filter)).to.eventually.be.empty;
        });
    });
});

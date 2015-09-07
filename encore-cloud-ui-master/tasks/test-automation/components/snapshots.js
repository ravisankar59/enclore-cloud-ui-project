var _ = require('lodash');
var promise = require('bluebird');
var tf = require('../../../test/pages/test-fixtures/api');
var fxUtil = require('../fixtureUtil');
var url = require('../url');

var snapshots = {
    type: 'Snapshots',
    get fixtures () {
        return buildSnapshots();
    },
    url: url.snapshots,
    nameKey: 'display_name',
    timeout: 20 * 60 * 1000,
    retries: 1
};

module.exports = snapshots;

function buildSnapshots () {
    return fxUtil.fetchComponents(url.volumes).then(function (currentVolumes) {
        var volumes = [
            tf.sataVolume,
            tf.ssdVolume,
            tf.sataVolumeDeleteSnapshot,
            tf.ssdVolumeDeleteSnapshot,
            tf.sataVolumeForSnapshotDelete,
            tf.ssdVolumeForSnapshotDelete,
            tf.sataVolumeForSnapshotOverviewDelete,
            tf.ssdVolumeForSnapshotOverviewDelete
        ];

        var snapshots = [
            tf.sataSnapshot,
            tf.ssdSnapshot,
            tf.sataSnapshotVolumeDelete,
            tf.ssdSnapshotVolumeDelete,
            tf.sataSnapshotDelete,
            tf.ssdSnapshotDelete,
            tf.sataSnapshotOverviewDelete,
            tf.ssdSnapshotOverviewDelete
        ];

        volumes = _.map(volumes, function (volume) {
            var query = { display_name: volume.display_name };
            return _.find(currentVolumes, query);
        });

        snapshots = _.map(snapshots, function (snapshot, index) {
            var volume = volumes[index];
            if (_.isUndefined(volume)) {
                return undefined;
            }

            snapshot = snapshot(volume.id);
            return snapshot;
        });

        return promise.resolve(_.compact(snapshots));
    });
}

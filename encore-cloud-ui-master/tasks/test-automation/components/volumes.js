var tf = require('../../../test/pages/test-fixtures/api');
var url = require('../url');

module.exports = {
    type: 'Volumes',
    fixtures: [
        tf.sataVolume, // Used for all potentially non-conflicting tests
        tf.ssdVolume,
        tf.sataVolumeAttach,
        tf.ssdVolumeAttach,
        tf.sataVolumeDetach,
        tf.ssdVolumeDetach,
        tf.sataVolumeDelete,
        tf.ssdVolumeDelete,
        tf.sataVolumeDeleteSnapshot,
        tf.ssdVolumeDeleteSnapshot,
        tf.sataVolumeOverview, // Fixtures for Overview page tests
        tf.ssdVolumeOverview,
        tf.sataVolumeOverviewDetach,
        tf.ssdVolumeOverviewDetach,
        tf.sataVolumeOverviewDelete,
        tf.ssdVolumeOverviewDelete,
        tf.sataVolumeForSnapshotDelete, // For Snapshots Overview, Snapshot Delete
        tf.ssdVolumeForSnapshotDelete
    ],
    url: url.volumes,
    nameKey: 'display_name',
    timeout: 5 * 60 * 1000,
    retries: 1
};

var _ = require('lodash');

function buildSnapshots () {
    var snapshots = [
        'sataSnapshot',
        'ssdSnapshot',
        'sataSnapshotDelete',
        'ssdSnapshotDelete',
        'sataSnapshotVolumeDelete',
        'ssdSnapshotVolumeDelete',
        'sataSnapshotOverviewDelete',
        'ssdSnapshotOverviewDelete'
    ];

    return _.reduce(snapshots, function (obj, snapshotName) {
        obj[snapshotName] = function (volumeId) {
            return {
                force: 'false',
                /* jshint -W106 */
                display_name: 'auto-' + snapshotName,
                display_description: 'test snapshot',
                volume_id: volumeId
                /* jshint +W106 */
            };
        };
        return obj;
    }, {});
}

module.exports = buildSnapshots();

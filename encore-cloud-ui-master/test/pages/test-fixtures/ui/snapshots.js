var buildObject = require('../helpers.js').buildObject;
var noForce = 'No';

function buildSnapshots () {
    var snapshots = [
        'sataSnapshot',
        'ssdSnapshot',
        'sataSnapshotDelete',
        'ssdSnapshotDelete',
        'sataSnapshotVolumeDelete',
        'ssdSnapshotVolumeDelete',
        'sataSnapshotOverviewDelete',
        'ssdSnapshotOverviewDelete',
        'sataSnapshotNew',
        'ssdSnapshotNew'
    ];

    return buildObject(snapshots, function (snapshotName) {
        var snapshotBody = {};

        snapshotBody[snapshotName] = {
            get: function () {
                return {
                    name: 'auto-' + snapshotName,
                    description: 'snapshot for e2e testing',
                    force: noForce
                };
            }
        };
        return snapshotBody;
    });
}

module.exports = buildSnapshots();

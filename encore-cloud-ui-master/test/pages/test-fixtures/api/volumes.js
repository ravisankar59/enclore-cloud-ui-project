var _ = require('lodash');
var typeSata = 'SATA';
var typeSsd = 'SSD';
var sizeSata = 75;
var sizeSsd = 50;

function buildVolumes () {

    var volumes = [
        'sataVolume', // Used for all potentially non-conflicting tests
        'ssdVolume',
        'sataVolumeAttach',
        'ssdVolumeAttach',
        'sataVolumeDetach',
        'ssdVolumeDetach',
        'sataVolumeDelete',
        'ssdVolumeDelete',
        'sataVolumeDeleteSnapshot',
        'ssdVolumeDeleteSnapshot',
        'sataVolumeOverview', // Fixtures for Overview page tests
        'ssdVolumeOverview',
        'sataVolumeOverviewDetach',
        'ssdVolumeOverviewDetach',
        'sataVolumeOverviewDelete',
        'ssdVolumeOverviewDelete',
        'sataVolumeForSnapshotDelete', // For Snapshots Details, Snapshot Delete
        'ssdVolumeForSnapshotDelete',
        'sataVolumeForSnapshotOverviewDelete', // For Snapshots Overview, Snapshot Delete
        'ssdVolumeForSnapshotOverviewDelete'
    ];

    return _.reduce(volumes, function (obj, volumeName) {
        obj[volumeName] = {
            size: (_.contains(volumeName, 'sata')) ? sizeSata : sizeSsd,
            /* jshint -W106 */
            display_description: 'volume for e2e testing',
            display_name: 'auto-' + volumeName,
            volume_type: (_.contains(volumeName, 'sata')) ? typeSata : typeSsd
            /* jshint +W106 */
        };
        return obj;
    }, {});
}

module.exports = buildVolumes();

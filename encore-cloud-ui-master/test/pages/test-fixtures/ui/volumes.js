var _ = require('lodash');
var buildObject = require('../helpers.js').buildObject;
var typeSata = 'SATA';
var typeSsd = 'SSD';
var sizeSata = 75;
var sizeSsd = 50;
var sizeNew = 100;
var regionORD = 'ORD (Chicago)';

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
        'sataVolumeNew', // For all newly created volumes
        'ssdVolumeNew'
    ];

    return buildObject(volumes, function (volumeName) {
        var volumeBody = {};

        volumeBody[volumeName] = {
            get: function () {
                var size = (_.contains(volumeName, 'sata')) ? sizeSata : sizeSsd;

                return {
                    name: 'auto-' + volumeName,
                    description: 'volume for e2e testing',
                    size: (_.contains(volumeName, 'New')) ? sizeNew : size,
                    type: (_.contains(volumeName, 'sata')) ? typeSata : typeSsd,
                    region: regionORD
                };
            }
        };

        return volumeBody;
    });
}

module.exports = buildVolumes();

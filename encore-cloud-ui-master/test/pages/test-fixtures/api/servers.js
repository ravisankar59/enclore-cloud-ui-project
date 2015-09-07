var _ = require('lodash');
var nextGenImage = 'aab63bcf-89aa-440f-b0c7-c7a1c611914b';
var nextGenFlavor = '2';
var firstGenImage = '65';
var firstGenFlavor = '1';
var networksList = [
    { uuid: '00000000-0000-0000-0000-000000000000' },
    { uuid: '11111111-1111-1111-1111-111111111111' }
];

function buildServers () {
    var servers = [
        'nextGenAttachVolServer',
        'nextGenDetachVolServer',
        'nextGenCreateImage',
        'nextGenChangePassword',
        'nextGenChangeName',
        'nextGenSoftReset',
        'nextGenHardReset',
        'nextGenRebuild',
        'nextGenResize',
        'nextGenRevertResize',
        'nextGenRescue',
        'nextGenUnrescue',
        'nextGenDelete',
        'nextGenLbaas1',
        'nextGenLbaas2',
        'nextGenBulk1',
        'nextGenBulk2',
        'nextGenAddIpServer',
        'nextGenRemoveIpServer',
        'nextGenMigrateServer',
        'nextGenSuspendServer',
        'nextGenUnsuspendServer',
        'firstGenCreateImage',
        'firstGenChangePassword',
        'firstGenChangeName',
        'firstGenSoftReset',
        'firstGenHardReset',
        'firstGenRebuild',
        'firstGenResize',
        'firstGenRevertResize',
        'firstGenRescue',
        'firstGenUnrescue',
        'firstGenDelete',
        'firstGenBulk1',
        'firstGenBulk2'
    ];

    return _.reduce(servers, function (obj, serverName) {
        obj[serverName] = {
            flavor: (_.contains(serverName, 'firstGen')) ? firstGenFlavor : nextGenFlavor,
            image: (_.contains(serverName, 'firstGen')) ? firstGenImage : nextGenImage,
            name: 'auto-' + serverName
        };
        if (_.contains(serverName, 'nextGen')) {
            obj[serverName].networks = networksList;
        }

        return obj;
    }, {});
}

module.exports = buildServers();

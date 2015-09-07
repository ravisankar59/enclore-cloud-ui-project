var tf = require('../../../test/pages/test-fixtures/api');
var url = require('../url');

module.exports = {
    type: 'NextGen Servers',
    fixtures: [
        tf.nextGenAttachVolServer,
        tf.nextGenDetachVolServer,
        tf.nextGenCreateImage,
        tf.nextGenChangePassword,
        tf.nextGenChangeName,
        tf.nextGenSoftReset,
        tf.nextGenHardReset,
        tf.nextGenRebuild,
        tf.nextGenResize,
        tf.nextGenRevertResize,
        tf.nextGenRescue,
        tf.nextGenUnrescue,
        tf.nextGenDelete,
        tf.nextGenLbaas1,
        tf.nextGenLbaas2,
        tf.nextGenBulk1,
        tf.nextGenBulk2,
        tf.nextGenAddIpServer,
        tf.nextGenRemoveIpServer,
        tf.nextGenMigrateServer,
        tf.nextGenSuspendServer,
        tf.nextGenUnsuspendServer
    ],
    url: url.nextGenServers,
    nameKey: 'name',
    timeout: 5 * 60 * 1000,
    retries: 1
};

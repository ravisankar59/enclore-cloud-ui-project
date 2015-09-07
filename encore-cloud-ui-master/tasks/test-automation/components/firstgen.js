var _ = require('lodash');
var tf = require('../../../test/pages/test-fixtures/api');
var url = require('../url');

var opts = {
    type: 'FirstGen Servers',
    fixtures: [
        tf.firstGenCreateImage,
        tf.firstGenChangePassword,
        tf.firstGenChangeName,
        tf.firstGenSoftReset,
        tf.firstGenHardReset,
        tf.firstGenRebuild,
        tf.firstGenResize,
        tf.firstGenRescue,
        tf.firstGenRevertResize,
        tf.firstGenUnrescue,
        tf.firstGenDelete,
        tf.firstGenBulk1,
        tf.firstGenBulk2,
    ],
    url: url.firstGenServers,
    nameKey: 'name',
    timeout: 5 * 60 * 1000,
    retries: 2
};

// env is used in tasks/setupTestFixtures.js and tasks/rmTestFixtures.js
if ( env !== 'staging') {
    opts.fixtures = _.map(opts.fixtures, function (fixture) {
        fixture.image = '118';
        return fixture;
    });
}

module.exports = opts;

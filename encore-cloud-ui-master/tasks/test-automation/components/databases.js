var tf = require('../../../test/pages/test-fixtures/api');
var url = require('../url');

module.exports = {
    type: 'Databases',
    fixtures: [
        tf.dbTestActions,
        tf.dbChangeFlavor,
        tf.dbCreate,
        tf.dbDelete,
        tf.dbResize,
        tf.dbRestart,
        tf.dbDetails,
        tf.dbWithUser,
    ],
    url: url.databases,
    nameKey: 'name',
    timeout: 5 * 60 * 1000,
    retries: 1
};

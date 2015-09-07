var tf = require('../../../test/pages/test-fixtures/api');
var url = require('../url');

module.exports = {
    type: 'Networks',
    fixtures: [
        tf.networkTest
    ],
    url: url.networks,
    nameKey: 'label',
    timeout: 5 * 60 * 1000,
    retries: 1
};

var tf = require('../../../test/pages/test-fixtures/api');
var url = require('../url');

module.exports = {
    type: 'Load Balancers',
    fixtures: [
        tf.lbaasDetails,
        tf.lbChangeName,
        tf.lbDelete,
        tf.lbDeleteDetails,
        tf.lbLogging,
        tf.lbThrottling,
        tf.lbHealthMonitoring,
        tf.lbOverviewLogging,
        tf.lbOverviewThrottling,
        tf.lbOverviewHealthMonitoring
    ],
    url: url.loadbalancers,
    nameKey: 'name',
    timeout: 5 * 60 * 1000,
    retries: 1
};

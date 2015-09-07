var _ = require('lodash');

var fixtures = [
    'servers',
    'volumes',
    'snapshots',
    'dbaas',
    'lbaas',
    'networks'
];

var APITestFixtures = _.transform(fixtures, function (result, fixture) {
    return _.merge(result, require('./api/' + fixture));
}, {});

module.exports = APITestFixtures;

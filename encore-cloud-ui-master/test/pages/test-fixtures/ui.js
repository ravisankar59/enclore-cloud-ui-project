var _ = require('lodash');
var Page = require('astrolabe').Page;
var servers = require('./ui/servers');
var volumes = require('./ui/volumes');
var dbaas = require('./ui/dbaas');
var lbaas = require('./ui/lbaas');
var snapshots = require('./ui/snapshots');
var UITestFixtures = _.merge(servers, volumes, snapshots, dbaas);
var UITestFixtures = _.merge(servers, volumes, snapshots, dbaas, lbaas);

module.exports = Page.create(UITestFixtures);

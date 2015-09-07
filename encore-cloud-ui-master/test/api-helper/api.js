var servers = require('./servers/serversApiHelper');
var volumes = require('./cbs/volumesApiHelper');
var lbaas = require('./lbaas/lbaasApiHelper');
var common = require('./common');

module.exports = {
    common: common,
    servers: servers,
    volumes: volumes,
    lbaas: lbaas
};

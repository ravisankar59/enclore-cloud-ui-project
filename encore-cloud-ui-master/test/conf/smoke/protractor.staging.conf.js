/*jshint node:true */
// For some reason 'grunt jshint' doesn't respect the node:true in the .jshintrc file, so we have to add it here

var conf = require('../testing.globals.conf');
var baseConfig = require('../baseConf');

// only run tests that are not tagged
baseConfig.mochaOpts.grep = /^(?!.*(#regression|@dev).*).*$/i;
baseConfig.seleniumAddress = conf.seleniumLocalAddress;
baseConfig.baseUrl = conf.stagingUrl;
baseConfig.params.env = 'staging';
baseConfig.capabilities = {
    browserName: 'firefox',
    shardTestFiles: true,
    maxInstances: 2
};

exports.config = baseConfig;

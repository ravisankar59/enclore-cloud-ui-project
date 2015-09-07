/*jshint node:true */
// For some reason 'grunt jshint' doesn't respect the node:true in the .jshintrc file, so we have to add it here

var conf = require('../testing.globals.conf');
var baseConfig = require('../baseConf');

// only run tests that are not tagged @dev
baseConfig.mochaOpts.grep = /^(?!.*(@dev).*).*$/i;
baseConfig.seleniumAddress = conf.seleniumGridAddress;
baseConfig.baseUrl = conf.stagingUrl;
baseConfig.allScriptsTimeout = (1000 * 60 * 30);
baseConfig.params.env = 'staging';
baseConfig.capabilities = {
    browserName: 'firefox',
    shardTestFiles: true,
    maxInstances: 4
};

exports.config = baseConfig;

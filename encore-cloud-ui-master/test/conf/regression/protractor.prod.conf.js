/*jshint node:true */
// For some reason 'grunt jshint' doesn't respect the node:true in the .jshintrc file, so we have to add it here

var conf = require('../testing.globals.conf');
var baseConfig = require('../baseConf');

// only run tests tagged #regression and are not followed by @noprod
baseConfig.mochaOpts.grep = /#regression(?!\s@noprod)/i;
baseConfig.seleniumAddress = conf.seleniumLocalAddress;
baseConfig.baseUrl = conf.prodUrl;
baseConfig.mochaOpts.slow = (1000 * 60 * 10);
baseConfig.mochaOpts.timeout = 1000 * 60 * 2;
baseConfig.allScriptsTimeout = (1000 * 60 * 30);
baseConfig.params.env = 'production';
baseConfig.capabilities = {
    browserName: 'firefox',
    shardTestFiles: true,
    maxInstances: 2
};

exports.config = baseConfig;

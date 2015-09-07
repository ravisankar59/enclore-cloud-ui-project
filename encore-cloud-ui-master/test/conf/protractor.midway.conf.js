/*jshint node:true */
// For some reason 'grunt jshint' doesn't respect the node:true in the .jshintrc file, so we have to add it here

var conf = require('./testing.globals.conf');
var baseConfig = require('./baseConf');

// only run tests that are not tagged #regression or @nodev
baseConfig.mochaOpts.grep = /^(?!.*(#regression|@nodev).*).*$/i;
baseConfig.seleniumAddress = conf.seleniumLocalAddress;
baseConfig.baseUrl = conf.localUrl;
baseConfig.params.env = 'localhost';
baseConfig.capabilities = {
    browserName: 'firefox',
    shardTestFiles: true,
    maxInstances: 2
};

exports.config = baseConfig;

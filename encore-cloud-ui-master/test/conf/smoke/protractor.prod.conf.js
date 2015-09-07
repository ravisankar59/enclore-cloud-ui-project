/*jshint node:true */
// For some reason 'grunt jshint' doesn't respect the node:true in the .jshintrc file, so we have to add it here

var conf = require('../testing.globals.conf');
var baseConfig = require('../baseConf');

// only run tests that are not tagged
baseConfig.mochaOpts.grep = /^(?!.*(#regression|@noprod|@dev).*).*$/i;
baseConfig.seleniumAddress = conf.seleniumLocalAddress;
baseConfig.baseUrl = conf.prodUrl;
baseConfig.params.env = 'production';

exports.config = baseConfig;

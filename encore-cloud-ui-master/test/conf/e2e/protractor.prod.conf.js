/*jshint node:true */
// For some reason 'grunt jshint' doesn't respect the node:true in the .jshintrc file, so we have to add it here

var conf = require('../testing.globals.conf');
var baseConfig = require('../baseConf');

// only run tests that are not tagged @dev nor @noprod
baseConfig.mochaOpts.grep = /^(?!.*(@dev|@noprod).*).*$/i;
baseConfig.seleniumAddress = conf.seleniumGridAddress;
baseConfig.baseUrl = conf.prodUrl;
baseConfig.allScriptsTimeout = (1000 * 60 * 30);
baseConfig.params.env = 'production';

exports.config = baseConfig;

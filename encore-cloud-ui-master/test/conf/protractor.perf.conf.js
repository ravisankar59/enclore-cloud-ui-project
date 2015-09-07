/*jshint node:true */
// For some reason 'grunt jshint' doesn't respect the node:true in the .jshintrc file, so we have to add it here

var conf = require('./testing.globals.conf');
var baseConfig = require('./baseConf');

baseConfig.seleniumAddress = conf.seleniumLocalAddress;
baseConfig.baseUrl = conf.stagingUrl;
baseConfig.specs = ['../perf/timeline.perf.js'];

exports.config = baseConfig;

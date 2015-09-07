var secrets = require('../secrets');
var conf = require('./testing.globals.conf');
var specs = require('./selectSpecs');

var keywords = (process.env.ghprbKeywords || '').split(' ');
var changedFiles = (process.env.ghprbFiles || '').split(' ');

var baseConfig = {
    // The address of a running selenium server. If this is specified,
    // seleniumServerJar and seleniumPort will be ignored.
    seleniumAddress: conf.seleniumLocalAddress,

    // A base URL for your application under test. Calls to protractor.get()
    // with relative paths will be prepended with this.
    baseUrl: conf.localUrl,

    specs: specs.selectSpecs(changedFiles, keywords),

    params: {
        loginRedirect: '/cloud',
        logins: secrets.credentials,
        user: 'hub_cap',
        accountNumber: '323676'
    },

    framework: 'mocha',

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'firefox'
    },

    allScriptsTimeout: (1000 * 60 * 4),
    getPageTimeout: 60000,
    // Options to be passed to mocha
    mochaOpts: {
        reporter: require('../../cloud-reporter.js'),
        slow: 5000,
        timeout: 60000,
        ui: 'bdd'
    },

    onPrepare: function () {
        ptor = browser;
        basePage = require('../pages/base');
        loginPage = require('../pages/login.page');
        encore = require('rx-page-objects');
        moment = require('moment');
        var chai = require('chai').use(require('chai-as-promised'));
        chai.config.truncateThreshold = 0;
        expect = chai.expect;
        _ = require('lodash');
        browser.driver.manage().window().setSize(1280,1024);
        return loginPage.login();
    }
};

module.exports = baseConfig;

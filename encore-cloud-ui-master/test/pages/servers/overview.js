var Page = require('astrolabe').Page;
var overviewTable = require('./overview/table');
var createImageModal = require('./modals/createImage');
var attachVolumeModal = require('./modals/attachVolume');
var rebootServerModal = require('./modals/rebootServer');
var deleteServerModal = require('./modals/deleteServer');
var bulkSuspendModal = require('./modals/bulkSuspend');
var bulkUnsuspendModal = require('./modals/bulkUnsuspend');

var serversOverviewPage = Page.create({

    url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/servers';
        }
    },

    lnkCreateServer: {
        get: function () {
            return element(by.cssContainingText('a', 'Create New Server'));
        }
    },

    lnkReach: {
        get: function () {
            return element(by.cssContainingText('a', 'Go to Reach Servers'));
        }
    },

    lnkReachHref: {
        get: function () {
            return this.lnkReach.getAttribute('href');
        }
    },

    lnkFlavors: {
        get: function () {
            return element(by.cssContainingText('a', 'Go to Flavors Wiki (internal)'));
        }
    },

    lnkFlavorsHref: {
        get: function () {
            return this.lnkFlavors.getAttribute('href');
        }
    },

    lnkCalculator: {
        get: function () {
            return element(by.cssContainingText('a', 'Go to Calculator'));
        }
    },

    lnkCalculatorHref: {
        get: function () {
            return this.lnkCalculator.getAttribute('href');
        }
    },

    lnkCloudServersOverview: {
        get: function () {
            return element(by.cssContainingText('a', 'Go to Cloud Servers Overview'));
        }
    },

    lnkCloudServersOverviewHref: {
        get: function () {
            return this.lnkCloudServersOverview.getAttribute('href');
        }
    },

    lnkMigrationWarning: {
        get: function () {
            return $('div.rx-notification a');
        }
    },

    lnkMigrationWarningHref: {
        get: function () {
            return this.lnkMigrationWarning.getAttribute('href');
        }
    },

    lnkMigrationWarningTxt: {
        get: function () {
            return this.lnkMigrationWarning.getText();
        }
    }
});

// table
serversOverviewPage.table = overviewTable;

// modals
serversOverviewPage.createImageModal = createImageModal;
serversOverviewPage.rebootServerModal = rebootServerModal;
serversOverviewPage.attachVolumeModal = attachVolumeModal;
serversOverviewPage.deleteServerModal = deleteServerModal;
serversOverviewPage.bulkSuspendModal = bulkSuspendModal;
serversOverviewPage.bulkUnsuspendModal = bulkUnsuspendModal;

module.exports = serversOverviewPage;

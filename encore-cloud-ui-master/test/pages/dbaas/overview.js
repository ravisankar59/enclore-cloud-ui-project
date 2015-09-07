var Page = require('astrolabe').Page;
var instancesTable = require('./overview/table');
var basePage = require('../base');

var dbaasOverviewPage = Page.create({

    url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/databases/instances';
        }
    },

    title: {
        get: function () { return basePage.pageTitle; }
    },

    subtitle: {
        get: function () { return basePage.pageSubtitle; }
    },

    createInstanceLink: {
        get: function () { return $('a.create-instance'); }
    },

    lnkReach: {
        get: function () {
            return element(by.cssContainingText('a', 'Go to Reach Databases'));
        }
    }
});

// tables
dbaasOverviewPage.table = instancesTable;

// modals
dbaasOverviewPage.createUserModal = require('./modals/createUser');
dbaasOverviewPage.createDatabaseModal = require('./modals/createDatabase');
dbaasOverviewPage.resizeFlavorModal = require('./modals/resizeFlavor');
dbaasOverviewPage.resizeVolumeModal = require('./modals/resizeVolume');
dbaasOverviewPage.restartInstanceModal = require('./modals/restartInstance');
dbaasOverviewPage.deleteInstanceModal = require('./modals/deleteInstance');

module.exports = dbaasOverviewPage;

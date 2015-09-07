var Page = require('astrolabe').Page;
var dbaasOverviewPage = require('./overview');
var basePage = require('../base');

var detailsPage = Page.create({

    url: {
        get: function  () {
            var user = ptor.params.user;
            var accountNumber = ptor.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/databases/instances/STAGING';
        }
    },

    open: {
        value: function (query) {
            dbaasOverviewPage.go();
            basePage.disableRxNotifyTimeout();
            return dbaasOverviewPage.table.viewInstanceDetails(query);
        }
    },

    title: {
        get: function () { return basePage.pageTitle; }
    },

    subtitle: {
        get: function () { return basePage.pageSubtitle; }
    },

    lnkRestartInstance: {
        get: function () {
            return $('rx-modal-action[post-hook="restartInstance.postHook()"] a');
        }
    },

    lnkResizeFlavor: {
        get: function () {
            return $('rx-modal-action[pre-hook="resizeFlavor.preHook(this)"] a');
        }
    },

    lnkResizeVolume: {
        get: function () {
            return $('rx-modal-action[post-hook="resizeVolume.postHook(fields)"] a');
        }
    },

    lnkDeleteInstance: {
        get: function () {
            return $('rx-modal-action[post-hook="deleteInstance.postHook()"] a');
        }
    },

    numVolumeSize: {
        get: function () {
            return $('#volumeSize');
        }
    },

    restartInstance: {
        value: function () {
            this.lnkRestartInstance.click();
            this.restartInstanceModal.submit();
        }
    },

    resizeFlavor: {
        value: function (flavor) {
            this.lnkResizeFlavor.click();
            this.resizeFlavorModal.resizeFlavor(flavor);
        }
    },

    resizeVolume: {
        value: function (size) {
            this.lnkResizeVolume.click();
            this.resizeVolumeModal.resizeVolume(size);
        }
    },

    deleteInstance: {
        value: function () {
            this.lnkDeleteInstance.click();
            this.deleteInstanceModal.submit();
        }
    },
});

// tables
detailsPage.detailsTable = require('./details/details');
detailsPage.usersTable = require('./details/users');
detailsPage.databaseTable = require('./details/databases');

// modals
detailsPage.createDatabaseModal = require('./modals/createDatabase');
detailsPage.restartInstanceModal = require('./modals/restartInstance');
detailsPage.resizeVolumeModal = require('./modals/resizeVolume');
detailsPage.resizeFlavorModal = require('./modals/resizeFlavor');
detailsPage.createUserModal = require('./modals/createUser');
detailsPage.editUsersModal = require('./modals/editUsers');
detailsPage.deleteInstanceModal = require('./modals/deleteInstance');
detailsPage.editDbUserModal = require('./modals/editDbUser');
detailsPage.manageUserModal = require('./modals/manageUser');
detailsPage.deleteUserModal = require('./modals/deleteUser');

module.exports = detailsPage;

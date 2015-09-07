var Page = require('astrolabe').Page;
var wait = require('../../base/wait');
var snapshotsTable = require('./details/snapshotsTable');
var volumeOverview = require('../../cbs/volumes/overview');

var volumeDetailsPage = Page.create({

    url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/cbs/volumes/ORD';
        }
    },

    open: {
        // Opens the volume details page for row that matches query
        // ex. open({name: 'volume_name'});
        value: function (query, filter) {
            volumeOverview.go();
            basePage.disableRxNotifyTimeout();
            return volumeOverview.table.findVolume(query, filter).then(function (row) {
                return row.viewDetails();
            });
        }
    },

    btnCreateSnapshot: basePage.actionBtn('Create Snapshot'),

    btnDeleteVolume: basePage.actionBtn('Delete Volume'),

    lnkAttachVolume: basePage.actionBtn('Attach Volume'),

    lnkDetachVolume: basePage.actionBtn('Detach Volume'),

    lnkForceDetach: basePage.actionBtn('Force Detach Volume'),
    
    lnkDetachVolumeAction: {
        get: function () { return $('div.page-actions rx-modal-action a.msg-warn'); }
    },

    lblEmptySnapshots: {
        get: function () { return $('td.dataTables_empty > span'); }
    },

    cssDetailsTable: {
        get: function () { return 'rx-metadata.volume-details > section '; }
    },

    eleDetailsTable: {
        get: function () { return $(this.cssDetailsTable); }
    },

    volumeDetails: {
        value: function () { return $$(this.cssDetailsTable + '> rx-meta').getText(); }
    },

    deleteVolume: {
        value: function () {
            this.btnDeleteVolume.click();
            this.deleteVolumeModal.submit();
        }
    },

    createSnapshot: {
        value: function (snapshot) {
            this.btnCreateSnapshot.click();
            this.createSnapshotModal.createSnapshot(snapshot);
        }
    },

    canAttachVolume: {
        value: function () {
            if (this.lnkAttachVolume.isDisplayed()) {
                return true;
            }
            return false;
        }
    },

    canDetachVolume: {
        value: function () {
            if (this.lnkDetachVolume.isDisplayed()) {
                return true;
            }
            return false;
        }
    },

    attachVolume: {
        value: function (serverName, mntPath) {
            if (this.canAttachVolume()) {
                this.lnkAttachVolume.click();
                this.attachVolumeModal.attachVolume(serverName, mntPath);
            } else {
                this.UnableToAttachVolume.thro('The volume is already attached to a server');
            }
        }
    },

    detachVolume: {
        value: function () {
            if (this.canDetachVolume()) {
                this.lnkDetachVolume.click();
                this.detachVolumeModal.submit();
            } else {
                this.UnableToDetachVolume.thro('The volume is not attached to a server');
            }
        }
    },

    detachVolumeByAction: {
        value: function () {
            var page = this;
            page.lnkDetachVolumeAction.isPresent().then(function (isPresent) {
                if (isPresent) {
                    page.lnkDetachVolumeAction.click();
                    page.detachVolumeModal.submit();
                } else {
                    page.UnableToDetachVolume.thro('The volume is not attached to a server');
                }
            });
        }
    },

    forceDetachPageTitle: {
        get: function () {
            var ptor = browser.driver;

            return this.lnkForceDetach.click().then(function () {
                ptor.sleep(1000);
                return ptor.getAllWindowHandles().then(function (handles) {
                    var parentHandle = handles[0];
                    var cloudControlHandle = handles[1];
                    ptor.switchTo().window(cloudControlHandle);
                    return ptor.getTitle().then(function (pageTitle) {
                        ptor.switchTo().window(parentHandle);
                        return pageTitle;
                    });
                });
            });
        }
    },

    RowNotFoundError: {
        get: function () { return this.exception('The request row was not found'); }
    },

    UnableToAttachVolume: {
        get: function () { return this.exception('Unable to attach volume'); }
    },

    UnableToDetachVolume: {
        get: function () { return this.exception('Unable to detach volume'); }
    },

    waitForExpectedText: wait
});

// tables
volumeDetailsPage.snapshotsTable = snapshotsTable;

// modals
volumeDetailsPage.createSnapshotModal = require('../modals/createSnapshot');
volumeDetailsPage.createVolumeModal = require('../modals/createVolume');
volumeDetailsPage.attachVolumeModal = require('../modals/attachVolume');
volumeDetailsPage.detachVolumeModal = require('../modals/detachVolume');
volumeDetailsPage.deleteVolumeModal = require('../modals/deleteVolume');
volumeDetailsPage.deleteSnapshotModal = require('../modals/deleteSnapshot');
module.exports = volumeDetailsPage;

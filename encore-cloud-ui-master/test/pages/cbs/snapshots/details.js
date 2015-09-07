var Page = require('astrolabe').Page;
var snapshotOverview = require('../../cbs/snapshots/overview');
var deleteSnapshotModal = require('../modals/deleteSnapshot');
var createVolumeModal = require('../modals/createVolume');

var snapshotDetailsPage = Page.create({

    url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/cbs/snapshots/ORD';
        }
    },

    open: {
        // Opens the snapshot details page for row that matches query
        // ex. open({name: 'snapshot_name'});
        value: function (query, filter) {
            snapshotOverview.go();
            return snapshotOverview.table.findSnapshot(query, filter).then(function (row) {
                return row.viewDetails();
            });
        }
    },

    snapshotDetails: {
        value: function () { return $$('rx-metadata > section > rx-meta').getText(); }
    },

    lnkDeleteSnapshot: basePage.actionBtn('Delete Snapshot'),
    lnkCreateVolume: basePage.actionBtn('Create Volume from Snapshot'),

    lnkReach: {
        get: function () {
            return element(by.cssContainingText('a', 'Go to Reach Snapshots'));
        }
    },

    deleteSnapshot: {
        value: function () {
            return this.lnkDeleteSnapshot.click().then(function () {
                return snapshotDetailsPage.deleteSnapshotModal.submit();
            });
        }
    },

    createVolume: {
        value: function (volume) {
            return this.lnkCreateVolume.click().then(function () {
                return snapshotDetailsPage.createVolumeModal.createVolume(volume);
            });
        }
    }
});

snapshotDetailsPage.deleteSnapshotModal = deleteSnapshotModal;
snapshotDetailsPage.createVolumeModal = createVolumeModal;

// modals
module.exports = snapshotDetailsPage;

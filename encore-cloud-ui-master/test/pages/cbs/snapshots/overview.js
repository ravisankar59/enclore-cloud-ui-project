var Page = require('astrolabe').Page;
var snapshotsTable = require('./overview/table');
var createVolumeModal = require('../modals/createVolume');

var snapshotsPage = Page.create({

    url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/cbs/snapshots';
        }
    },

    lnkReach: {
        get: function () {
            return element(by.cssContainingText('a', 'Go to Reach Snapshots'));
        }
    }

});

// tables 
snapshotsPage.table = snapshotsTable;

// modals
snapshotsPage.createVolumeModal = createVolumeModal;

module.exports = snapshotsPage;

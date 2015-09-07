var Page = require('astrolabe').Page;
var volumesOverviewTable = require('./overview/table');

var volumesOverviewPage = Page.create({

	url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/cbs/volumes';
        }
    },

	lnkCreateVolume: {
        get: function () { return $('a.create-volume'); }
    },

    lnkReach: {
        get: function () {
            return element(by.cssContainingText('a', 'Go to Reach Volumes'));
        }
    }
});

// tables
volumesOverviewPage.table = volumesOverviewTable;

module.exports = volumesOverviewPage;

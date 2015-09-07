var Page = require('astrolabe').Page;
var networksTable = require('./overview/overviewTable');
var basePage = require('../base');

var networkOverview = Page.create({

    url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/networks';
        }
    },

    title: {
        get: function () { return basePage.pageTitle; }
    },

    subtitle: {
        get: function () { return basePage.pageSubtitle; }
    },

    lnkCreateNewNetwork: {
        get: function () { return $('a.create-instance'); }
    },

    lnkReach: {
        get: function () {
            return element(by.cssContainingText('a', 'Go to Reach Networks'));
        }
    },

    btnIdHeader: {
        get: function () { return element(by.partialButtonText('Network ID')); }
    },

    showPrivateTab: {
        value: function () {
            return element(by.cssContainingText('A', 'Private Networks')).click();
        }
    },

    showRackspaceTab: {
        value: function () {
            return element(by.cssContainingText('A', 'Rackspace Networks')).click();
        }
    }

});

//tables
networkOverview.privateTable = networksTable.initialize('private-networks');
networkOverview.rackspaceTable = networksTable.initialize('rackspace-networks');

module.exports = networkOverview;

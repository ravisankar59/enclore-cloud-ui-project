var Page = require('astrolabe').Page;
var imagesOverviewTable = require('./overview/table');

var imagesOverviewPage = Page.create({

    url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/images';
        }
    },

    lnkReach: {
        get: function () {
            return element(by.cssContainingText('a', 'Go to Reach Server Images'));
        }
    }

});

imagesOverviewPage.table = imagesOverviewTable;
module.exports = imagesOverviewPage;

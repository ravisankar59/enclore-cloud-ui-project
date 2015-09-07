var Page = require('astrolabe').Page;
var overviewTable = require('./overview/table');

var cdnOverviewPage = Page.create({

    url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/cdn/services';
        }
    }
});

// table
cdnOverviewPage.table = overviewTable;

module.exports = cdnOverviewPage;

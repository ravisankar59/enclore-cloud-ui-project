var Page = require('astrolabe').Page;
var _ = require('lodash');
var cdnOverviewPage = require('./overview');
var detailsTable = require('./details/table');

var cdnDetailsPage = Page.create({

    url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/cdn/services';
        }
    },

    open: {
        value: function (cdnQuery, filter) {

            if (basePage.isInMidwayEnvironment()) {
                var midwayCdnId = '1a8e397f-a4cf-4071-b799-d5cb9301eeb3';
                cdnQuery = (_.isString(cdnQuery)) ? cdnQuery : midwayCdnId;
                return this.go(cdnQuery);
            }

            cdnOverviewPage.go();

            var overviewTable = cdnOverviewPage.table.initialize($('table.services-list'));
            overviewTable.filterBy(filter);

            return overviewTable.rowFromElement(0).serviceLink();
        }
    },
    cdnDetails: {
        value: function () { return $$('rx-metadata > section > rx-meta').getText(); }
    }
});

//table
cdnDetailsPage.table = detailsTable;

module.exports = cdnDetailsPage;

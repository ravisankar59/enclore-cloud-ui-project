var Page = require('astrolabe').Page;
var basePage = require('../../pages/base.js');
var lbaasOverviewPage = require('./overview.page');

var lbaasHistoryPage = Page.create({

    url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/loadbalancers/STAGING';
        }
    },

    title: {
        get: function () { return basePage.pageTitle; }
    },

    subtitle: {
        get: function () { return basePage.pageSubtitle; }
    },

    open: {
        value: function (name) {
            // To filter out DELETED status LBaaS
            var query = { name: name, status: 'ACTIVE' };
            var filter = query.name;
            if (basePage.isInMidwayEnvironment()) {
                var midwayLbId = '57361/historicalusage';
                query = (_.isString(query)) ? query : midwayLbId;
                return this.go(query);
            }
            lbaasOverviewPage.go();
            lbaasOverviewPage.table.viewLBDetails(query, filter);
            basePage.disableRxNotifyTimeout();
        }
    },

    fromDateTextBox: encore.rxForm.textField.generateAccessor($('input[name=fromDate]')),

    toDateTextBox: encore.rxForm.textField.generateAccessor($('input[name=toDate]')),

    updateRangeButton: {
        get: function () { return $('rx-date-range a'); }
    },

    dateValidationError: {
        get: function () { return $('rx-date-range rx-inline-error > span:nth-child(1)'); }
    },

    dateRangeValidationError: {
        get: function () { return $('rx-date-range rx-inline-error > span:nth-child(2)'); }
    },

    dateExceedValidationError: {
        get: function () { return $('rx-date-range rx-inline-error > span:nth-child(3)'); }
    },

    updateRangeFilter: {
        value: function (fromDate, toDate) {
            this.fromDateTextBox = fromDate;
            this.toDateTextBox = toDate;
            this.updateRangeButton.click();
        }
    }
});

// tables
lbaasHistoryPage.historyTable = require('./details/historyTable');

module.exports = lbaasHistoryPage;

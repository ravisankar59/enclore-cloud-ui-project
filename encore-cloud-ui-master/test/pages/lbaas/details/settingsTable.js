var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');
var tblCommon = require('../../base/tablesCommon');

var settingsTable = {

    tableHeader: {
        get: function () { return $('div.instance-details-clear > h2'); }
    },

    cssSettingsTable: {
        get: function () { return 'table.loadBalancer-settings'; }
    },

    cssSettingRows: {
        get: function () { return this.cssSettingsTable + ' tbody tr '; }
    },

    cssSettingHeaders: {
        get: function () { return this.cssSettingsTable  + ' thead th '; }
    },

    element: {
        get: function () { return $(this.cssSettingsTable); }
    },

    tblSettingHeaders: {
        get: function () { return $$(this.cssSettingHeaders); }
    },

    tblSettingRows: {
        get: function () { return $$(this.cssSettingRows); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    connectionLoggingToggle: {
        get: function () { return $('#connectionLoggingToggleId > div'); }
    },

    sessionPersistenceToggle: {
        get: function () { return $('#sessionPersistenceToggleId > div'); }
    },

    connectionThrottleToggle: {
        get: function () { return $('#connectionThrottleToggleId > div'); }
    },

    rateLimitToggle: {
        get: function () { return $('#temporaryRateLimitToggleId > div'); }
    },

    contentCachingToggle: {
        get: function () { return $('#contentCachingToggleId > div'); }
    },

    sslTerminationToggle: {
        get: function () { return $('#sslTerminationToggleId > div'); }
    },

    contentCachingMsg: {
        get: function () { return $('#contentCachingNonHttpId'); }
    },

    healthMonitoringToggle: {
        get: function () { return $('#healthMonitoringToggleId > div'); }
    },

    connectionThrottleEdit: {
        get: function () { return $('#connectionThrottleEditId'); }
    },

    sslTerminationEdit: {
        get: function () { return $('#sslTerminationId'); }
    },

    healthMonitoringEdit: {
        get: function () { return $('#healthMonitorEditId'); }
    },

    btnAddTemporaryRateLimit: {
        get: function () {
            return element.all(by.id('addTemporaryRateLimit')).
                                                first().element(by.css('div.rx-toggle-switch'));
        }
    },

    btnUpdateTemporaryRateLimit: {
        get: function () { return $('#rateLimitEditId');}
    },

    isToggleClickable: {
        value: function (toggle) {
            return this[toggle].getAttribute('disabled').then(function (val) {
                return val ? false : true;
            });
        }
    },

    getEditLinks: {
        value: function () {
            return element.all(by.cssContainingText('.loadBalancer-settings a > span', 'Edit')).
                getCssValue('pointer-events').then(function (val) {
                return val;
            });
        }
    },

    data: {
        value: function () {
            var cssHeaders = this.cssSettingHeaders;
            var page = this;
            return tblUtil.getTableData(cssHeaders, this.cssSettingRows).then(function (tableData) {
                return page.tblSettingRows.then(function (rows) {
                    return _.map(tableData, function (row, index) {

                        row['statusElement'] = rows[index].$('td:nth-of-type(2)');
                        row['detailsElement'] = rows[index].$('td:nth-of-type(3)');

                        row['detailsElement'].$$('div:nth-last-child(1)').get(0).getText().then(function (details) {
                            row['Details'] = details.split('\n').join();
                        });

                        row['statusElement'].$$('span').get(0).getText().then(function (status) {
                            row['Status'] = status;
                        });
                        return row;
                    });
                });
            });
        }
    }
};

settingsTable = tblCommon.wrap(settingsTable);
module.exports = Page.create(settingsTable);

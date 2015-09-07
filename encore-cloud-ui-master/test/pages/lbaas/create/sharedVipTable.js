var _ = require('lodash');
var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');
var tblCommon = require('../../base/tablesCommon');

var sharedVipTable = {

    sharedVipTableObj: {
        get: function () {
            return encore.rxOptionFormTable.initialize($('rx-option-table[data="sharedVirtualIps"]'));
        }
    },

    selectSharedVip: {
        value: function (key) {
            this.sharedVipTableObj.selectByColumnText('IP Address', key);
        }
    },

    cssSharedVipTable: {
        get: function () { return 'rx-option-table[data="sharedVirtualIps"] table '; }
    },

    cssSharedVipHeaders: {
        get: function () { return this.cssSharedVipTable + 'thead th '; }
    },

    cssSharedVipRows: {
        get: function () { return this.cssSharedVipTable + 'tbody tr '; }
    },

    tblSharedVip: {
        get: function () { return $(this.cssSharedVipTable); }
    },

    isDisplayed: {
        value: function () { return this.tblSharedVip.isDisplayed(); }
    },

    tblSharedVipRows: {
        get: function () { return $$(this.cssSharedVipRows); }
    },

    data: {
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssSharedVipHeaders, this.cssSharedVipRows).then(function (rows) {
                return page.tblSharedVipRows.then(function (rowElements) {
                    return _.map(rows, function (row, index) {
                        var protocolDetails = row['Protocol (Port)'].split(' ');
                        row.protocol = protocolDetails[0];
                        row.port = protocolDetails[1];
                        rowElements[index].$('td:first-of-type').then(function (radio) {
                            row.select = radio.click;
                        });
                        return row;
                    });
                });
            });
        }
    }
};

sharedVipTable = tblCommon.wrap(sharedVipTable);
module.exports = Page.create(sharedVipTable);

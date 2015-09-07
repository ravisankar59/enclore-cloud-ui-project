var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');

module.exports = Page.create({

    cssIpsTable: {
        get: function () { return 'table.server-ips '; }
    },

    cssIpsRows: {
        get: function () { return this.cssIpsTable + 'tbody tr '; }
    },

    cssIpsHeaders: {
        get: function () { return this.cssIpsTable + 'thead th '; }
    },

    element: {
        get: function () { return $(this.cssIpsTable); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    tblIpsRows: {
        get: function () { return $$(this.cssIpsRows); }
    },

    tableIpRemove: {
        value: function (ip) {
            return this.element.element(by.cssContainingText('tr', ip)).$(' a i.removeAddressAction');
        }
    },

    cssIpsSecondRow: {
        get: function () { return this.cssIpsTable + 'tr:nth-child(2) a i.removeAddressAction'; }
    },

    tableIpsSecondRow: {
        get: function () { return $$(this.cssIpsSecondRow); }
    },

    ipsHeaders: {
        get: function () { return tblUtil.getTableHeaders($$(this.cssIpsHeaders)); }
    },

    data: {
        value: function () { return tblUtil.getTableData(this.cssIpsHeaders, this.cssIpsRows); }
    }

});

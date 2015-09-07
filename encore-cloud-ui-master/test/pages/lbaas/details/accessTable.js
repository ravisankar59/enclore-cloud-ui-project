var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');
var tblCommon = require('../../base/tablesCommon');

var accessTable = {

    tableHeader: {
        get: function () { return $('div.flex-accessList > h2'); }
    },

    cssAccessTable: {
        get: function () { return 'table.loadBalancer-accessList '; }
    },

    cssAccessRows: {
        get: function () { return this.cssAccessTable + 'tbody tr '; }
    },

    cssAccessHeaders: {
        get: function () { return this.cssAccessTable + 'thead th '; }
    },

    element: {
        get: function () { return $(this.cssAccessTable); }
    },

    tblAccessHeaders: {
        get: function () { return $$(this.cssAccessHeaders); }
    },

    headers: {
        get: function () { return tblUtil.getTableHeaders(this.tblAccessHeaders); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    data: {
        value: function () {
            return tblUtil.getTableData(this.cssAccessHeaders, this.cssAccessRows);
        }
    },

    length: {
        get: function () {
            return $$(this.cssAccessRows).count();
        }
    },

    txtFilter: {
        get: function () { return this.element.$('rx-search-box input'); }
    },

    cssDeleteRow: {
        get: function () { return $(this.cssAccessRows + ' td:last-child a '); }
    },

    clickRemove:  {
        get: function () {return this.cssDeleteRow.click();}
    },

    isClickable: {
        value: function (linkName) {
            return this[linkName].getCssValue('pointer-events').then(function (val) {
                return val !== 'none';
            });
        }
    }
};

accessTable = tblCommon.wrap(accessTable);
module.exports = Page.create(accessTable);

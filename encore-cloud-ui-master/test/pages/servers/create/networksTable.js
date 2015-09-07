var _ = require('lodash');
var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');
var tblCommon = require('../../base/tablesCommon');

var networksTable = {
    cssNetworksTable: {
        get: function () { return 'table.networks-list '; }
    },

    cssNetworkHeaders: {
        get: function () {
            var checkboxColumnHeader = this.cssNetworksTable + 'thead tr:nth-of-type(2) th:first-of-type';
            var columnHeaders = this.cssNetworksTable + 'thead tr:nth-of-type(2) th span.ng-scope ';

            return [checkboxColumnHeader, columnHeaders].join();
        }
    },

    cssNetworkRows: {
        get: function () { return this.cssNetworksTable + 'tbody tr '; }
    },

    element: {
        get: function () { return $(this.cssNetworksTable); }
    },

    tblRows: {
        get: function () { return $$(this.cssNetworkRows); }
    },

    tblHeaders: {
        get: function () { return $$(this.cssNetworkHeaders); }
    },

    headers: {
        get: function () { return tblUtil.getTableHeaders(this.tblHeaders); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    data: {
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssNetworkHeaders, this.cssNetworkRows).then(function (rows) {
                return page.tblRows.then(function (rowElements) {
                    return _.map(rows, function (row, index) {
                        rowElements[index].$('td:first-of-type input').then(function (checkbox) {
                            row.checkbox = checkbox;
                            row.check = checkbox.click;
                        });
                        return row;
                    });
                });
            });
        }
    },

    txtFilter: {
        get: function () { return this.element.$('rx-search-box input'); }
    },

    filterBy: {
        value: function (filter) {
            var page = this;
            page.txtFilter.isPresent().then(function (isPresent) {
                if (isPresent) {
                    page.txtFilter.clear();
                    page.txtFilter.sendKeys(filter);
                }
            });
        }
    },

    checkboxForFilteredRow: {
        value: function (filterText) {
            var page = this;
            page.filterBy(filterText);
            return page.row(1).then(function (row) {
                return row.checkbox;
            });
        }
    },

    clickNetworkCheckbox: {
        value: function (filterText) {
            var page = this;
            page.filterBy(filterText);
            page.row(1).then(function (row) {
                row.checkbox.click();
            });
        }
    }
};

networksTable = tblCommon.wrap(networksTable);
module.exports = Page.create(networksTable);

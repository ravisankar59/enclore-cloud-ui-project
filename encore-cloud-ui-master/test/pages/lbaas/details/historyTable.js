var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');
var tblCommon = require('../../base/tablesCommon');

var historyTable = {
    tableHeader: {
        get: function () { return $('div.table-filters > h2'); }
    },

    cssHistoryUsageTable: {
        get: function () { return 'table.loadbalancers-historyUsage '; }
    },

    cssHistoryUsageRows: {
        get: function () { return this.cssHistoryUsageTable + 'tbody tr '; }
    },

    cssHistoryUsageHeaders: {
        get: function () {
            var rxSortableColumns = this.cssHistoryUsageTable + 'th.column-title span.ng-scope ';
            return rxSortableColumns;
        }
    },

    headers: {
        get: function () { return tblUtil.getTableHeaders(this.tblHistoryUsageHeaders); }
    },

    element: {
        get: function () { return $(this.cssHistoryUsageTable); }
    },

    tblHistoryUsageHeaders: {
        get: function () { return $$(this.cssHistoryUsageHeaders); }
    },

    tblHistoryUsageRows: {
        get: function () { return $$(this.cssHistoryUsageRows); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    data: {
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssHistoryUsageHeaders, this.cssHistoryUsageRows).
                then(function (tableData) {
                return page.tblHistoryUsageRows.then(function () {
                    return _.map(tableData, function (row) {
                        var rowNameId = row['Name (ID)'].split('\n');
                        row.name = _.first(rowNameId).trim();
                        row.id = _.last(rowNameId).trim();

                        return row;
                    });
                });
            });
        }
    }
};

historyTable = tblCommon.wrap(historyTable);
module.exports = Page.create(historyTable);

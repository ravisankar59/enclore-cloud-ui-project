var tblCommon = require('../../base/tablesCommon');
var Page = require('astrolabe').Page;

var Row = {

    rowData: {
        get: function () {
            var data = this.rowRoot.$$('td');
            return data.getText;
        }
    },

    serviceLink: {
        get: function () {
            var link = this.rowRoot.$('td:nth-of-type(2) > a');
            return link.click;
        }
    }
};

var overviewTable = {

    cssCdnHeaders: {
        get: function () {
            var rxSortableColumns = 'th.column-title span.ng-scope ';
            var unsortableColumns = 'th.column-title:nth-of-type(3), ' +
                                    'th.column-title:nth-of-type(4), ' +
                                    'th.column-title:nth-of-type(5) ';

            return [rxSortableColumns, unsortableColumns].join();
        }
    },

    headers: {
        get: function () {
            var heads = this.tableRoot.$$(this.cssCdnHeaders);
            return heads.getText;
        }
    },

    errorRowText: {
        get: function () {
            var elem = this.tableRoot.$('tbody > tr > td');
            return elem.getText;
        }
    },

    rowFromElement: {
        value: function (rowNum) {
            var rowObj = Page.create(Row);
            rowObj.rowRoot = this.tableRoot.all(by.xpath('./tbody')).get(rowNum);
            return rowObj;
        }
    }
};

overviewTable = tblCommon.wrap(overviewTable);

module.exports = {
    initialize: function (root) {
        var table = Page.create(overviewTable);
        table.tableRoot = root;
        return table;
    }
};

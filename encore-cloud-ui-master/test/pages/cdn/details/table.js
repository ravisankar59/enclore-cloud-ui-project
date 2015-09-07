var Page = require('astrolabe').Page;
var subTable = require('./subTable');

var Row = {

    rowData: {
        get: function () {
            var data = this.rowRoot.$$('td');
            return data.getText;
        }
    },

    toggle: {
        get: function () {
            var elem = this.rowRoot.$('td.toggle-cell span');
            return elem.click;
        }
    },

    subtable: {
        get: function () {
            var sub = this.rowRoot.$('tbody .subtable');
            return subTable.initialize(sub);
        }
    }
};

var Table = {

    headers: {
        get: function () {
            var heads = this.tableRoot.$$('thead > tr > th');
            return heads.getText;
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

module.exports = {
    initialize: function (root) {
        var table = Page.create(Table);
        table.tableRoot = root;
        return table;
    }
};

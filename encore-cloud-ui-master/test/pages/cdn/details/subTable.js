var Page = require('astrolabe').Page;

var subRow = {

    rowData: {
        get: function () {
            var data = this.subRoot.$$('tr > td');
            return data.getText;
        }
    }
};

var subTable = {

    headers: {
        get: function () {
            var heads = this.subRoot.$$('thead > tr > th ');
            return heads.getText;
        }
    },

    rowFromElement: {
        value: function (rowNum) {
            var subObj = Page.create(subRow);
            subObj.subRoot = this.subRoot.$$('tbody').get(rowNum);
            return subObj;
        }
    }
};

module.exports = {
    initialize: function (root) {
        var subtable = Page.create(subTable);
        subtable.subRoot = root;
        return subtable;
    }
};

var tblUtil = require('../../../base/util/tables');
var tblCommon = require('../../../base/tablesCommon');

module.exports = tblCommon.wrap({

    cssElement: {
        get: function  () { return 'table.suspend-servers '; }
    },

    element: {
        get: function  () { return $(this.cssElement); }
    },

    cssRows: {
        get: function () { return this.cssElement + 'tbody tr'; }
    },

    cssHeaders: {
        get: function () {
            return this.cssElement + 'thead th span.ng-scope, ' +
                   this.cssElement + 'thead th:last-of-type';
        }
    },

    tblRows: {
        get: function () { return $$(this.cssRows); }
    },

    data: {
        value: function () {
            var page = this;

            return tblUtil.getTableData(this.cssHeaders, this.cssRows).then(function (data) {
                return page.tblRows.then(function (rows) {
                    return _.map(data, function (row, index) {

                        rows[index].$('td:first-of-type a').then(function (detailsLink) {
                            row.viewDetails = detailsLink.click;
                        });

                        rows[index].$('td:last-of-type i').then(function (removeLink) {
                            row.remove = removeLink.click;
                        });

                        return row;
                    });
                });
            });
        }
    }
});

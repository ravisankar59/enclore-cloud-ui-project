var _ = require('lodash');
var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');
var tblUtil = require('../../base/util/tables');

var resizeServerModal = {
    cssFlavorTable: {
        get: function () { return '.table-striped.rx-option-table '; }
    },

    cssFlavorHeaders: {
        get: function () { return this.cssFlavorTable + 'thead th'; }
    },

    cssFlavorRows: {
        get: function () { return this.cssFlavorTable + 'tbody tr'; }
    },

    tblFlavorRows: {
        get: function () { return $$(this.cssFlavorRows); }
    },

    flavorsTable: {
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssFlavorHeaders, this.cssFlavorRows).then(function (tableData) {
                return page.tblFlavorRows.then(function (rows) {
                    return _.map(tableData, function (row, index) {
                        rows[index].$('td input').then(function (radioButton) {
                            row.select = radioButton.click;
                        });

                        return row;
                    });
                });
            });
        }
    },

    resizeServer: {
        value: function (flavorName) {
            var page = this;
            page.flavorsTable().then(function (flavors) {
                var flavor = _.find(flavors, function (flavor) {
                    return _.contains(flavor['Name'], flavorName);
                });

                flavor.select();
                page.submit();
            });
        }
    },
};

resizeServerModal = baseModal.wrap(resizeServerModal);
module.exports = Page.create(resizeServerModal);

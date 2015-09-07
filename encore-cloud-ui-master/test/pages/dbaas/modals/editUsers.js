var _ = require('lodash');
var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');
var tblUtil = require('../../base/util/tables');

var editUsersModal = {

    cssUserTable: {
        get: function () {
            return 'rx-option-table[field-id="dbaas-users-checkbox"] table ';
        }
    },

    cssUserHeaders: {
        get: function () { return this.cssUserTable + 'thead th'; }
    },

    cssUserRows: {
        get: function () { return this.cssUserTable + 'tbody tr'; }
    },

    userTable: {
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssUserHeaders, this.cssUserRows).then(function (tableData) {
                return $$(page.cssUserRows).then(function (rows) {
                    return _.map(tableData, function (row, index) {
                        var checkboxSelector = 'td:first-of-type input';
                        rows[index].$(checkboxSelector).then(function (checkbox) {
                            row.check = checkbox.click;
                            row.isChecked = _.partial(checkbox.getAttribute, 'checked');
                        });
                        return row;
                    });
                });
            });
        }
    },
};

editUsersModal = baseModal.wrap(editUsersModal);
module.exports = Page.create(editUsersModal);

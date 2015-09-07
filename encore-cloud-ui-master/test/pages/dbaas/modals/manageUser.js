var _ = require('lodash');
var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');
var tblUtil = require('../../base/util/tables');

var createUserModal = {

    cssDatabaseTable: {
        value: 'rx-option-table[field-id="dbaas-user-checkbox"]'
    },

    cssDatabaseRows: {
        get: function () { return this.cssDatabaseTable + 'tbody tr'; }
    },

    cssDatabaseHeaders: {
        get: function () { return this.cssDatabaseTable + 'thead th'; }
    },

    lblUsername: {
        get: function () { return $('rx-form-item[label="Username"] span.field-label'); }
    },

    CurrentUsername: {
        get: function () { return $('#dbaas-current-user-name'); }
    },

    eleDatabaseTable: {
        get: function () { return $(this.cssDatabaseTable); }
    },

    lblDatabases: {
        get: function () { return $('legend.field-legend'); }
    },

    eleDatabaseLabel: {
        value: function (databaseName) {
            return element(by.cssContainingText('span', databaseName));
        }
    },

    noDatabasesErrorMsg: {
        get: function () { return $('.modal .msg-warn'); }
    },

    databasesTableData: {
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssDatabaseHeaders, this.cssDatabaseRows).then(function (tableData) {
                return page.$$(page.cssDatabaseRows).then(function (rows) {
                    return _.map(tableData, function (row, index) {
                        var checkboxSelector = 'td:first-of-type';
                        rows[index].$(checkboxSelector).then(function (checkbox) {
                            row.check = checkbox.click;
                        });

                        return row;
                    });
                });
            });
        }
    },

    manageAccess: {
        value: function (databases) {
            var page = this;
            _.each(databases, function (dbName) {
                page.eleDatabaseLabel(dbName).click();
            });
            this.submit();
        }
    },
};
createUserModal = baseModal.wrap(createUserModal);
module.exports = Page.create(createUserModal);

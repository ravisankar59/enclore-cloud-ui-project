var _ = require('lodash');
var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');
var tblCommon = require('../../base/tablesCommon');
var actionCog = require('../../base/actionCog');
var createDatabaseModal = require('../modals/createDatabase');

var databaseTable = {

    cssDatabasesTable: {
        get: function () { return 'table.instance-databases '; }
    },

    cssDatabaseRows: {
        get: function () { return this.cssDatabasesTable + 'tbody tr '; }
    },

    cssDatabaseHeaders: {
        get: function () { return this.cssDatabasesTable + 'thead th '; }
    },

    element: {
        get: function () { return $(this.cssDatabasesTable); }
    },

    tblDatabasesRows: {
        get: function () { return $$(this.cssDatabaseRows); }
    },

    tblDatabaseHeaders: {
        get: function () { return $$(this.cssDatabaseHeaders); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    label: {
        get: function () { return $('div.flex-databases h2.page-title.pull-left'); }
    },

    headers: {
        get: function () { return tblUtil.getTableHeaders(this.tblDatabaseHeaders); }
    },

    lnkCreateDatabase: {
        get: function () { return element(by.cssContainingText('rx-modal-action a', 'Create Database')); }
    },

    data: {
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssDatabaseHeaders, this.cssDatabaseRows).then(function (tableData) {
                return page.tblDatabasesRows.then(function (rows) {
                    return _.map(tableData, function (row, index) {
                        rows[index].$('td:last-of-type').then(function (cogElement) {
                            row.Actions = actionCog(cogElement);
                            row.actionMenu = encore.rxActionMenu.initialize(cogElement);
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

    createDatabase: {
        /**
         * Creates a database from the link above the databases table.
         * 'options' is an object containing the values to be inputed
         * into the create database modal.
         * options.name - database name
         * options.characterSet - character set (defaults to utf-8 if undefined)
         * options.collation - collation (defaults to utf8_general_ci if undefined)
         */
        value: function (options) {
            this.lnkCreateDatabase.click();
            return createDatabaseModal.createDatabase(options);
        }
    },

    getErrorRow: {
        value: function () {
            return this.tblDatabasesRows.then(function (rows) {
                return rows[0].$('td').then(function (td) {
                    return td.getText();
                });
            });
        }
    }
};

databaseTable = tblCommon.wrap(databaseTable);
module.exports = Page.create(databaseTable);

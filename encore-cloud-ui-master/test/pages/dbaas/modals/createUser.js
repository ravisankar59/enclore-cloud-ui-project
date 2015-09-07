var _ = require('lodash');
var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');
var tblUtil = require('../../base/util/tables');

var createUserModal = {

    cssDatabaseTable: {
        value: 'rx-option-table[field-id="dbaas-user-checkbox"] table '
    },

    cssDatabaseRows: {
        get: function () { return this.cssDatabaseTable + 'tbody tr'; }
    },

    cssDatabaseHeaders: {
        get: function () { return this.cssDatabaseTable + 'thead th'; }
    },

    lblUsername: {
        get: function () { return $('label[for="dbaas-user-name"]'); }
    },

    txtUsername: {
        get: function () { return $('#dbaas-user-name'); },
        set: function (username) {
            username = username || '';
            this.txtUsername.clear();
            this.txtUsername.sendKeys(username);
        }
    },

    lblPassword: {
        get: function () { return $('label[for="dbaas-user-password"]'); }
    },

    txtPassword: {
        get: function () { return $('#dbaas-user-password'); },
        set: function (password) {
            password = password || '';
            this.txtPassword.clear();
            this.txtPassword.sendKeys(password);
        }
    },

    eleDatabaseTable: {
        get: function () { return $(this.cssDatabaseTable); }
    },

    optDatabaseTable: {
        get: function () { return encore.rxOptionFormTable.initialize(this.eleDatabaseTable); }
    },

    lblHost: {
        get: function () { return $('label[for="dbaas-user-host"]'); }
    },

    txtHost: {
        get: function () { return $('#dbaas-user-host'); },
        set: function (host) {
            host = host || '';
            this.txtHost.sendKeys(host);
        }
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
        get: function () { return $('.modal .msg-warn').getText(); }
    },

    databaseTable: {
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssDatabaseHeaders, this.cssDatabaseRows).then(function (tableData) {
                return $$(page.cssDatabaseRows).then(function (rows) {
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

    createUser: {
        value: function (user) {
            // var page = this;
            this.txtUsername = user.name;
            this.txtPassword = user.password;
            this.txtHost = user.host;
            _.each(user.databases, function (dbName) {
                this.optDatabaseTable.selectByColumnText('Database', dbName);
            }, this);
            this.submit();
        }
    },
};

createUserModal = baseModal.wrap(createUserModal);
module.exports = Page.create(createUserModal);

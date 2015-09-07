var _ = require('lodash');
var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');
var tblCommon = require('../../base/tablesCommon');
var actionCog = require('../../base/actionCog');
var createUserModal = require('../modals/createUser');

var usersTable = {

    cssUsersTable: {
        get: function () { return '.instance-users '; }
    },

    cssUserRows: {
        get: function () { return this.cssUsersTable + 'tbody tr '; }
    },

    cssUserHeaders: {
        get: function () { return this.cssUsersTable + 'thead th '; }
    },

    element: {
        get: function () { return $(this.cssUsersTable); }
    },

    tblUserRows: {
        get: function () { return $$(this.cssUserRows); }
    },

    tblUserHeaders: {
        get: function () { return $$(this.cssUserHeaders); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    label: {
        get: function () { return $('div.flex-users h2.page-title.pull-left'); }
    },

    headers: {
        get: function () { return tblUtil.getTableHeaders(this.tblUserHeaders); }
    },

    lnkCreateUser: {
        get: function () { return $('div.flex-users .dbaas-actions a.modal-link'); }
    },

    data: {
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssUserHeaders, this.cssUserRows).then(function (tableData) {
                return page.tblUserRows.then(function (rows) {
                    return _.map(tableData, function (row, index) {
                        rows[index].$('td:last-of-type').then(function (cogElement) {
                            row.Actions = actionCog(cogElement);
                        });
                        return row;
                    });
                });
            });
        }
    },

    getErrorRow: {
        value: function () {
            return this.tblUserRows.then(function (rows) {
                return rows[0].$('td').then(function (td) {
                    return td.getText();
                });
            });
        }
    },

    createUser: {
        /**
         * Create a user from the link above the users table.
         * 'user' is an object containing the values needed to create a user.
         * user.name - username
         * user.password - user password
         * user.host - host to add the user to
         * user.databases - a list with db names to add the user to
         */
        value: function (user) {
            this.lnkCreateUser.click();
            createUserModal.createUser(user);
        }
    },

    openDeleteUser: {
        value: function (name) {
            this.openAction(name, 'Delete User');
        }
    },

    openManageUser: {
        value: function (name) {
            this.openAction(name, 'Manage User Access');
        }
    },

    openEditUser: {
        value: function (name) {
            this.openAction(name, 'Edit User');
        }
    },

    openAction: {
        value: function (username, actionName) {
            this.find({ Name: username }).then(function (user) {
                user.Actions.expand().then(function (actions) {
                    actions[actionName].click();
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
    }
};

usersTable = tblCommon.wrap(usersTable);
module.exports = Page.create(usersTable);

var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');

module.exports = Page.create({

    cssManagedPasswordsTable: {
        get: function () { return 'table.managed-passwords '; }
    },

    cssManagedPasswordsList: {
        get: function () { return this.cssManagedPasswordsTable + 'tbody.managed-password-list '; }
    },

    cssManagedPasswordsRows: {
        get: function () { return this.cssManagedPasswordsList + 'tr '; }
    },

    cssManagedPasswordsHeaders: {
        get: function () { return this.cssManagedPasswordsTable + 'thead th '; }
    },

    element: {
        get: function () { return $(this.cssManagedPasswordsTable); }
    },

    eleManagedPasswordsList: {
        get: function () { return $(this.cssManagedPasswordsList); }
    },

    tblManagedPasswordsRows: {
        get: function () { return $$(this.cssManagedPasswordsRows); }
    },

    managedPasswordsHeaders: {
        get: function () { return tblUtil.getTableHeaders($$(this.cssManagedPasswordsHeaders)); }
    },

    data: {
        get: function () { return tblUtil.getTableData(this.cssManagedPasswordsHeaders, this.cssManagedPasswordsRows); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    }

});

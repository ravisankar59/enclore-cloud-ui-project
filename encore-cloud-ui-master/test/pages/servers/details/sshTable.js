var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');

module.exports = Page.create({

    cssSshTable: {
        get: function () { return 'table.ssh-keys '; }
    },

    cssSshRows: {
        get: function () { return this.cssSshTable + 'tbody tr '; }
    },

    cssSshHeaders: {
        get: function () { return this.cssSshTable + 'thead th '; }
    },

    element: {
        get: function () { return $(this.cssSshTable); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    tblSshRows: {
        get: function () { return $$(this.cssSshRows); }
    },

    sshHeaders: {
        get: function () { return tblUtil.getTableHeaders($$(this.cssSshHeaders)); }
    },

    data: {
        value: function () { return tblUtil.getTableData(this.cssSshHeaders, this.cssSshRows); }
    }

});

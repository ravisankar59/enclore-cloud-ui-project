var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');

module.exports = Page.create({

    cssDeviceTable: {
        get: function () { return 'table.device-metadata '; }
    },

    cssDeviceHeaders: {
        get: function () { return this.cssDeviceTable + 'thead th '; }
    },

    cssDeviceRows: {
        get: function () { return this.cssDeviceTable + 'tr '; }
    },

    element: {
        get: function () { return $(this.cssDeviceTable); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    tblDeviceMetadataRows: {
        get: function () { return this.cssDeviceRows; }
    },

    headers: {
        get: function () { return tblUtil.getTableHeaders($$(this.cssDeviceHeaders)); }
    },

    data: {
        value: function () { return tblUtil.keyValueTable.initialize(this.tblServerDeviceRows); }
    },

});

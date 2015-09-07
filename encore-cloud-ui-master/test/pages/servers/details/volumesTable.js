var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');
var tblCommon = require('../../base/tablesCommon');

var volumesTable = tblCommon.wrap({

    cssVolumesTable: {
        get: function () { return 'table.server-attached-volumes '; }
    },

    cssVolumeHeaders: {
        get: function () { return this.cssVolumesTable + 'thead th '; }
    },

    cssVolumeRows: {
        get: function () { return this.cssVolumesTable + 'tbody tr '; }
    },

    element: {
        get: function () { return $(this.cssVolumesTable); }
    },

    tblAttachedVolumesRows: {
        get: function () { return $$(this.cssVolumeRows); }
    },

    tblAttachedVolumesColumns: {
        get: function () { return $$(this.cssVolumeHeaders); }
    },

    headers: {
        get: function () { return tblUtil.getTableHeaders(this.tblAttachedVolumesColumns); }
    },

    data: {
        value: function () {
            return tblUtil.getTableData(this.cssVolumeHeaders, this.cssVolumeRows);
        }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    openAttachedVolume: {
        value: function (volumeId) {
            this.element.element(by.linkText(volumeId)).click();
        }
    }
});

module.exports = Page.create(volumesTable);

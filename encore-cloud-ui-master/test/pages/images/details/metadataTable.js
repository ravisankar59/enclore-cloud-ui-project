var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');
var tblCommon = require('../../base/tablesCommon');

var imageMetadata = {

    cssMetadataTable: {
        get: function () { return 'table.image-metadata '; }
    },

    cssMeatadataLabels: {
        get: function () { return this.cssMetadataTable + 'tbody tr td:first-of-type '; }
    },

    cssMeatadataValues: {
        get: function () { return this.cssMetadataTable + 'tbody tr td:nth-of-type(2) '; }
    },

    cssMetadataRows: {
        get: function () { return this.cssMetadataTable + 'tbody tr '; }
    },

    cssMetadataHeaders: {
        get: function () {
            var rxSortableColumns = this.cssMetadataTable + 'thead th.column-title span.ng-scope ';
            var unsortableColumns = this.cssMetadataTable + 'thead th.column-title:nth-of-type(2)';

            return [rxSortableColumns, unsortableColumns].join();
        }
    },

    element: {
        get: function () { return $(this.cssMetadataTable); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    tblMetadataRows: {
        get: function () { return $$(this.cssMetadataRows); }
    },

    metadataHeaders: {
        get: function () { return tblUtil.getTableHeaders($$(this.cssMetadataHeaders)); }
    },

    data: {
        value: function () { return tblUtil.getTableData(this.cssMetadataHeaders, this.cssMetadataRows); }
    },

    keyValueData: {
        value: function () { return tblUtil.getKeyValueData(this.cssMeatadataLabels, this.cssMeatadataValues); }
    }

};

imageMetadata = tblCommon.wrap(imageMetadata);
module.exports = Page.create(imageMetadata);

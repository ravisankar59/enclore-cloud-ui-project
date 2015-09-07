var Page = require('astrolabe').Page;
var tblCommon = require('../../base/tablesCommon');

var detailsTable = {

    cssDetailsTable: {
        get: function () { return 'rx-metadata.loadBalancer-details '; }
    },

    data: {
        value: function () { return $$(this.cssDetailsTable + '> section > rx-meta').getText(); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    }
};

detailsTable = tblCommon.wrap(detailsTable);
module.exports = Page.create(detailsTable);

var Page = require('astrolabe').Page;
var tblCommon = require('../../base/tablesCommon');

var imageDetails = {

    cssDetailsTable: {
        get: function () { return 'rx-metadata.image-details '; }
    },

    element: {
        get: function () { return $(this.cssDetailsTable); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    data: {
        value: function () { return $$(this.cssDetailsTable + '> section > rx-meta').getText(); }
    }

};

imageDetails = tblCommon.wrap(imageDetails);
module.exports = Page.create(imageDetails);

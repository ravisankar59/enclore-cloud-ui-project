var Page = require('astrolabe').Page;
var tblCommon = require('../../base/tablesCommon');

var instanceDetails = {

    cssDetailsTable: {
        get: function () { return 'rx-metadata.instance-details > section'; }
    },

    element: {
        get: function () { return $(this.cssDetailsTable); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    data: {
        value: function () { return $$(this.cssDetailsTable + '> rx-meta').getText(); }
    }

};

instanceDetails = tblCommon.wrap(instanceDetails);
module.exports = Page.create(instanceDetails);

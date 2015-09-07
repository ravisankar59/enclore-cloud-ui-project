var Page = require('astrolabe').Page;

module.exports = Page.create({

    cssDetailsTable: {
        get: function () { return 'rx-metadata.server-details '; }
    },

    element: {
        get: function () { return $(this.cssDetailsTable); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    data: {
        value: function () { return $$(this.cssDetailsTable + '> section > rx-meta').getText(); }
    },

    labels: {
        value: function () {
            var server = $(this.cssDetailsTable).evaluate('server');
            return server;
        }
    },

});

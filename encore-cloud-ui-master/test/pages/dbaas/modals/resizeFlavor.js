var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');
var basePage = require('../../base');

var resizeFlavorModal = {
    lblCurrentLabel: {
        get: function () { return $('div[ng-if="flavors"] p'); }
    },

    lblNewFlavor: {
        get: function () { return $('label[for="instanceFlavor"'); }
    },

    selNewFlavor: {
        get: function () { return $('#instanceFlavor'); }
    },

    resizeFlavor: {
        value: function (flavor) {
            basePage.selectItem(this.selNewFlavor, 'option', flavor);
            this.submit();
        }
    },

};

resizeFlavorModal = baseModal.wrap(resizeFlavorModal);
module.exports = Page.create(resizeFlavorModal);

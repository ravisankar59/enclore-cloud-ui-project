var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var resizeVolumeModal = {
    lblNewSize: {
        get: function () { return $('label[for="volumeSize"]'); }
    },

    numNewSize: {
        get: function () { return $('#volumeSize'); }
    },

    resizeVolume: {
        value: function (size) {
            this.numNewSize.sendKeys(size);
            this.submit();
        }
    },

};

resizeVolumeModal =  baseModal.wrap(resizeVolumeModal);
module.exports = Page.create(resizeVolumeModal);

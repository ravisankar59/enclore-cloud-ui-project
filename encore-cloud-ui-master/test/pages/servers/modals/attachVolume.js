var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');
var basePage = require('../../base');

var attachVolumeModal = {

    lblVolumeName: {
        get: function () { return $('label[for="volumeId"]'); }
    },

    lblDevicePath: {
        get: function () { return $('label[for="devicePath"]'); }
    },

    selVolumeName: {
        get: function () { return $('#volumeId'); }
    },

    selDevicePath: {
        get: function () { return $('#devicePath'); }
    },

    tblVolumeOptions: {
        get: function () { return this.selVolumeName.$$('option'); }
    },

    attachVolume: {
        value: function (volumeName, mntPath) {
            basePage.selectItem(this.selVolumeName, 'option', volumeName);
            basePage.selectItem(this.selDevicePath, 'option', mntPath);
            this.submit();
        }
    },
};

attachVolumeModal = baseModal.wrap(attachVolumeModal);
module.exports = Page.create(attachVolumeModal);

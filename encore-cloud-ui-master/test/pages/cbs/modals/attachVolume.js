var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');
var basePage = require('../../base');

var attachVolumeModal = {

    lblServerName: {
        get: function () { return $('label[for="serverId"]'); }
    },

    lblDevicePath: {
        get: function () { return $('label[for="devicePath"]'); }
    },

    selServerName: {
        get: function () { return $('select#serverId'); }
    },

    selDevicePath: {
        get: function () { return $('select#devicePath'); }
    },

    tblServerOptions: {
        get: function () { return this.selServerName.$$('option'); }
    },

    attachVolume: {
        value: function (serverName, devicePath) {
            serverName += ' (active)';
            basePage.selectItem(this.selServerName, 'option', serverName);
            basePage.selectItem(this.selDevicePath, 'option', devicePath);
            this.submit();
        }
    }
};

attachVolumeModal = baseModal.wrap(attachVolumeModal);
module.exports = Page.create(attachVolumeModal);

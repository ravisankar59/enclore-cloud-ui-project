var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');
var basePage = require('../../base');

var createVolumeModal = {

    txtVolumeName: {
        get: function () { return $('input#volume-name'); }
    },

    txtDescription: {
        get: function () { return $('input#volume-description'); }
    },

    numSize: {
        get: function () { return $('input#volume-size'); }
    },

    selType: {
        get: function () { return $('select#volume-type'); }
    },

    createVolume: {
        value: function (volume) {
            this.txtVolumeName.sendKeys(volume.name);
            this.txtDescription.sendKeys(volume.description);
            this.numSize.sendKeys(volume.size);
            basePage.selectItem(this.selType, 'option', volume.type.toUpperCase());
            return this.submit();
        }
    }
};

createVolumeModal = baseModal.wrap(createVolumeModal);
module.exports = Page.create(createVolumeModal);

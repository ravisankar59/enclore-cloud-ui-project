var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var createImageModal = {

    lblImageName: {
        get: function () { return $('label[for="server_name"]'); }
    },

    txtImageName: {
        get: function () { return $('#server_name'); }
    },

    createImage: {
        value: function (imageName) {
            this.txtImageName.sendKeys(imageName);
            this.submit();
        }
    }
};

createImageModal = baseModal.wrap(createImageModal);
module.exports = Page.create(createImageModal);

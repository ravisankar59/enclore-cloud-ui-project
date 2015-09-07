var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var changeNameModal = {

    lblServerName: {
        get: function () { return $('label[for="server_name"]'); }
    },

    txtServerName: {
        get: function () { return $('#server_name'); }
    },

    changeName: {
        value: function (serverName) {
            this.txtServerName.sendKeys(serverName);
            this.submit();
        }
    },
};

changeNameModal = baseModal.wrap(changeNameModal);
module.exports = Page.create(changeNameModal);

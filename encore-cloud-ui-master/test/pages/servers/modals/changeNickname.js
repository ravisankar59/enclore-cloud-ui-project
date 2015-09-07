var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var changeNicknameModal = {

    lblServerNickname: {
        get: function () { return $('label[for="server_nickname"]'); }
    },

    txtServerNickname: {
        get: function () { return $('#server_nickname'); }
    },

    changeNickname: {
        value: function (serverNickname) {
            this.txtServerNickname.sendKeys(serverNickname);
            this.submit();
        }
    },
};

changeNicknameModal = baseModal.wrap(changeNicknameModal);
module.exports = Page.create(changeNicknameModal);

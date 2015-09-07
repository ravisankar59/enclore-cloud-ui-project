var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var changePasswordModal = {

    lblPassword: {
        get: function () { return $('label[for="server_password"]'); }
    },

    txtPassword: {
        get: function () { return $('#server_password'); }
    },

    errPassword: {
        get: function () {
            return $('rx-form-item[label="New Password"] .inline-error');
        }
    },

    changePassword: {
        value: function (password) {
            this.txtPassword.sendKeys(password);
            this.submit();
        }
    },
};

changePasswordModal = baseModal.wrap(changePasswordModal);
module.exports = Page.create(changePasswordModal);

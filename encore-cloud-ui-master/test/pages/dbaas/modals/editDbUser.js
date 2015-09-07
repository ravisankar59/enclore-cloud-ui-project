var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var editUserModal = {

    lblCurrentUsername: {
        get: function () { return $('rx-form-item[label="Current Username"] span.field-label'); }
    },

    lblNewUsername: {
        get: function () { return $('rx-form-item[label="New Username"] span.field-label'); }
    },

    lblNewPassword: {
        get: function () { return $('rx-form-item[label="New Password"] span.field-label'); }
    },
    
    lblHost: {
        get: function () { return $('rx-form-item[label="Host"] span.field-label'); }
    },
    
    currentUsername: {
        get: function () { return $('#dbaas-current-user-name'); }
    },

    txtNewUsername: {
        get: function () { return $('rx-form-item[label="New Username"] span.field-input input'); }
    },

    txtNewPassword: {
        get: function () { return $('rx-form-item[label="New Password"] span.field-input input'); }
    },
    
    txtHost: {
        get: function () { return $('rx-form-item[label="Host"] span.field-input input'); }
    },

    editUser: {
        value: function (user) {
            user.name = user.name || '';
            user.password = user.password || '';
            user.host = user.host || '';
            this.txtNewUsername.sendKeys(user.name);
            this.txtNewPassword.sendKeys(user.password);
            this.txtHost.sendKeys(user.host);
            this.submit();
        }
    },
};

editUserModal = baseModal.wrap(editUserModal);
module.exports = Page.create(editUserModal);

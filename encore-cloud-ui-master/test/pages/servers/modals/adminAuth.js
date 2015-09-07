var baseModal = require('../../base/modal');
var util = require('../../base/util/util');
var creds = require('../../../secrets').credentials;

var adminAuthModal = {

    itemPassword: {
        get: function () { return $('rx-form-item[label="Password"]'); }
    },

    lblPassword: {
        get: function () { return this.itemPassword.$('label'); }
    },

    txtPassword: {
        get: function () { return this.itemPassword.$('input'); }
    },

    divError: {
        get: function () { return this.itemPassword.$('.inline-error'); }
    },

    txtError: {
        get: function () { return this.divError.getText(); }
    },

    authenticate: {
        value: function (password) {
            this.txtPassword.sendKeys(password);
        }
    },

    authSubmit: {
        value: function (password) {
            // Find the password from the credentials if not given
            if (password === undefined) {
                if (!basePage.isInMidwayEnvironment()) {
                    var username = _.first(_.keys(creds));
                    password = creds[username];
                } else {
                    password = 'pass';
                }
            }

            this.authenticate(password);
            this.submit();
        }
    }
};

module.exports = {
    wrap: function (modalObj) {
        var tmp = baseModal.wrap(adminAuthModal);
        return util.combine(tmp, modalObj);
    }
};

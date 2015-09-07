var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');

var rebootServerModal = {
    lblSoftReboot: {
        get: function () { return $('label[for="server_reboot_soft"]'); }
    },

    radSoftReboot: {
        get: function () { return $('#server_reboot_soft'); }
    },

    lblHardReboot: {
        get: function () { return $('label[for="server_reboot_hard"]'); }
    },

    radHardReboot: {
        get: function () { return $('#server_reboot_hard'); }
    },

    lnkMigrationWarning: {
        get: function () { return $('rx-modal-form rx-notification a'); }
    },

    lnkMigrationWarningHref: {
        get: function () { return this.lnkMigrationWarning.getAttribute('href'); }
    },

    lnkMigrationWarningTxt: {
        get: function () { return this.lnkMigrationWarning.getText(); }
    },

    rebootServer: {
        value: function (rebootType) {
            var rebootOptions = {
                soft: this.radSoftReboot,
                hard: this.radHardReboot
            };

            rebootOptions[rebootType].click();
            this.submit();
        }
    }
};

rebootServerModal = baseModal.wrap(rebootServerModal);
module.exports = Page.create(rebootServerModal);

var util = require('../../base/util/util');
var basePage = require('../../base');
var wait = require('../../base/wait');

// #TODO break tables into their own page objects
var baseDetails = {

    frmRxModal: {
        get: function () { return $('rx-modal-form'); }
    },

    btnShowPasswords: {
        get: function () { return $('a.show-passwords'); }
    },

    btnAddPublicIp: {
        get: function () { return $('a i.addPublicAddressAction'); }
        // get: function () { return $('a.show-passwords'); }
    },

    btnCreateImage: basePage.actionBtn('Create Image'),

    btnChangePassword: basePage.actionBtn('Change Password'),

    btnChangeName: basePage.actionBtn('Change Name'),

    btnChangeNickname:  basePage.actionBtn('Change Nickname'),

    btnRebootServer: basePage.actionBtn('Reboot Server'),

    btnRebuildServer: basePage.actionBtn('Rebuild Server'),

    btnResizeServer: basePage.actionBtn('Resize Server'),

    btnVerifyResize: basePage.actionBtn('Verify Resize'),

    btnRevertResize: basePage.actionBtn('Revert Resize'),

    btnRescueServer: basePage.actionBtn('Rescue Server'),

    btnUnrescueServer: basePage.actionBtn('Unrescue Server'),

    btnDeleteServer: basePage.actionBtn('Delete Server'),

    btnOpenConsole: basePage.actionBtn('Open Console'),

    btnMigrateServer: basePage.actionBtn('Migrate Server'),

    btnSuspendServer: basePage.actionBtn('Suspend Server'),

    btnUnsuspendServer: basePage.actionBtn('Unsuspend Server'),

    btnCreateTicket: basePage.actionBtn('Create Ticket for Server'),

    eleConsoleSpinnerContainer: {
        get: function () { return $('div.spinner-container'); }
    },

    rebootServer: {
        value: function (rebootType) {
            this.btnRebootServer.click();
            this.rebootServerModal.rebootServer(rebootType);
        }
    },

    createImage: {
        value: function (imageName) {
            this.btnCreateImage.click();
            var imageNameField = this.frmRxModal.$('#server_name');
            imageNameField.sendKeys(imageName);
            basePage.modalConfirmButton.click();
        }
    },

    changePassword: {
        value: function (newPassword) {
            this.btnChangePassword.click();
            var passwordField = this.frmRxModal.$('#server_password');
            passwordField.sendKeys(newPassword);
            basePage.modalConfirmButton.click();
        }
    },

    changeName: {
        value: function (newName) {
            this.btnChangeName.click();
            this.frmRxModal.$('input#server_name').sendKeys(newName);
            basePage.modalConfirmButton.click();
        }
    },

    changeNickname: {
        value: function (newNickname) {
            this.btnChangeNickname.click();
            this.frmRxModal.$('input#server_nickname').sendKeys(newNickname);
            basePage.modalConfirmButton.click();
        }
    },

    resizeServer: {
        value: function () {
            this.btnResizeServer.isPresent().then(function (isPresent) {
                if (!isPresent) {
                    throw new Error('Resize option not available');
                }
            });

            this.btnResizeServer.click();
            var resizeOptions = this.frmRxModal.$$('input[name="server_flavor"]');
            resizeOptions.then(function (radioButtons) {
                var resizeRadioButton = radioButtons[0];
                resizeRadioButton.getAttribute('disabled').then(function (disabledAttr) {
                    if (disabledAttr) {
                        resizeRadioButton = radioButtons[1];
                    }
                    resizeRadioButton.click();
                    basePage.modalConfirmButton.click();
                });
            });
        }
    },

    rescueServer: {
        value: function () {
            this.btnRescueServer.click();
            basePage.modalConfirmButton.click();
        }
    },

    unrescueServer: {
        value: function () {
            this.btnUnrescueServer.click();
            basePage.modalConfirmButton.click();
        }
    },

    deleteServer: {
        value: function () {
            this.btnDeleteServer.click();
            basePage.modalConfirmButton.click();
        }
    },

    waitForExpectedText: wait
};

module.exports = {
    wrap: function (createObj) {
        return util.combine(baseDetails, createObj);
    }
};

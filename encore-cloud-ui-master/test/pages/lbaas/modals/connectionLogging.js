var baseModal = require('../../base/modal');

var connectionLoggingModal = {

	notification: {
        get: function () { return element(by.tagName('rx-notification')).getText(); }
    },

    btnEnableDisableConnectionLogging: {
        get: function () { return $('.modal-dialog .submit').getText(); }
    },

    btnCancelConnectionLogging: {
        get: function () { return $('.modal-dialog .cancel').getText(); }
    },
};

connectionLoggingModal = baseModal.wrap(connectionLoggingModal);
//module.exports = Page.create(connectionLoggingModal);

module.exports = encore.rxModalAction.initialize(connectionLoggingModal);
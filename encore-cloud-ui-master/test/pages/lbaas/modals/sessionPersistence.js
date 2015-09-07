var sessionPersistenceModal = {

    notification: {
        get: function () { return element(by.tagName('rx-notification')).getText(); }
    },
    
    btnSubmitSessionPersistence: {
        get: function () { return $('.modal-dialog .submit').getText(); }
    },
 
    btnCancelSessionPersistence: {
        get: function () { return $('.modal-dialog .cancel').getText(); }
    }
};

module.exports = encore.rxModalAction.initialize(sessionPersistenceModal);

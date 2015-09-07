var connectionThrottlingModal = {

	txtMaxConnections: {
        get: function () { return $('#connectionThrottleMaxConnections'); },
        set: function (connections) {
            this.txtMaxConnections.clear();
            this.txtMaxConnections.sendKeys(connections);
        }
    },
    
    notification: {
        get: function () { return element(by.tagName('rx-notification')).getText(); }
    },
 
    btnDisableConnectionThrottling: {
        get: function () { return $('.modal-dialog .submit').getText(); }
    },
 
    btnCancelConnectionThrottling: {
        get: function () { return $('.modal-dialog .cancel').getText(); }
    },
};

module.exports = encore.rxModalAction.initialize(connectionThrottlingModal);
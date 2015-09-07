var moveHostModal = {

    eleHost: {
        get: function () {
            return $('#hostSelect');
        }
    },
    host: {
        get: function () {
            return this.eleHost.$('option:checked').getText();
        },
        set: function (value) {
            return this.eleHost.element(by.cssContainingText('option', value)).click();
        }
    }

};

module.exports = encore.rxModalAction.initialize(moveHostModal);

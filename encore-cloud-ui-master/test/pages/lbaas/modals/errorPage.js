var errorPageModal = {

    textArea: {
        get: function () {
            return element(by.model('fields.errorPageContent'));
        },
        set: function (data) {
            this.textArea.clear();
            this.textArea.sendKeys(data);
        }
    },

    eleErrorType: {
        get: function () {
            return $('#errorType');
        }
    },

    errorType: {
        get: function () {
            //rxSelect.selectedOptions is broken, so using this workaround
            return this.eleErrorType.$('option:checked').getText();
        },
        set: function (value) {
            return this.eleErrorType.element(by.cssContainingText('option', value)).click();
        }
    }

};

module.exports = encore.rxModalAction.initialize(errorPageModal);

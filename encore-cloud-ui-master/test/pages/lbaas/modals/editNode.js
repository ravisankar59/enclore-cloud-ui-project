var editNodeModal = {

    eleCondition: {
        get: function () {
            return $('#node-condition');
        }
    },

    rxSelectCondition: {
        get: function () {
            return encore.rxSelect.initialize(this.eleCondition);
        }
    },

    condition: {
        get: function () {
            //rxSelect.selectedOptions is broken, so using this workaround
            return this.eleCondition.$('option:checked').getText();
        },
        set: function (value) {
            return this.eleCondition.element(by.cssContainingText('option', value)).click();
        }
    },

    eleWeight: {
        get: function () {
            return $('#node-weight');
        }
    },

    weight: {
        get: function () {
            return this.eleWeight.getAttribute('value');
        },
        set: function (value) {
            this.eleWeight.clear();
            return this.eleWeight.sendKeys(value);
        }
    },

    eleType: {
        get: function () {
            return $('#node-type');
        }
    },

    elePort: {
        get: function () {
            return $('#node-port');
        }
    }
};

module.exports = encore.rxModalAction.initialize(editNodeModal);

var changeTimeoutModal = {

    eleName: {
        get: function () {
            return element(by.id('nameSelected'));
        }
    },

    name: {
        get: function () {
            return this.eleName.getAttribute('value');
        },
        set: function (value) {
            this.eleName.clear();
            return this.eleName.sendKeys(value);
        }
    },

    elePort: {
        get: function () { return element(by.id('portSelected')); }
    },

    port: {
        get: function () {
            return this.elePort.getAttribute('value');
        },
        set: function (value) {
            this.elePort.clear();
            return this.elePort.sendKeys(value);
        }
    },

    eleTimeout: {
        get: function () { return element(by.id('timeoutSelected')); }
    },

    timeout: {
        get: function () {
            return this.eleTimeout.getAttribute('value');
        },
        set: function (timeout) {
            this.eleTimeout.clear();
            return this.eleTimeout.sendKeys(timeout);
        }
    },

    eleProtocol: {
        get: function () {
            return element(by.id('protocolSelect'));
        }
    },

    protocol: {
        get: function () {
            return this.eleProtocol.$('option:checked').getText();
        },
        set: function (value) {
            return this.eleProtocol.element(by.cssContainingText('option', value)).click();
        }
    },

    eleAlgorithm: {
        get: function () {
            return element(by.id('algorithmSelect'));
        }
    },

    algorithm: {
        get: function () {
            return this.eleAlgorithm.$('option:checked').getText();
        },
        set: function (value) {
            return this.eleAlgorithm.element(by.cssContainingText('option', value)).click();
        }
    },

    eleAlgorithmDescription: {
        get: function () {
            return element(by.id('algorithm')).element(by.binding('description'));
        }
    },

    algorithmDescription: {
        get: function () {
            return this.eleAlgorithmDescription.getText();
        }
    },
    
    filloutFields: {
        value: function (lb) {
            var page = this;
            var fields = {
                name: 'name',
                port: 'port',
                timeout: 'timeout',
                protocol: 'protocol',
                algorithm: 'algorithm'
            };

            _.each(lb, function (val, field) {
                if (_.has(fields, field)) {
                    page[fields[field]] = val;
                }
            });
        }
    }

};

module.exports = encore.rxModalAction.initialize(changeTimeoutModal);
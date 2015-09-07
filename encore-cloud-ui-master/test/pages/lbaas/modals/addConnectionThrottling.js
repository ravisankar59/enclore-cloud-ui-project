var addConnectionThrottlingModal = {

    txtAddMinConnections: {
        get: function () { return $('#addThrottleMinConnections'); },
        set: function (connections) {
            this.txtAddMinConnections.clear();
            this.txtAddMinConnections.sendKeys(connections);
        }
    },

    txtAddMaxConnections: {
        get: function () { return $('#addThrottleMaxConnections'); },
        set: function (connections) {
            this.txtAddMaxConnections.clear();
            this.txtAddMaxConnections.sendKeys(connections);
        }
    },

    txtAddMaxConnectionRate: {
        get: function () { return $('#addThrottleMaxConnectionRate'); },
        set: function (connections) {
            this.txtAddMaxConnectionRate.clear();
            this.txtAddMaxConnectionRate.sendKeys(connections);
        }
    },

    txtAddRateInterval: {
        get: function () { return $('#addThrottleRateInterval'); },
        set: function (connections) {
            this.txtAddRateInterval.clear();
            this.txtAddRateInterval.sendKeys(connections);
        }
    },

    lblAddMinConnections: {
        get: function () { return $('label[for="addThrottleMinConnections"]').getText(); }
    },

    lblAddMaxConnections: {
        get: function () { return $('label[for="addThrottleMaxConnections"]').getText(); }
    },

    lblAddMaxConnectionRate: {
        get: function () { return $('label[for="addThrottleMaxConnectionRate"]').getText(); }
    },

    lblAddRateInterval: {
        get: function () { return $('label[for="addThrottleRateInterval"]').getText(); }
    },

    btnEnableConnectionThrottling: {
        get: function () { return $('.modal-dialog .submit').getText(); }
    },
 
    btnCancelConnectionThrottling: {
        get: function () { return $('.modal-dialog .cancel').getText(); }
    },

    filloutFields: {
        value: function (lb) {
            var page = this;
            var fields = {
                minConnections: 'txtAddMinConnections',
                maxConnections: 'txtAddMaxConnections',
                maxConnectionRate: 'txtAddMaxConnectionRate',
                rateInterval: 'txtAddRateInterval'
            };

            _.each(lb, function (val, field) {
                if (_.has(fields, field)) {
                    page[fields[field]] = val;
                }
            });
        }
    }
};

module.exports = encore.rxModalAction.initialize(addConnectionThrottlingModal);

var healthMonitoringModal = {

    notification: {
        get: function () { return element(by.tagName('rx-notification')).getText(); }
    },

    eleHealthMonitorType: {
        get: function () { return $('#monitorType'); }
    },

    lblType: {
        get: function () { return $('label[for="monitorType"]').getText(); }
    },

    selHealthMonitorType: {
        get: function () {
            return this.eleHealthMonitorType.$('option:checked').getText();
        },
        set: function (value) {
            return this.eleHealthMonitorType.element(by.cssContainingText('option', value)).click();
        }
    },
    
    eleHealthMonitorDelay: {
        get: function () { return $('#delay'); }
    },

    lblDelay: {
        get: function () { return $('label[for="delay"]').getText(); }
    },

    txtHealthMonitorDelay: {
        get: function () { return this.eleHealthMonitorDelay.getAttribute('value'); },
        set: function (delay) {
            this.eleHealthMonitorDelay.clear();
            this.eleHealthMonitorDelay.sendKeys(delay);
        }
    },

    eleHealthMonitorTimeout: {
        get: function () { return $('#timeout'); }
    },

    lblTimeout: {
        get: function () { return $('label[for="timeout"]').getText(); }
    },

    txtHealthMonitorTimeout: {
        get: function () { return this.eleHealthMonitorTimeout.getAttribute('value'); },
        set: function (timeout) {
            this.eleHealthMonitorTimeout.clear();
            this.eleHealthMonitorTimeout.sendKeys(timeout);
        }
    },

    eleHealthMonitorAttempts: {
        get: function () { return $('#attempts'); }
    },

    lblAttempts: {
        get: function () { return $('label[for="attempts"]').getText(); }
    },

    txtHealthMonitorAttempts: {
        get: function () { return this.eleHealthMonitorAttempts.getAttribute('value'); },
        set: function (attempts) {
            this.eleHealthMonitorAttempts.clear();
            this.eleHealthMonitorAttempts.sendKeys(attempts);
        }
    },

    eleHealthMonitorHttpPath: {
        get: function () { return $('#httpPath'); }
    },

    lblHttpPath: {
        get: function () { return $('label[for="httpPath"]').getText(); }
    },

    txtHealthMonitorHttpPath: {
        get: function () { return this.eleHealthMonitorHttpPath.getAttribute('value'); },
        set: function (httpPath) {
            this.eleHealthMonitorHttpPath.clear();
            this.eleHealthMonitorHttpPath.sendKeys(httpPath);
        }
    },

    eleHealthMonitorStatusRegex: {
        get: function () { return $('#statusRegex'); }
    },

    lblStatusRegex: {
        get: function () { return $('label[for="statusRegex"]').getText(); }
    },

    txtHealthMonitorStatusRegex: {
        get: function () { return this.eleHealthMonitorStatusRegex.getAttribute('value'); },
        set: function (statusRegex) {
            this.eleHealthMonitorStatusRegex.clear();
            this.eleHealthMonitorStatusRegex.sendKeys(statusRegex);
        }
    },

    eleHealthMonitorBodyRegex: {
        get: function () { return $('#bodyRegex'); }
    },

    lblBodyRegex: {
        get: function () { return $('label[for="bodyRegex"]').getText(); }
    },

    txtHealthMonitorBodyRegex: {
        get: function () { return this.eleHealthMonitorBodyRegex.getAttribute('value'); },
        set: function (bodyRegex) {
            this.eleHealthMonitorBodyRegex.clear();
            this.eleHealthMonitorBodyRegex.sendKeys(bodyRegex);
        }
    },

    btnSubmitHealthMonitoring: {
        get: function () { return $('.modal-dialog .submit').getText(); }
    },

    btnCancelHealthMonitoring: {
        get: function () { return $('.modal-dialog .cancel').getText(); }
    },

    filloutFields: {
        value: function (lb) {
            var page = this;
            var fields = {
                delay: 'txtHealthMonitorDelay',
                timeout: 'txtHealthMonitorTimeout',
                attempts: 'txtHealthMonitorAttempts',
                path: 'txtHealthMonitorHttpPath',
                statusRegex: 'txtHealthMonitorStatusRegex',
                bodyRegex: 'txtHealthMonitorBodyRegex',
                type: 'selHealthMonitorType'
            };

            _.each(lb, function (val, field) {
                if (_.has(fields, field)) {
                    page[fields[field]] = val;
                }
            });
        }
    }
};

module.exports =  encore.rxModalAction.initialize(healthMonitoringModal);
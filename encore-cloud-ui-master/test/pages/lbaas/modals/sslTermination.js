var sslTerminationModal = {

    notification: {
        get: function () { return element(by.tagName('rx-notification')).getText(); }
    },

    btnSubmitSSLTermination: {
        get: function () { return $('.modal-dialog .submit').getText(); }
    },

    btnCancelSSLTermination: {
        get: function () { return $('.modal-dialog .cancel').getText(); }
    },

    eleAllowedTraffic: {
        get: function () { return element(by.css('#allowedTraffic')); }
    },

    lblAllowedTrafic: {
        get: function () { return $('label[for="allowedTraffic"]').getText(); }
    },

    selAllowedTraffic: {
        get: function () {
            return this.eleAllowedTraffic.$('option:checked').getText();
        },
        set: function (value) {
            return this.eleAllowedTraffic.element(by.cssContainingText('option', value)).click();
        }
    },

    eleSecuredPort: {
        get: function () { return element(by.css('#securePort')); }
    },

    lblSecuredPort: {
        get: function () { return $('label[for="securePort"]').getText(); }
    },

    txtSecuredPort: {
        get: function () { return this.eleSecuredPort.getAttribute('value'); },
        set: function (securedPort) {
            this.eleSecuredPort.clear();
            this.eleSecuredPort.sendKeys(securedPort);
        }
    },

    eleCertificate: {
        get: function () { return element(by.css('#certificate')); }
    },

    lblCertificate: {
        get: function () { return $('label[for="certificate"]').getText(); }
    },

    txtCertificate: {
        get: function () { return this.eleCertificate.getAttribute('value'); },
        set: function (certificate) {
            this.eleCertificate.clear();
            this.eleCertificate.sendKeys(certificate);
        }
    },

    eleIntermediateCertificate: {
        get: function () { return element(by.css('#intermediateCertificate')); }
    },

    lblIntermediateCertificate: {
        get: function () { return $('label[for="intermediateCertificate"]').getText(); }
    },

    txtIntermediateCertificate: {
        get: function () { return this.eleIntermediateCertificate.getAttribute('value'); },
        set: function (intermediateCertificate) {
            this.eleIntermediateCertificate.clear();
            this.eleIntermediateCertificate.sendKeys(intermediateCertificate);
        }
    },

    elePrivateKey: {
        get: function () { return element(by.css('#privateKey')); }
    },

    lblPrivateKey: {
        get: function () { return $('label[for="privateKey"]').getText(); }
    },

    txtPrivateKey: {
        get: function () { return this.elePrivateKey.getAttribute('value'); },
        set: function (privateKey) {
            this.elePrivateKey.clear();
            this.elePrivateKey.sendKeys(privateKey);
        }
    },

    filloutFields: {
        value: function (lb) {
            var page = this;
            var fields = {
                allowedTraffic: 'selAllowedTraffic',
                securedPort: 'txtSecuredPort',
                certificate: 'txtCertificate',
                intermediateCertificate: 'txtIntermediateCertificate',
                privateKey: 'txtPrivateKey'
            };

            _.each(lb, function (val, field) {
                if (_.has(fields, field)) {
                    page[fields[field]] = val;
                }
            });
        }
    }
};

module.exports =  encore.rxModalAction.initialize(sslTerminationModal);
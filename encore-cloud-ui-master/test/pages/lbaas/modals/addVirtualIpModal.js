var addVirtualIpModal = {
    eleVipType: {
        get: function () { return $('#load_balancer_vip_type'); }
    },
    selVipType: {
        get: function () {
            //rxSelect.selectedOptions is broken, so using this workaround
            return this.eleVipType.$('option:checked').getText();
        },
        set: function (value) {
            return this.eleVipType.element(by.cssContainingText('option', value)).click();
        }
    },

    txtTicketNumber: {
        get: function () { return $('#load_balancer_ticket_number'); },
        set: function (connections) {
            this.txtTicketNumber.clear();
            this.txtTicketNumber.sendKeys(connections);
        }
    },

    txtReason: {
        get: function () { return $('#load_balancer_reason'); },
        set: function (connections) {
            this.txtReason.clear();
            this.txtReason.sendKeys(connections);
        }
    },

    lblVipType: {
        get: function () { return $('label[for="load_balancer_vip_type"]'); }
    },

    lblTicketNumber: {
        get: function () { return $('label[for="load_balancer_ticket_number"]'); }
    },

    lblReason: {
        get: function () { return $('label[for="load_balancer_reason"]'); }
    },

    filloutFields: {
        value: function (lb) {
            var page = this;
            var fields = {
                vipType: 'selVipType',
                ticketNumber: 'txtTicketNumber',
                reason: 'txtReason'
            };

            _.each(lb, function (val, field) {
                if (_.has(fields, field)) {
                    page[fields[field]] = val;
                }
            });
        }
    }
};

module.exports = encore.rxModalAction.initialize(addVirtualIpModal);

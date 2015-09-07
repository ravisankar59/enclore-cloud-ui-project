var suspendLoadBalancerModal = {
    
    eleTicketNumber: {
        get: function () {
            return $('#ticketNumber');
        }
    },

    reason: {
        get: function () {
            return element(by.model('fields.reason'));
        },
        set: function (data) {
            this.reason.clear();
            this.reason.sendKeys(data);
        }
    },

    ticketNumber: {
        get: function () {
            return this.eleTicketNumber.getAttribute('value');
        },
        set: function (value) {
            this.eleTicketNumber.clear();
            this.eleTicketNumber.sendKeys(value);
        }
    }
};

module.exports = encore.rxModalAction.initialize(suspendLoadBalancerModal);

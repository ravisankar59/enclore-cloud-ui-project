var addTemporaryRateLimitModal = {

    txtMaxRequestsPerSecond: {
        get: function () { return $('#maxRequestsPerSecond'); },
        set: function (maxRequestsPerSecond) {
            this.txtMaxRequestsPerSecond.clear();
            this.txtMaxRequestsPerSecond.sendKeys(maxRequestsPerSecond);
        }
    },

    txtExpirationTime: {
        get: function () { return $('#expirationTime'); },
        set: function (expirationTime) {
            this.txtExpirationTime.clear();
            this.txtExpirationTime.sendKeys(expirationTime);
        }
    },

    txtTicketId: {
        get: function () { return $('#ticketId'); },
        set: function (ticketId) {
            this.txtTicketId.sendKeys(ticketId);
        }
    },

    txtComment: {
        get: function () { return $('#comment'); },
        set: function (comment) {
            this.txtComment.sendKeys(comment);
        }
    },

    modelMaxRequestsPerSecond: {
        get: function () { return 'fields.maxRequestsPerSecond'; }
    },

    modelExpirationTime: {
        get: function () { return 'fields.expirationTime'; }
    },

    modelTicketId: {
        get: function () { return 'fields.ticketId'; }
    },

    modelComment: {
        get: function () { return 'fields.comment'; }
    },

    lblMaxRequestsPerSecond: {
        get: function () { return $('label[for="maxRequestsPerSecond"]').getText(); }
    },

    lblExpirationTime: {
        get: function () { return $('label[for="expirationTime"]').getText(); }
    },

    lblTicketId: {
        get: function () { return $('label[for="ticketId"]').getText(); }
    },

    lblComment: {
        get: function () { return $('label[for="comment"]').getText(); }
    },

    btnSubmitRateLimit: {
        get: function () { return $('.modal-dialog .submit').getText(); }
    },

    btnCancelRateLimit: {
        get: function () { return $('.modal-dialog .cancel').getText(); }
    },

    filloutFields: {
        value: function (lb) {
            var page = this;
            var fields = {
                maxRequestsPerSecond: 'txtMaxRequestsPerSecond',
                expirationTime: 'txtExpirationTime',
                ticketId: 'txtTicketId',
                comment: 'txtComment'
            };
 
            _.each(lb, function (val, field) {
                if (_.has(fields, field)) {
                    page[fields[field]] = val;
                }
            });
        }
    }
};

module.exports = encore.rxModalAction.initialize(addTemporaryRateLimitModal);
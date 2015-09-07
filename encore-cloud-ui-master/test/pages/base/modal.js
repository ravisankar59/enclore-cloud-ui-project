var util = require('./util/util');
var baseModal = {

    modalTitle: {
        get: function () { return $('h3.modal-title'); }
    },

    modalSubtitle: {
        get: function () { return $('h4.modal-subtitle'); }
    },

    btnSubmit: {
        get: function () { return $('.modal button.submit'); }
    },

    submit: {
        value: function () { return this.btnSubmit.click(); }
    },

    close: {
        value: function () { return $('button.modal-close').click(); }
    },

    cancel: {
        value: function () { return $('button.cancel').click(); }
    },

    notificationText: {
        get: function () { return $('rx-notification span.notification-text'); }
    }

};

module.exports = {
    wrap: function (modalObj) {
        return util.combine(baseModal, modalObj);
    }
};

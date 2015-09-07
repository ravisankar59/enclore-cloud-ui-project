var unSuspendLoadBalancerModal = {

    unSuspendBeginSubmit: {
        get: function () {
            return $('div > button.button.submit.ng-binding').getText();
        }
    },

    unSuspendBeginCancel: {
        get: function () {
            return $('div > button.button.cancel.ng-binding').getText();
        }
    },

    unSuspendConfirmButton: {
        get: function () {
            return $('div[ng-switch-when="hasPermission"] > button').getText();
        }
    },

    unSuspendCancelButton: {
        get: function () {
            return $('div[ng-switch-when="hasPermission"] > button.cancel').getText();
        }
    },

    notification: {
        get: function () {
            return element.all(by.css('rx-notification')).getText().then(function (value) {
                return value;
            });
        }
    },

    noPermissionCloseModal: {
        get: function () {
            return $('div[ng-switch-when="doNotHavePermission"] > button.submit').getText();
        }
    }
};

module.exports = encore.rxModalAction.initialize(unSuspendLoadBalancerModal);

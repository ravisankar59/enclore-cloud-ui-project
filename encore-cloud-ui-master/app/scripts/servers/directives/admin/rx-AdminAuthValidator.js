angular.module('servers')
.directive('adminAuthenticateValidator', function (AdminAuthenticate) { // available
    return {
        require: 'ngModel',
        link: function (scope, elem, attr, ctrl) {
            // We set waiting to true when we begin to wait
            // for the promise from AdminAuthenticate.isAuthenticated() to
            // resolve/reject. Likely the auth request hasn't even been sent
            // at this point, but this causes it to wait for the request to send
            // and come back before deciding whether or not to display a "bad password"
            // error message
            var waiting = false;

            // push the validator on so it runs last.
            ctrl.$parsers.push(function (viewValue) {
                // set it to true here, otherwise it will not
                // clear out when previous validators fail.
                ctrl.$setValidity('adminAuthenticateValidator', true);
                if (!waiting && ctrl.$valid) {
                    ctrl.$setValidity('adminAuthenticateValidator', true);
                    waiting = true;

                    // We "wait" on isAuthenticated() to reject or resolve, then
                    // we either cause the inline error message to show, or we
                    // just send `true` to $setValidity
                    AdminAuthenticate.isAuthenticated().then(function () {
                        ctrl.$setValidity('adminAuthenticateValidator', true);
                        waiting = false;
                    }, function () {
                        ctrl.$setValidity('adminAuthenticateValidator', false);
                        waiting = false;
                    });
                }
                return viewValue;
            });
        }
    };
});

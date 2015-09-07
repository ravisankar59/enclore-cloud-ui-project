/**
 * @ngdoc directive
 * @name loadbalancers.rxCustomToggleSwitch
 * @description
 * Displays an on/off switch toggle
 *
 * @param {boolean} [toggle-model] The scope property to bind to
 *    {function} [postHook] A function to run when the switch is toggle clicked
 *    {boolean} [disabled] The scope property to disable the toggle switch
 * @example
 * <pre>
 *     <rx-custom-toggle-switch toggle-model="true" post-hook="callMe()" disabled="true"></rx-custom-toggle-switch>
 * </pre>
 */
angular.module('loadbalancers')
    .directive('rxCustomToggleSwitch', function () {
    return {
        restrict: 'E',
        templateUrl: 'views/lbaas/directives/rx-lbaasCustomToggleSwitch.html',
        scope: {
            postHook: '&',
            toggleModel: '=',
            disabled: '='
        },
        link: function (scope, ngModelCtrl) {

            ngModelCtrl.$render = function () {
                //nothing goes here.
            };
            scope.$watch('toggleModel', function (val) {
                scope.state = val ? 'ON' : 'OFF';
            });

            scope.update = function () {
                //No action required when toggle is in disabled mode.
                if (scope.disabled) {
                    return;
                }
                scope.postHook();
            };
        }
    };
});
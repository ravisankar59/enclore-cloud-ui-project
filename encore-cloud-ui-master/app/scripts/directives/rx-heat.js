/**
 * @ngdoc directive
 * @name encore.rxApiKey
 * @requires ng:$sce
 * @requires ngRoute:$routeParams
 * @requires heat:HeatUtil
 * @requires encore.ui.rxNotify:rxPromiseNotifications
 * @requires encore.ui.rxSession:Session
 * @requires encore.svcs.cloud.common:CloudUsers
 * @restrict E
 *
 * @description
 * Renders a form that will automatically submit to the appropriate Heat target
 */
angular.module('heat')
.directive('rxHeat', function ($sce, $routeParams, HeatUtil, rxPromiseNotifications, CloudUsers, Session) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'views/templates/rx-heat.html',
        scope: {},
        link: function (scope, element) {
            var form = element.find('form');
            var formEL = form[0];
            var rackerUsernameInput = form.find('input').eq(0);
            var rackerTokenInput = form.find('input').eq(1);
            var userTokenInput = form.find('input').eq(3);

            // Using CloudUsers.reach until the GetAPIToken service is merged
            var getTokenPromise = new CloudUsers().$reach({ user: $routeParams.user });
            var heatUrl = HeatUtil.url();
            var rackerUsername = Session.getUserName();
            var rackerToken = Session.getTokenId();

            getTokenPromise.then(function success (reachInfo) {
                // Assigning values directly to the DOM elements
                // to avoid a race condition with the $digest cycle
                rackerUsernameInput.val(rackerUsername);
                rackerTokenInput.val(rackerToken);
                userTokenInput.val(reachInfo.token);
                form.attr('action', $sce.trustAsResourceUrl(heatUrl));
                formEL.submit();
            });

            rxPromiseNotifications.add(getTokenPromise, {
                error: 'Could not retrieve impersonation token' + ': {{ message || statusText }}'
            });

            scope.user = $routeParams.user;
            scope.accountNumber = $routeParams.accountNumber;
        }
    };
});

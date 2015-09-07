angular.module('rxReachLink', ['encore', 'encore.ui', 'encore.svcs.cloud.common'])
/**
 * @ngdoc service
 * @name rxReachLink:ReachServiceTarget
 * @requires encore.ui.rxEnvironment:Environment
 * @description
 *
 * Service that returns the Reach target for the current Environment
 */
.factory('ReachServiceTarget', function (Environment) {
    var env = Environment.get().name, serviceTypeName;

    var serviceTargetsTemplates = {
        'compute': ',${service}/${id}',
        'volumes': '/volume,${service}/${id}',
        'rax:load-balancer': ',${service}/${id}',
        'rax:database': ',${service}/${id}',
    };
    var detailsIdentifier = {
        'compute': 'serverId',
        'volumes': 'storageId',
        'rax:load-balancer': 'loadBalancerId',
        'rax:database': 'databaseId'
    };
    if (env === 'unified') {
        serviceTypeName = {
            'compute': 'cloudServersOpenStack',
            'volumes': 'cloudBlockStorage',
            'rax:load-balancer': 'cloudLoadBalancers',
            'rax:database': 'cloudDatabases'
        };
    } else {
        serviceTypeName = {
            'compute': 'cloudServersPreprod',
            'volumes': 'cloudBlockStoragePreprod',
            'rax:load-balancer': 'cloudLoadBalancers',
            'rax:database': 'cloudDatabases'
        };
    }
    return function (target, type, conf) {
        var params = {};

        // Creates Path for Reach Server Details
        if (type) {
            target += '#${type}';
            params.type = type;
            params.service = serviceTypeName[type];

            if (_.has(conf, 'region')) {
                params.service += ',' + conf.region;
            }
            if (_.has(conf, detailsIdentifier[type])) {
                target += serviceTargetsTemplates[type];
                params.id = conf[detailsIdentifier[type]];
            }

            if (type === 'compute') {
                if (conf.serverGen === 'First') {
                    params.service = 'cloudServers';
                }
            }
        }
        target = _.template(target, params);
        return target;
    };
})
/**
 * @ngdoc directive
 * @name rxReachLink:rxReachLink
 * @scope
 * @requires ng:$sce
 * @requires ngRoute:$routeParams
 * @requires encore.ui.rxNotify:rxPromiseNotifications
 * @requires encore.svcs.cloud.common:CloudUsers
 * @requires encore.svcs.encore:Encore
 * @requires rxReachLink:ReachServiceTarget
 * @restrict E
 *
 * @description
 * Renders a form that, when submitted, will log the user in automatically and
 * direct them to the appropriate Reach target
 */
.directive('rxReachLink', function ($sce, $routeParams, rxPromiseNotifications,
                                    CloudUsers, Encore, ReachServiceTarget) {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'views/templates/rx-reachLink.html',
        scope: {
            reachTarget: '@',
            serviceType: '@'
        },
        link: function (scope, element, attr) {
            var accountAdmin, reachURL, impersonationToken;
            var form = element.find('form');
            var formEL = form[0];

            var getReachInfo = function (accountData) {
                accountAdmin = accountData.admin;
                var getReachInfoPromise = new CloudUsers().$reach({ user: accountAdmin }, function (reachInfo) {
                    reachURL = reachInfo.reachUrl;
                    impersonationToken = reachInfo.token;
                });
                return getReachInfoPromise;
            };

            var getReachURL = function () {
                // We need the account admin before we request the Reach url
                // so that the url links to the primary account
                var getAdminPromise = new Encore().$getAccountAdmin({ id: $routeParams.accountNumber });
                return getAdminPromise.then(getReachInfo);
            };

            var submitToReach = function () {
                // We assign form values directly to the DOM instead of on the scope due
                // to a race condition between the $digest process and form submission.
                var userInput = form.find('input').eq(0);
                var passwordInput = form.find('input').eq(1);
                userInput.val(accountAdmin);
                passwordInput.val(impersonationToken);
                form.attr('action', $sce.trustAsResourceUrl(reachURL));
                formEL.submit();
                scope.loading = false;
            };

            /**
             * @ngdoc function
             * @name goToReach
             * @description
             * Scope method used to log the user into Reach.
             */
            scope.goToReach = function () {
                scope.loading = true;
                getReachURL().then(submitToReach).catch(function () {
                    scope.loading = false;
                });
                rxPromiseNotifications.add(getReachURL(), {
                    error: 'Could not load Reach details for ' + scope.user + ': {{message || statusText}}'
                });
            };

            scope.user = $routeParams.user;
            scope.class = attr.class;
            scope.reachTarget = attr.reachTarget = ReachServiceTarget(scope.reachTarget, attr.serviceType, attr);
        }
    };
});

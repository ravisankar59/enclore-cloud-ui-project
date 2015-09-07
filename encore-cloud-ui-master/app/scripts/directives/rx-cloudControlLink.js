/**
* @ngdoc directive
* @name encore.rxCloudControlLink
* @requires $q
* @requires $sce
* @requires $routeParams
* @requires rxPromiseNotifications
* @requires Encore
* @requires Environment
* @requires GetCloudControlURL
* @requires GetAccountRegion
*/
angular.module('rxCloudControlLink', ['encore', 'encore.ui'])
    .directive('rxCloudControlLink', function ($q, $sce, $routeParams, rxPromiseNotifications,
                                               Encore, Environment, GetCloudControlURL, GetAccountRegion) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'views/templates/rx-cloudControlLink.html',
            scope: {},
            link: function (scope, element, attr) {
                var cloudControlURL;
                var form = element.find('form');
                var formEL = form[0];

                var getCloudControlURL = function () {
                    var user, env, accountRegion, deferred = $q.defer();
                    var success = function (account) {
                        user = _.find(account.users, { username: $routeParams.user });

                        if (Environment.isUnified()) {
                            env = 'production';
                        } else if (Environment.isUnifiedPreProd()) {
                            env = 'staging';
                        } else if (Environment.isPreProd()) {
                            env = 'preprod';
                        } else if (Environment.isLocal()) {
                            env = 'local';
                        } else {
                            deferred.reject({ message: 'environment not supported' });
                            scope.loading = false;
                            return;
                        }

                        accountRegion = GetAccountRegion($routeParams.accountNumber);
                        cloudControlURL = GetCloudControlURL(accountRegion, env,
                                                          $routeParams.accountNumber, user.id, attr);
                        deferred.resolve();
                    };
                    var failure = function (error) {
                        scope.loading = false;
                        deferred.reject({ message: 'problem retrieving account information, ' + error.message });
                    };
                    Encore.getAccount({ id: $routeParams.accountNumber }, success, failure);
                    return deferred.promise;
                }; // getCloudControlURL()

                var submitToCloudControl = function () {
                    form.attr('action', $sce.trustAsResourceUrl(cloudControlURL));
                    formEL.submit();
                    scope.loading = false;
                };

                scope.goToCloudControl = function () {
                    scope.loading = true;
                    getCloudControlURL().then(submitToCloudControl);
                    rxPromiseNotifications.add(getCloudControlURL(), {
                        error: 'Could not load Cloud Control' + ': {{message || statusText}}'
                    });
                };
                scope.class = attr.class;
            }
        };
    });

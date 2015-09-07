angular.module('servers')
    .directive('rxManagedPasswords', function (Encore, ServerMillManagedPasswords, Status) {
        return {
            restrict: 'E',
            scope: {
                user: '=',
                server: '='
            },
            templateUrl: 'views/servers/templates/managed-passwords.html',
            controller: function ($scope) {

                $scope.isEmpty = _.isEmpty;

                $scope.isManagedAccount = function () {
                    return $scope.serviceLevel === 'managed';
                };

                $scope.passwordLoading = false;

                $scope.loadManagedPasswords = function () {
                    var serviceParams = {
                        id: $scope.server.id
                    };

                    $scope.passwordLoading = true;

                    var passwordSuccess = function (managedAccount) {
                        $scope.managedPassword = managedAccount.password;
                        Status.complete({ prop: 'loadingManagedPasswords' });
                    };

                    var passwordFailure = function (error) {
                        Status.setError('Error loading managed passwords: ${message}', error,
                            { prop: 'loadingManagedPasswords' });
                    };

                    var passwordLoaded = function () {
                        $scope.showManaged = true;
                        $scope.passwordLoading = false;
                    };

                    Status.setLoading('Loading managed passwords', { prop: 'loadingManagedPasswords' });
                    ServerMillManagedPasswords.get(serviceParams, passwordSuccess, passwordFailure)
                        .$promise.finally(passwordLoaded);
                };

                var loadAccountDetails = function () {
                    var supportServiceParams = {
                        id: $scope.user
                    };

                    var searchSuccess = function (accountInfo) {
                        $scope.serviceLevel = accountInfo.serviceLevel;
                        Status.complete({ prop: 'loadingAccountDetails' });
                    };

                    var searchFailure = function () {
                        /*jshint quotmark: double */
                        Status.setError("Could not determine if this is a 'Managed' account.", {},
                            { prop: "loadingAccountDetails" });
                    };

                    Status.setLoading('Loading account details', { prop: 'loadingAccountDetails' });
                    Encore.getAccountByIdentityUsername(supportServiceParams, searchSuccess, searchFailure);
                };

                loadAccountDetails();
            }
        };
    });

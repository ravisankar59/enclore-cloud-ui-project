angular.module('servers')
    .controller('rxSuspendServerCtrl', function ($scope, $modalInstance, $rootScope, $routeParams, $route,
                                                 AdminAuthenticate, NextGenAdmin, Status, Session) {

        $scope.title = 'Server ' + $scope.server.name;
        $scope.subtitle = $scope.server.id;
        $scope.fields.password = '';
        $scope.submitStatus = {
            loading: false,
            disable: true
        };

        var username = Session.getUserId();
        var regions = [$routeParams.region];

        var suspendServer = function (serverId, user, region) {
            var suspend = NextGenAdmin.suspend({
                id: serverId,
                user: user,
                region: region
            });

            suspend.$promise
                .then(function () {
                    Status.setSuccessNext('Server is now suspending.');
                    $route.reload();
                }, function (error) {
                    Status.setError('Error suspending server: ${message}', error);
                    $modalInstance.close($scope);
                });
        };

        var unsuspendServer = function (serverId, user, region) {
            var unsuspend = NextGenAdmin.unsuspend({
                id: serverId,
                user: user,
                region: region
            });

            unsuspend.$promise
                .then(function () {
                    Status.setSuccessNext('Server is now unsuspending.');
                    $route.reload();
                }, function (error) {
                    Status.setError('Error unsuspending server: ${message}', error);
                    $modalInstance.close($scope);
                });
        };

        var getAdminRegion = function (accessList, currentRegion) {
            return accessList[currentRegion].adminRegion;
        };

        $scope.submit = function (mode) {
            $scope.submitStatus.loading = true;
            AdminAuthenticate.authenticate(username, $scope.fields.password, regions)
                .then(function (data) {
                    var adminRegion = getAdminRegion(data.access, $routeParams.region);
                    if (mode === 'suspend') {
                        suspendServer($routeParams.serverId, $routeParams.user, adminRegion);
                    } else if (mode === 'unsuspend') {
                        unsuspendServer($routeParams.serverId, $routeParams.user, adminRegion);
                    }
                }, function () {
                    $scope.submitStatus.loading = false;
                });
        };

        $scope.cancel = $modalInstance.dismiss;

        $rootScope.$on('$routeChangeSuccess', $modalInstance.dismiss);
    });

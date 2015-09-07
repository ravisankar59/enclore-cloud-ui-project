angular.module('servers')
    .controller('rxMigrateServerCtrl', function ($scope, $modalInstance, $rootScope, $routeParams, $route,
                                                 AdminAuthenticate, NextGenAdmin, Status, Session) {

        $scope.title = 'Migrate Server ' + $scope.server.name;
        $scope.subtitle = $scope.server.id;
        $scope.submittingMsg = 'Authenticating & Migrating Server';
        $scope.defaultSubmitMsg = 'Authenticate & Migrate Server';
        $scope.fields.password = '';
        $scope.submitStatus = {
            loading: false,
            disable: true
        };

        var username = Session.getUserId();
        var regions = [$routeParams.region];

        var stopLoading = function () {
            $scope.submitStatus.loading = false;
        };

        var migrateServer = function (serverId, user, region) {
            var migrate = NextGenAdmin.migrate({
                id: serverId,
                user: user,
                region: region
            });

            migrate.$promise
                .then(function () {
                    Status.setSuccessNext('Server is now migrating.');
                    $route.reload();
                }, function () {
                    Status.setError('Error migrating server.');
                    $modalInstance.close($scope);
                });
        };

        var getAdminRegion = function (accessList, currentRegion) {
            return accessList[currentRegion].adminRegion;
        };

        $scope.submit = function () {
            $scope.submitStatus.loading = true;
            AdminAuthenticate.authenticate(username, $scope.fields.password, regions)
                .then(function (data) {
                    var adminRegion = getAdminRegion(data.access, $routeParams.region);
                    migrateServer($routeParams.serverId, $routeParams.user, adminRegion);
                }, stopLoading);
        };

        $scope.cancel = $modalInstance.dismiss;

        $rootScope.$on('$routeChangeSuccess', $modalInstance.dismiss);
    });

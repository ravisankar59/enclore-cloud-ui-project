angular.module('servers')
.controller('rxIpAddressesCtrl', function ($scope, $modalInstance, $rootScope, $routeParams, $route,
                                                 AdminAuthenticate, NextGenAdmin, Status, Session) {

        $scope.fields.password = '';
        $scope.adminRegion = '';

        $scope.submitStatus = {
            loading: false,
            disable: true
        };

        var username = Session.getUserId();
        var regions = [$routeParams.region];

        var stopLoading = function () {
            $scope.submitStatus.loading = false;
        };

        var addPublicAddress = function (serverId, user) {
            var add = NextGenAdmin.addPublicAddress({
                id: serverId,
                user: user,
                region: $scope.adminRegion,
                networkId: '00000000-0000-0000-0000-000000000000'
            }).$promise;

            add
                .then(function () {
                    $scope.submitStatus.disable = true;
                    Status.setSuccessNext('The IP address has been added to the server. No manual provisioning ' +
                        'will be necessary since the IP address has been configured on the server. Please allow a ' +
                        'few minutes for this change to take effect.');
                    stopLoading();
                    $modalInstance.close($scope);
                    $route.reload();
                }, function (error) {
                    $scope.submitStatus.disable = true;
                    Status.setError('Error adding IP address: ' + error.statusText);
                    $modalInstance.close($scope);
                });
        };

        var removeAddress = function (serverId, user, address) {
            var remove = NextGenAdmin.removeAddress({
                id: serverId,
                user: user,
                region: $scope.adminRegion,
                address: address
            }).$promise;

            remove
                .then(function () {
                    Status.setSuccessNext('The IP address ' + address + ' has been removed from the server. ' +
                        'Please allow a few minutes for this change to take effect.');
                    stopLoading();
                    $modalInstance.close($scope);
                    $route.reload();
                }, function (error) {
                    Status.setError('Error removing IP address: ' + error.statusText);
                    $modalInstance.close($scope);
                });
        };

        var getAdminRegion = function (result) {
            var accessObject = _.keys(result.access);
            var accessRegion = accessObject[0];
            return result.access[accessRegion].adminRegion;
        };

        var ipChange = function (action) {
            return function (address) {
                $scope.submitStatus.loading = true;
                AdminAuthenticate.authenticate(username, $scope.fields.password, regions)
                    .then(function (result) {
                        $scope.adminRegion = getAdminRegion(result);
                        action($routeParams.serverId, $routeParams.user, address);
                    }, stopLoading);
            };
        };

        $scope.submitAddIp = ipChange(addPublicAddress);
        $scope.submitRemoveIp = ipChange(removeAddress);
        $scope.cancel = $modalInstance.dismiss;

        $rootScope.$on('$routeChangeSuccess', $modalInstance.dismiss);
    });

/**
* @ngdoc controller
* @name ListNetworksCtrl 
* @requires $scope
* @requires $routeParams
* @requires $q
* @requires CloudRegionsUtil
* @requires TableBoilerplate
* @requires Status
* @requires NetworkResource
* @requires NetworkService
* @requires CloudRegionStatusUpdate
* @requires rxPromiseNotifications
*/
angular.module('networks')
    .controller('ListNetworksCtrl', function ($scope, $routeParams, $q,
                                         CloudRegionsUtil, TableBoilerplate,
                                         Status, NetworkResource, NetworkService,
                                         CloudRegionStatusUpdate, rxPromiseNotifications) {

        Status.setScope($scope);

        $scope.user = $routeParams.user;
        $scope.accountNumber = $routeParams.accountNumber;

        $scope.networks = [];
        $scope.failedRequests = [];

        // set up column sorting
        TableBoilerplate.setup($scope, { predicate: 'id', reverse: false });

        $scope.deleteNetwork = function (network) {
            var networkParams = {
                user: $scope.user,
                networkid: network.id,
                region: network.region
            };

            var action = NetworkResource.delete(networkParams);
            rxPromiseNotifications.add(action.$promise, {
                loading: 'Deleting Network ' + network.label,
                success: 'Network "' + network.label + '" deleted',
                error: 'Error deleting network ' + network.label + ': {{message || statusText}}'
            });
            action.$promise.then(loadNetworks);
        };

        var loadNetworks = function () {
            var regionsStatus = CloudRegionStatusUpdate();
            var promise = NetworkService.fetchNetworks($scope.user,
                                        $scope,
                                        regionsStatus.buildRegionsCallback('Loading Networks (${regionName})'))
                .then(function (networks) {
                    $scope.networks = networks;
                    return networks;
                },
                null,
                function (networksUpdate) {
                    $scope.networks = $scope.networks.concat(networksUpdate);
                    return networksUpdate;
                })
                .finally(function () {
                    if (!_.isEmpty($scope.failedRequests)) {
                        var errorMsg = 'Error loading regions: ' + $scope.failedRequests.join(', ');
                        Status.setError(errorMsg);
                    }
                    Status.complete();
                });

            regionsStatus.promiseHandler(promise);

        };

        loadNetworks();

    });

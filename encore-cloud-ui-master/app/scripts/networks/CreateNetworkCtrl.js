/**
* @ngdoc controller
* @name CreateNetworkCtrl 
* @requires $scope
* @requires $routeParams
* @requires $q
* @requires $location
* @requires NetworkResource
* @requires NetworkService
* @requires CloudRegions
* @requires Status
*/
angular.module('networks')
    .controller('CreateNetworkCtrl', function ($scope, $routeParams, $q, $location, NetworkResource,
                                              NetworkService, CloudRegions, Status) {

        Status.setScope($scope);

        $scope.user = $routeParams.user;
        $scope.accountNumber = $routeParams.accountNumber;
        $scope.network = {};
        $scope.request = {};
        $scope.networks = [];
        $scope.failedRequests = [];

        var loadRegions = function () {
            var deferred = $q.defer();
            Status.setLoading('Loading available Regions...');

            var loadRegionsSuccess = function (regions) {
                $scope.regions = CloudRegions.convert(regions);
                $scope.region = $scope.regions[0].value;
                deferred.resolve();
            };

            var loadRegionsFailure = function (error) {
                $scope.error = error;
                Status.setError('Error loading regions: ${message}', error);
                deferred.reject();
            };

            CloudRegions.getRegions($scope.user, 'Networks').then(loadRegionsSuccess, loadRegionsFailure);
            return deferred.promise;
        };

        loadRegions().finally(function () {
            Status.complete();
        });

        Status.setLoading('Generating CIDR...', { prop: 'loadingNetworks' });
        NetworkService.fetchNetworks($scope.user, $scope)
            .then(function (allNetworks) {
                Status.complete();
                $scope.networks = allNetworks;

                if (!_.isEmpty($scope.failedRequests)) {
                    var errorMsg = 'Error loading network regions: ' + $scope.failedRequests.join(', ');
                    Status.setError(errorMsg, {}, { prop: 'loadingNetworks' });
                } else {
                    Status.complete({ prop: 'loadingNetworks' });

                }
            },
                function () {},
                function (networksUpdate) {
                    $scope.networks = $scope.networks.concat(networksUpdate);
                }
            )
            .then(function () {
                var networks = _.where($scope.networks, { 'region': $scope.region });
                $scope.network.cidr = suggestedCIDR(networks);
            });

        // Generate next available CIDR
        var suggestedCIDR = function (networks) {
            var cidrAlreadyUsed, suggestedCidr;
            var initialSuggestedOctet = 1;
            var maxSuggestedOctet = 255;
            var defaultOctet = networks.length + initialSuggestedOctet;

            do {
                suggestedCidr = _.template('192.168.<%= octet %>.0/24', { 'octet': defaultOctet });
                cidrAlreadyUsed = _.some(networks, { 'cidr': suggestedCidr });
                defaultOctet = defaultOctet + 1;
            } while (cidrAlreadyUsed && defaultOctet < maxSuggestedOctet);

            return suggestedCidr;
        };

        $scope.submit = function (network) {
            var svcParams = {
                user: $scope.user,
                region: $scope.request.region
            };

            Status.setLoading('Creating network...');

            var createSuccess = function () {
                Status.setSuccessNext('Network Created');
                $location.path($scope.accountNumber + '/' + $scope.user + '/networks');
            };

            var createFailure = function (error) {
                $scope.error = error;
                Status.setError('Error creating network: ${message}', error);
            };

            NetworkResource.save(svcParams, network, createSuccess, createFailure);
        };

        $scope.cancel = function () {
            $location.path('/' + $scope.accountNumber + '/' + $scope.user + '/networks');
        };
    });

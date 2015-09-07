/**
* @ngdoc controller
* @name CreateInstanceCtrl
* @requires $scope
* @requires $q
* @requires $filter
* @requires $routeParams
* @requires $location
* @requires CloudRegions
* @requires Status
* @requires DbaasFlavorResource
* @requires DbaasInstanceResource
*/

angular.module('databases')
.controller('CreateInstanceCtrl', function ($scope, $q, $filter, $routeParams,
    $location, CloudRegions, Status, DbaasFlavorResource, DbaasInstanceResource) {

    Status.setScope($scope);

    $scope.user = $routeParams.user;
    $scope.accountNumber = $routeParams.accountNumber;
    $scope.request = {
        region: null
    };
    $scope.instance = {};

    $scope.setUpRequest = function () {
        return {
            user: $scope.user,
            region: $scope.request.region
        };
    };

    $scope.$watch('request.region', function () {
        if ($scope.request.region !== null) {
            loadFlavors();
        }
    });

    // Load Flavorsfor current region
    var loadFlavors = function () {
        var loadFlavorsSuccess = function (flavors) {
            var flavorList = _.sortBy(flavors.flavors, 'ram');

            $scope.flavors = [];
            _.each(flavorList, function (flavor) {
                var selectItem = {
                    'label': flavor.name,
                    'value': flavor.id
                };
                $scope.flavors.push(selectItem);
            });

            $scope.flavor = $scope.flavors[0].value;
        };

        var loadFlavorsFailure = function (error) {
            Status.setError('Error retrieving flavors: ${message}', error.data.error);
        };

        DbaasFlavorResource.get($scope.setUpRequest(), loadFlavorsSuccess, loadFlavorsFailure);
    };

    $scope.submit = function () {

        Status.setLoading('Creating instance...');

        var submitSuccess = function (response) {
            // on success, redirect to newly created instance's details page ಠ_ಠ
            Status.setSuccessNext('Instance Created.');
            $location.path(
                '/' + $scope.accountNumber + '/' + $scope.user + '/databases/instances/' +
                response.instance.region + '/' + response.instance.id);
        };

        var successFailure = function (error) {
            Status.setError('Error creating instance: ${message}', error.data.error);
        };

        var instanceDetails = {
            'flavorRef': $scope.flavor,
            'name': $scope.instance.displayName,
            'volume': {
                'size': $scope.instance.size.toString()
            }
        };

        if ($scope.instance.databaseName) {
            instanceDetails.databases = [{ 'name': $scope.instance.databaseName }];
        }

        if ($scope.instance.userName) {
            instanceDetails.users = [{
                'databases': [{ 'name': $scope.instance.databaseName }],
                'name': $scope.instance.userName,
                'password': $scope.instance.password
            }];
        }

        DbaasInstanceResource.save($scope.setUpRequest(), instanceDetails, submitSuccess, successFailure);
    };

    $scope.cancel = function () {
        $location.path('/' + $scope.accountNumber + '/' + $scope.user + '/databases/instances');
    };

    var loadRegions = function () {
        var getRegionsSuccess = function (regions) {
            // convert array of just region keys to form friendly values
            var convertedRegions = CloudRegions.convert(regions);
            $scope.regions = convertedRegions;

            // select the first region
            $scope.request.region = convertedRegions[0].value;

            // let page know we're done w/ initial page load
            Status.complete();
        };

        var getRegionsFailure = function (error) {
            Status.setError('Error retrieving regions: ${message}', error.data.error);
        };

        Status.setLoading('Gathering regions and flavors...');

        // Fire request for Database CloudRegions
        CloudRegions.getRegions($scope.user, 'Databases').then(getRegionsSuccess, getRegionsFailure);
    };

    loadRegions();
});

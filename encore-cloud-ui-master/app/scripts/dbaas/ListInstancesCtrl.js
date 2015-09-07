/**
* @ngdoc controller
* @name ListInstancesCtrl
* @requires $scope
* @requires $routeParams
* @requires $q
* @requires CloudRegionsUtil
* @requires Status
* @requires TableBoilerplate
* @requires rxStatusMappings
* @requires CloudRegionStatusUpdate
* @requires DbaasInstanceResource
*/
angular.module('databases')
.controller('ListInstancesCtrl', function ($scope, $routeParams, $q,
    CloudRegionsUtil, Status, TableBoilerplate, rxStatusMappings,
    CloudRegionStatusUpdate, DbaasInstanceResource) {

    TableBoilerplate.setup($scope, { predicate: 'name', reverse: false });

    $scope.loaded = false;
    Status.setScope($scope);

    $scope.user = $routeParams.user;
    $scope.accountNumber = $routeParams.accountNumber;

    $scope.page = {};

    $scope.actionsList = {
        'instanceActions': [
            'restartInstance', 'changeFlavor', 'resizeVolume',
            'deleteInstance', 'createDatabase', 'createUser'
        ]
    };

    $scope.instances = [];

    $scope.user = $routeParams.user;

    $scope.statusMappingsAPI = 'database-instances';

    // Map instance status to one of: ACTIVE ERROR INFO PENDING WARNING
    rxStatusMappings.mapToError(['BLOCKED', 'FAILED'], $scope.statusMappingsAPI);
    rxStatusMappings.mapToPending(['BACKUP', 'BUILD', 'REBOOT', 'RESIZE'], $scope.statusMappingsAPI);
    rxStatusMappings.mapToWarning(['RESTART_REQUIRED', 'SHUTDOWN'], $scope.statusMappingsAPI);

    var regionsStatus = CloudRegionStatusUpdate();

    // config data for loadInstances
    var config = {
        svc: DbaasInstanceResource.get,
        name: 'Databases',
        scopeProp: 'instances',
        user: $scope.user,
        regionsCallback: regionsStatus.buildRegionsCallback('Loading Instances (${regionName})')
    };

    // Requests instances for each region avialable
    var loadInstances = function () {
        var promise = CloudRegionsUtil.loadDataForEachRegion(config);

        promise.then(function clearStatusMsg (instances) {
            // if all calls succeed, remove page status
            $scope.instances = instances;
            return instances;
        }, function handleRegionsFailure (failedRegions) {
            // show error message if any fail
            var errorMsg = 'Error loading instances for: ' + failedRegions.join(', ');
            Status.setError(errorMsg);
        }, function updatePageData (instancesUpdate) {
            // update page data as data is returned
            $scope.instances = $scope.instances.concat(instancesUpdate);
            return instancesUpdate;
        }).
        finally(function () {
            Status.complete();
        });

        regionsStatus.promiseHandler(promise);
    };

    loadInstances();
});

/**
 * @ngdoc controller
 * @name ListSnapshotsCtrl
 * @requires $scope
 * @requires SnapshotService
 * @requires SnapshotResouce
 * @requires $routeParams
 * @requires CloudRegionsUtil
 * @requires VolumeService
 * @requires VOLUME_STORAGE_TYPES
 * @requires Status
 * @requires TableBoilerplate
 * @requires rxStatusMapping 
 */

angular.module('cbs')
    .controller('ListSnapshotsCtrl', function ($scope, SnapshotService, SnapshotResource, $routeParams,
        CloudRegionsUtil, VolumeService, VOLUME_STORAGE_TYPES, Status, TableBoilerplate, rxStatusMappings) {

        $scope.user = $routeParams.user;
        $scope.accountNumber = $routeParams.accountNumber;
        Status.setScope($scope);

        TableBoilerplate.setup($scope, { predicate: 'created_on', reverse: true });

        $scope.snapshots = [];

        $scope.types = VOLUME_STORAGE_TYPES;

        $scope.createVolume = VolumeService.create($scope.user);
        $scope.createdVolume = function () {
            Status.setSuccessImmediate('Volume Created');
        };

        $scope.statusMappingsAPI = 'cbs-snapshots';

        rxStatusMappings.mapToActive('available', $scope.statusMappingsAPI);
        rxStatusMappings.mapToPending(['creating', 'deleting'], $scope.statusMappingsAPI);
        rxStatusMappings.mapToError(['error_deleting', 'error'], $scope.statusMappingsAPI);

        $scope.deleteSnapshot = function (id, region) {
            Status.setLoading('Deleting Snapshot');

            var snapshotParams = {
                user: $scope.user,
                snapshotid: id,
                region: region
            };

            var deleteSnapshotSuccess = function () {
                // see klamping's note about handleDetachSuccess below.
                Status.setSuccessImmediate('Snapshot deleted');
                $scope.loadSnapshotDetails();
            };

            var deleteSnapshotFailure = function (error) {
                Status.setError('Error deleting snapshot: ${message}', error);
            };

            SnapshotService.delete(snapshotParams, deleteSnapshotSuccess, deleteSnapshotFailure);
        };

        // Requests snapshots for each region avialable
        // @note we make this function available on the scope so that we can refresh the data manually from the UI
        // @returns null
        $scope.loadSnapshotDetails = function () {

            Status.setLoading('Loading Details for Snapshots');

            // config data for snapshot details call
            var config = {
                svc: SnapshotResource.get,
                name: 'Snapshots',
                scopeProp: 'snapshots',
                user: $scope.user
            };

            var promise = CloudRegionsUtil.loadDataForEachRegion(config);
            $scope.regionErrorMsgs = '';

            promise.then(function (snapshots) {
                $scope.snapshots = snapshots;
            }, function (regionErrorMsgs) {
                // replace failed regions with latest update
                $scope.regionErrorMsgs = regionErrorMsgs;
            }, function (snapshots) {
                // update page data as data is returned
                $scope.snapshots = $scope.snapshots.concat(snapshots);
            }).finally(function () {
                Status.complete();
                if (!_.isEmpty($scope.regionErrorMsgs)) {
                    var errorMsg = $scope.regionErrorMsgs.join(', ');
                    Status.setError(errorMsg);
                }
            });
        };

        $scope.loadSnapshotDetails();
    });

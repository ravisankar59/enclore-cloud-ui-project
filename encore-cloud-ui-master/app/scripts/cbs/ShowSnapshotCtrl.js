/**
 * @ngdoc controller
 * @name ShowSnapShotCtrl
 * @requires $scope
 * @requires VolumeService
 * @requires VolumeResource
 * @requires SnapshotService
 * @requires $routeParams
 * @requires $location
 * @requires VOLUME_STORAGE_TYPES
 * @requires Status
*/
angular.module('cbs')
    .controller('ShowSnapshotCtrl', function ($scope, $routeParams, Status, SnapshotResource,
        VolumeService, VolumeResource, VOLUME_STORAGE_TYPES, rxPromiseNotifications, $location) {

        Status.setScope($scope);

        $scope.user = $routeParams.user;
        $scope.accountNumber = $routeParams.accountNumber;
        $scope.region = $routeParams.region;
        $scope.types = VOLUME_STORAGE_TYPES;

        var defaultResourceParams = {
            user: $scope.user,
            snapshotid: $routeParams.snapshotid,
            region: $scope.region
        };

        $scope.deleteSnapshot = function () {

            var snapshotParams = {
                user: $scope.user,
                snapshotid: $routeParams.snapshotid,
                region: $scope.region
            };

            var deleteSnapshot = SnapshotResource.delete(snapshotParams);
            rxPromiseNotifications.add(deleteSnapshot.$promise, {
                loading: 'Deleting Snapshot',
                error: 'Error deleting snapshot: {{data.error.message}}'
            });

            deleteSnapshot.$promise.then(function () {
                Status.setSuccessNext('Snapshot deleted');
                var snapshotsURL = '/' + $scope.accountNumber + '/' + $scope.user + '/cbs/snapshots';
                $location.path(snapshotsURL);
            });
        };

        $scope.loadSnapshotDetails = function () {
            Status.setLoading('Loading Snapshot Details');

            var snapshotDetailSuccess = function (data) {
                $scope.snapshot = data.snapshot;
                Status.complete();
            };

            var snapshotDetailFailure = function (error) {
                Status.setError('Error loading snapshot details: ${message}', error);
            };

            SnapshotResource.get(defaultResourceParams, snapshotDetailSuccess, snapshotDetailFailure);
        };

        $scope.createVolume = VolumeService.create($scope.user);

        $scope.loadSnapshotDetails();
        $scope.createdVolume = function () {
            Status.setSuccessImmediate('Volume Created');
        };
    });

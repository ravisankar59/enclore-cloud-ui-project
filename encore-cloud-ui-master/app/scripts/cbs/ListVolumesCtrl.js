/**
 * @ngdoc controller
 * @name ListVolumesCtrl
 * @requires $scope
 * @requires VolumeService
 * @requires VolumeResource
 * @requires SnapshotService
 * @requires $routeParams
 * @requires NextGenServers
 * @requires NextGenAttachments
 * @requires CloudRegionsUtil
 * @requires $location
 * @requires VOLUME_FORCE_TYPES
 * @requires Status
 * @requires rxStatusMappings
 * @requires TableBoilerplate
 * @requires CloudRegionStatusUpdate
*/
angular.module('cbs')
    .controller('ListVolumesCtrl', function ($scope, VolumeService, VolumeResource, SnapshotService, $routeParams,
            NextGenServers, NextGenAttachments, CloudRegionsUtil, $location, VOLUME_FORCE_TYPES,
            Status, rxStatusMappings, TableBoilerplate, CloudRegionStatusUpdate) {

        Status.setScope($scope);

        $scope.statusMappingsAPI = 'cbs-volumes';

        // Map volume statuses to one of: ACTIVE ERROR INFO PENDING WARNING
        rxStatusMappings.mapToActive('AVAILABLE', $scope.statusMappingsAPI);
        rxStatusMappings.mapToError('ERROR-DELETING', $scope.statusMappingsAPI);
        rxStatusMappings.mapToInfo('IN-USE', $scope.statusMappingsAPI);
        rxStatusMappings.mapToPending(['ATTACHING', 'CREATING', 'DELETING', 'DETACHING'], $scope.statusMappingsAPI);

        $scope.user = $routeParams.user;
        $scope.accountNumber = $routeParams.accountNumber;

        // set up column sorting
        TableBoilerplate.setup($scope, { predicate: 'display_name', reverse: false });

        $scope.volumes = [];

        $scope.getAttachedServer = function (serverId, region, modalScope) {
            modalScope.region = region;
            modalScope.serverId = serverId;

            var apiPromise = NextGenServers.get({
                user: $scope.user,
                id: serverId,
                region: region
            }).$promise;

            apiPromise.then(function loadServerDetails (data) {
                // on load, add server name to scope to
                // replace the server id
                modalScope.serverName = data.server.name;
            });
        };

        $scope.canDetach = function (volumeStatus) {
            return $scope.loaded && volumeStatus !== 'detaching';
        };

        $scope.detachVolume = function (serverId, attachmentId, region) {
            Status.setLoading('Detaching Volume');

            function handleDetachSuccess () {
                Status.setSuccessImmediate('Attachment Detached');
                $scope.loadVolumeDetails();
            }

            function showDetachError (error) {
                Status.setError('Error Detaching Volume: ${message}', error);
            }

            var config = {
                user: $scope.user,
                region: region,
                id: serverId,
                attachmentid: attachmentId
            };

            NextGenAttachments.delete(config)
                .$promise.then(handleDetachSuccess, showDetachError);
        };

        $scope.createVolume = VolumeService.create($scope.user);
        $scope.createSnapshot = SnapshotService.create($scope);
        $scope.createdSnapshot = function () {
            Status.setSuccessImmediate('Snapshot Created');
        };

        $scope.deleteVolume = function (id, region) {

            var defaultResourceParams = {
                user: $scope.user,
                volumeid: id,
                region: region
            };

            Status.setLoading('Deleting Volume');

            function redirectToListing () {
                Status.setSuccessImmediate('Volume Deleted');
                $scope.loadVolumeDetails();
            }

            function showDeleteError (error) {
                Status.setError('Error Deleting Volume: ${message}', error);
            }

            VolumeService.delete(defaultResourceParams)
                .$promise.then(redirectToListing, showDeleteError);
        };

        $scope.preCreateSnapshot =  function (modalScope) {
            modalScope.forceTypes = VOLUME_FORCE_TYPES;
            // Defaulting the dropdown to No rather than blank.
            modalScope.fields = {
                'force': modalScope.forceTypes[1].value
            };
        };

        var regionsStatus = CloudRegionStatusUpdate();

        // config data for volumes listing call
        var config = {
            svc: VolumeResource.get,
            name: 'Volumes',
            scopeProp: 'volumes',
            user: $scope.user,
            regionsCallback: regionsStatus.buildRegionsCallback('Loading Volumes (${regionName})')

        };

        // Requests volumes for each region avialable
        // @param {Array=} regionsData - which regions to ask for volumes from. 'CloudRegions.get' passes in this value
        // @note we make this function available on the scope so that we can refresh the data manually from the UI
        // @returns null
        $scope.loadVolumeDetails = function () {
            var promise = CloudRegionsUtil.loadDataForEachRegion(config);
            promise.then(function (volumes) {
                $scope.volumes = volumes;
                return volumes;
            }, function (regionErrorMsgs) {
                // update failed regions with latest version from CloudRegions
                $scope.regionErrorMsgs = regionErrorMsgs;
            }, function (volumes) {
                // update page data as data is returned
                $scope.volumes = $scope.volumes.concat(volumes);
                return volumes;
            })
            .finally(function () {
                Status.complete();

                if (!_.isEmpty($scope.regionErrorMsgs)) {
                    var errorMsg = $scope.regionErrorMsgs.join(', ');
                    Status.setError(errorMsg);
                }
            });

            regionsStatus.promiseHandler(promise);
        };

        $scope.loadVolumeDetails();
    });

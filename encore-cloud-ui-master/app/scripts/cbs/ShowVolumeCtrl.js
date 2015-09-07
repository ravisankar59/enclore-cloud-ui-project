/**
 * @ngdoc controller
 * @name ShowVolumeCtrl
 * @requires $scope
 * @requires $routeParams
 * @requires $filter
 * @requires VolumeResource
 * @requires SnapshotResource
 * @requires Status
 * @requires NextGenServers
 * @requires NextGenAttachments
 * @requires $location
 * @requires AttachVolume
 * @requires VolumeService
 * @requires SnapshotService
 * @requires VOLUME_STORAGE_TYPES
 * @requires VOLUME_FORCE_TYPES
 * @requires TableBoilerplate
 * @requires rxStatusMappings
*/
angular.module('cbs')
    .controller('ShowVolumeCtrl', function ($scope, $routeParams, $filter, VolumeResource, SnapshotResource,
        Status, NextGenServers, NextGenAttachments, $location, AttachVolume, VolumeService,
        SnapshotService, VOLUME_STORAGE_TYPES, VOLUME_FORCE_TYPES, TableBoilerplate, rxStatusMappings) {

        Status.setScope($scope);

        $scope.user = $routeParams.user;
        $scope.accountNumber = $routeParams.accountNumber;
        $scope.region = $routeParams.region;
        $scope.volumeId = $routeParams.volumeid;
        $scope.snapshots = [];

        rxStatusMappings.mapToActive('available', $scope.statusMappingsAPI);
        rxStatusMappings.mapToPending(['creating', 'deleting'], $scope.statusMappingsAPI);
        rxStatusMappings.mapToError(['error_deleting', 'error'], $scope.statusMappingsAPI);

        TableBoilerplate.setup($scope, { predicate: 'created_on', reverse: true });

        /* Do the filtering here rather than the ng-repeat so we can
         * easily tell whether or not `snapshots` is an empty array
         */
        var filterSnapshots = function () {
            $scope.filteredSnapshots = $filter('filter')($scope.snapshots, function (snapshot) {
                /* jshint camelcase:false */
                if (_.has($scope.volume, 'id')) {
                    return snapshot.volume_id === $scope.volume.id;
                }
                return false;
            });
        };

        $scope.$watchCollection('snapshots', filterSnapshots);

        $scope.$watchCollection('volume', filterSnapshots);

        var defaultResourceParams = {
            user: $scope.user,
            volumeid: $routeParams.volumeid,
            region: $scope.region
        };

        $scope.attachVolume = {
            preHook: AttachVolume.preHook.bind($scope),
            postHook: AttachVolume.postHook.bind($scope)
        };

        $scope.types = VOLUME_STORAGE_TYPES;

        $scope.createSnapshot = SnapshotService.create($scope.user);
        $scope.createVolume = VolumeService.create($scope.user);

        $scope.createdSnapshot = function () {
            Status.setSuccessImmediate('Snapshot Created');
        };

        $scope.createdVolume = function () {
            Status.setSuccessImmediate('Volume Created');
        };

        $scope.loadVolumeDetails = function () {
            Status.setLoading('Loading Volume Details');

            var volumeDetailSuccess = function (data) {
                $scope.volume = data.volume;
                $scope.attachment = _.isEmpty($scope.volume.attachments) ? {} : $scope.volume.attachments[0];
                Status.complete();
            };

            var volumeDetailFailure = function (error) {
                Status.setError('Error loading volume details: ${message}', error);
            };

            VolumeResource.get(defaultResourceParams, volumeDetailSuccess, volumeDetailFailure);
        };

        $scope.deleteSnapshot = function (id) {
            Status.setLoading('Deleting snapshot');

            var deleteSnapshotSuccess = function () {
                // see klamping's note about handleDetachSuccess below.
                Status.setSuccessImmediate('Snapshot deleted.');
                $scope.loadSnapshots();
            };

            var deleteSnapshotFailure = function (error) {
                Status.setError('Error deleting snapshot: ${message}', error);
            };

            var snapshotParams = _.clone(defaultResourceParams);
            delete snapshotParams.volumeid;
            snapshotParams.snapshotid = id;

            SnapshotResource.delete(snapshotParams, deleteSnapshotSuccess, deleteSnapshotFailure);
        };

        $scope.loadSnapshots = function () {
            Status.setLoading('Loading snapshots', { prop: 'loadingSnapshots' });

            var snapshotListSuccess = function (data) {
                $scope.snapshots = data.snapshots;
                Status.complete({ prop: 'loadingSnapshots' });
            };

            var snapshotListFailure = function (error) {
                Status.setError('Error loading snapshots: ${message}', error, { prop: 'loadingSnapshots' });
            };

            SnapshotResource.get(defaultResourceParams, snapshotListSuccess, snapshotListFailure);
        };

        $scope.preCreateSnapshot = function (modalScope) {
            modalScope.forceTypes = VOLUME_FORCE_TYPES;
            // Defaulting the dropdown to No rather than blank.
            modalScope.fields = {
                'force': modalScope.forceTypes[1].value
            };
        },

        $scope.createSnapshot = SnapshotService.create($scope, $scope.loadSnapshots.bind($scope));

        $scope.getAttachedServer = function (serverId, modalScope) {
            var apiPromise = NextGenServers.get({
                user: $scope.user,
                id: serverId,
                region: $scope.region
            }).$promise;

            apiPromise.then(function loadServerDetails (data) {
                // on load, add server name to scope to
                // replace the server id
                modalScope.serverName = data.server.name;
                modalScope.serverId = serverId;
            });
        };

        $scope.detachVolume = function (serverId, attachmentId) {
            Status.setLoading('Detaching Volume');

            function handleDetachSuccess () {
                Status.setSuccessImmediate('Successfully submitted request to detach volume.');
                $scope.loadVolumeDetails();
            }

            function showDetachError (error) {
                Status.setError('Error Detaching Volume: ${message}', error);
            }

            var config = {
                user: $scope.user,
                region: $scope.region,
                id: serverId,
                attachmentid: attachmentId
            };

            NextGenAttachments.delete(config)
                .$promise.then(handleDetachSuccess, showDetachError);
        };

        $scope.deleteVolume = function () {
            Status.setLoading('Deleting Volume');

            function redirectToListing () {
                Status.setSuccessNext('Volume Deleted');
                $location.path('/' + $scope.accountNumber + '/' + $scope.user + '/cbs/volumes');
            }

            function showDeleteError (error) {
                Status.setError('Error Deleting Volume: ${message}', error);
            }

            VolumeResource.delete(defaultResourceParams)
                .$promise.then(redirectToListing, showDeleteError);
        };

        $scope.canAttach = function () {
            /* jshint camelcase:false */
            return !$scope.attachment.server_id && $scope.loaded && $scope.volume.status !== 'attaching';
        };

        $scope.canDetach = function () {
            /* jshint camelcase:false */
            return $scope.attachment.server_id && $scope.loaded && $scope.volume.status !== 'detaching';
        };

        $scope.loadVolumeDetails();
        $scope.loadSnapshots();
    })
    .factory('AttachVolume', function (NextGenServers, NextGenAttachments, devicePaths, Status) {
        return {
            preHook: function (modalScope) {
                var populateServerData = function (data) {
                    var allServers = data.servers;

                    // convert response into array [ { key, value} ]
                    modalScope.servers = _.map(allServers, function disableNonActive (server) {
                        var option = {
                            label: server.name + ' (' + server.status.toLowerCase() + ')',
                            value: server.id
                        };

                        // we need to disable any servers that don't have a status of 'active'
                        if (server.status !== 'ACTIVE') {
                            option.disabled = true;
                        }

                        return option;
                    });

                    modalScope.isLoading = false;
                };

                var showErrorMessage = function () {
                    // remove loading spinner, error message will show automatically
                    modalScope.isLoading = false;
                };

                // only load servers if they haven't already been loaded
                // this prevents a duplicate content bug where two sets of form fields appear
                if (!modalScope.servers) {
                    modalScope.isLoading = true;

                    modalScope.paths = devicePaths;

                    // attach the volume id to the fields so that it's sent in the API call
                    modalScope.fields = {
                        'volume_id': this.volume.id
                    };

                    NextGenServers.get({
                        user: this.user,
                        region: this.region
                    }, populateServerData, showErrorMessage);
                }
            },
            postHook: function (fields) {
                var pageScope = this;

                Status.setLoading('Attaching volume...', { prop: 'loadingAttachingVolume' });

                var params = {
                    user: pageScope.user,
                    region: pageScope.region,
                    id: fields.server
                };

                var showSuccessMessage = function () {
                    /* jshint maxlen:false */
                    Status.setSuccessImmediate('Successfully submitted request to attach volume.', { prop: 'loadingAttachingVolume' });
                    pageScope.loadVolumeDetails();
                };

                var showFailureMessage = function (error) {
                    Status.setError('Error attaching volume: ${message}', error, { prop: 'loadingAttachingVolume' });
                };

                // remove server id from fields
                fields = _.omit(fields, 'server');

                NextGenAttachments.save(params, fields, showSuccessMessage, showFailureMessage);
            }
        };
    });

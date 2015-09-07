/**
 * @ngdoc controller
 * @name CreateVolumeCtrl
 * @requires $scope
 * @requires VolumeServices
 * @requires $routeParams
 * @requires CloudRegions
 * @requires $location
 * @requires Status
 * @requires VOLUME_STORAGE_TYPES
 * @requires SnapshotResource
 * @requires CloudRegionUtil
 * @requires $filter
 */
angular.module('cbs')
    .controller('CreateVolumeCtrl', function ($scope, VolumeService, $routeParams, CloudRegions,
            $location, Status, VOLUME_STORAGE_TYPES, SnapshotResource, CloudRegionsUtil, $filter) {

        $scope.user = $routeParams.user;
        $scope.accountNumber = $routeParams.accountNumber;
        Status.setScope($scope);

        $scope.types = VOLUME_STORAGE_TYPES;
        $scope.request = {};

        $scope.volume = {
            'display_name': '',
            // select the first type by default
            'volume_type': $scope.types[0].value,
            'size': ''
        };

        var populateRegionsData = function (regions) {
            // convert array of just region keys to form friendly values
            var convertedRegions = CloudRegions.convert(regions);
            $scope.regions = convertedRegions;

            // select the first region
            $scope.request.region = convertedRegions[0].value;

            // let page know we're done w/ initial page load
            $scope.loaded = true;
        };

        var showRegionsFailureStatus = function (error) {
            Status.setError('Error retrieving regions: ${message}', error);
        };

        // Code for submitting the form and sending/handling the API call
        var redirectToVolumes = function () {
            Status.setSuccessNext('Volume created.');

            // redirect to overview page
            $location.path('/' + $scope.accountNumber + '/' + $scope.user + '/cbs/volumes');
        };

        var showFailureMessage = function (error) {
            Status.setError('Error creating volume: ${message}', error);
        };

        $scope.snapshotSelect = [
            {
                label: 'None',
                value: false
            }, {
                label: 'Select a snapshot',
                value: true
            }
        ];

        $scope.minSize = 75;

        $scope.updateMinSize = function () {
            if ($scope.volume['volume_type'] === 'SATA') {
                $scope.minSize = 75;
                $scope.volume.size = '';
            }
            if ($scope.volume['volume_type'] === 'SSD') {
                $scope.minSize = 50;
                $scope.volume.size = '';
            }
        };

        $scope.snapshotsTableColumns = [
            {
                'label': 'Name/ID',
                'key': 'id'
            },
            {
                'label': 'Volume',
                'key': 'volume_id'
            },
            {
                'label': 'Created/Age',
                'key': 'created_on'
            },
            {
                'label': 'Size',
                'key': 'size'
            },
            {
                'label': 'Region',
                'key': 'region'
            }
        ];

        $scope.snapshotsTable = {
            visible: 'false'
        };

        $scope.snapshots = [];

        $scope.loadSnapshots = function () {
            // config data for snapshot details call
            var config = {
                svc: SnapshotResource.get,
                name: 'Snapshots',
                scopeProp: 'snapshots',
                user: $scope.user
            };

            var promise = CloudRegionsUtil.loadDataForEachRegion(config);
            $scope.regionErrorMsgs = '';

            var displayName = function (row) {
                /* jshint camelcase:false */
                return (row.display_name ? row.display_name : 'N/A') +
                    '\n<br /><span class="subdued">' + row.id + '</span>';
            };

            var createdOn = function (row) {
                /* jshint camelcase:false */
                if (row.created_on) {
                    return $filter('date')(row.created_on, 'MMM d, yyyy @ HH:mm (UTCZ)') +
                        '\n<br /><span class="subdued">' + $filter('rxAge')(row.created_on) +
                        '</span>';
                }
                return 'N/A';
            };

            var transformSnapshots = function (snapshots) {
                var transformedSnapshots = [];
                _.forEach(snapshots, function (row) {
                    var snapshot = {
                        /* jshint camelcase:false */
                        id: displayName(row),
                        value: row.id,
                        size: $filter('rxDiskSize')(row.size),
                        volume_id: row.volume_id,
                        created_on: createdOn(row),
                        region: row.region
                    };
                    transformedSnapshots.push(snapshot);
                });
                return transformedSnapshots;
            };

            promise.then(function (snapshots) {
                $scope.snapshots = snapshots;
            }, function (regionErrorMsgs) {
                // replace failed regions with latest update
                $scope.regionErrorMsgs = regionErrorMsgs;
            }, function (snapshots) {
                // update page data as data is returned
                $scope.snapshots = $scope.snapshots.concat(snapshots);
                $scope.snapshotsTableData = transformSnapshots($scope.snapshots);
            }).finally(function () {
                Status.complete();
                if (!_.isEmpty($scope.regionErrorMsgs)) {
                    var errorMsg = $scope.regionErrorMsgs.join(', ');
                    Status.setError(errorMsg);
                }
            });
        };

        $scope.sendCreateRequest = function () {

            if ($scope.snapshotsTable.visible === 'false'){
                delete $scope.volume['snapshot_id'];
            }

            if ($scope.volume['volume_type'] === 'SATA' && $scope.volume.size < 75) {
                Status.setError('Minimum size for SATA volumes is 75 GB.');
                return;
            }

            if ($scope.volume['volume_type'] === 'SSD' && $scope.volume.size < 50) {
                Status.setError('Minimum size for SSD volumes is 50 GB.');
                return;
            }

            if ($scope.volume.size > 1024) {
                Status.setError('Maximum size for volumes is 1024 GB.');
                return;
            }

            Status.setLoading('Sending Create Signal');
            VolumeService.create($scope.user)($scope.volume, $scope.volume['snapshot_id'], $scope.request.region)
                .then(redirectToVolumes, showFailureMessage);
        };

        $scope.cancel = function () {
            $location.path('/' + $scope.accountNumber + '/' + $scope.user + '/cbs/volumes');
        };

        // Set page status to loading
        Status.setLoading('Loading Details');

        // Make initial request to get region data
        CloudRegions.getRegions($scope.user, 'Volumes').then(populateRegionsData, showRegionsFailureStatus);

        $scope.loadSnapshots();
    });

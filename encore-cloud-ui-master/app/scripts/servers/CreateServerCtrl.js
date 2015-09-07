angular.module('servers')
.controller('CreateServerCtrl', function ($scope, $routeParams, $q, $filter,
    $location, CloudRegions, CloudUsers, FirstGenServers, NextGenServers, Status,
    NetworkService, TableBoilerplate, Encore, NextGenNetworks, NextGenBootSource,
    rxPromiseNotifications, CloudServerFlavorClasses, RackConnectAccountResource, RackConnectNetworkResource) {

    var self = this;

    TableBoilerplate.setup($scope, { predicate: 'id', reverse: false });

    Status.setScope($scope);

    $scope.user = $routeParams.user;
    $scope.accountNumber = $routeParams.accountNumber;

    $scope.serviceLevel = undefined;
    $scope.rackConnect = {
        version: null,
        regions: [],
        networks: []
    };

    $scope.serverId = $routeParams.serverId;

    $scope.server = {};
    $scope.volume = {
        deleteOnTermination: false,
        volumeSize: 100,
        bootIndex: '0',
        sourceType: 'image',
        destinationType: 'volume'
    };
    $scope.serverInfo = { region: null, bootSource: 'local' };
    $scope.showRackConnect3Warning = false;

    // `allNetworks` is the list of all networks returned by the API
    // `networks` is the filtered subset of `allNetworks` that lives in the selected region

    $scope.failedRequests = [];

    $scope.$watch('serverInfo.region', function () {
        self.filterNetworks();
    });

    $scope.columns = {
        'NextGen': {
            'image': {
                'rackspace': [{
                    'label': 'Name',
                    'key': '{{name}}'
                }, {
                    'label': 'Min Ram',
                    'key': '{{min_ram === null ? "" : min_ram + " MB"}}'
                }, {
                    'label': 'Min Disk',
                    'key': '{{min_disk | rxDiskSize }}'
                }, {
                    'label': 'Created On',
                    'key': '{{created | date:"short"}}'
                }],
                'saved': [{
                    'label': 'Name',
                    'key': '{{name}}'
                }, {
                    'label': 'Min Ram',
                    'key': '{{min_ram === null ? "" : min_ram + " MB"}}'
                }, {
                    'label': 'Min Disk',
                    'key': '{{min_disk | rxDiskSize }}'
                }, {
                    'label': 'Created On',
                    'key': '{{created | date:"short"}}'
                }]
            },
            'flavor': [{
                'label': 'Name',
                'key': '{{name}}'
            }, {
                'label': 'Ram',
                'key': '{{ram}}'
            }, {
                'label': 'vCPU',
                'key': '{{vcpus}}'
            }, {
                'label': 'System Disk',
                'key': '{{disk_size}}'
            }]
        },
        'FirstGen': {
            'image': {
                'rackspace': [{
                    'label': 'Name',
                    'key': '{{name}}'
                }, {
                    'label': 'Min Ram',
                    'key': '{{min_ram === null ? "" : min_ram + " MB"}}'
                }, {
                    'label': 'Min Disk',
                    'key': '{{min_disk | rxDiskSize }}'
                }, {
                    'label': 'Created On',
                    'key': '{{created | date:"short"}}'
                }],
                'saved': [{
                    'label': 'Name',
                    'key': '{{name}}'
                }, {
                    'label': 'Min Ram',
                    'key': '{{min_ram === null ? "" : min_ram + " MB"}}'
                }, {
                    'label': 'Min Disk',
                    'key': '{{min_disk | rxDiskSize }}'
                }, {
                    'label': 'Created On',
                    'key': '{{created | date:"short"}}'
                }]
            },
            'flavor': [{
                'label': 'Name',
                'key': '{{name}}'
            }, {
                'label': 'Ram',
                'key': '{{ram}}'
            }, {
                'label': 'Disk',
                'key': '{{disk_size}}'
            }]
        }
    };

    // The onChange function for the networks table
    $scope.checkNetworkRequirements = function (network) {
        $scope.showRackConnect3Warning = self.shouldShowRackConnect3Warning(network);
    };

    // Function used to enfore the Rack Connect v3 requirement
    // that exactly one isolated network to be selected
    self.shouldShowRackConnect3Warning = function (network) {
        return $scope.isRackConnect3() &&
            !network.rackspaceNetwork &&
            _.filter($scope.rackConnect.networks, 'checked').length !== 1;
    };

    $scope.imageTabs = {
        'NextGen': [
            { title: 'rackspace' },
            { title: 'saved' }
        ],
        'FirstGen': [
            { title: 'rackspace' },
            { title: 'saved' }
        ]
    };

    $scope.imageSelected = ($routeParams.imageRegion && $routeParams.imageId);

    $scope.chooseFlavor = function (flavorClass) {
        var flavorColumns = [{
                'label': 'Name',
                'key': '{{name}}'
            }, {
                'label': 'Ram',
                'key': '{{ram}}'
            }, {
                'label': 'vCPU',
                'key': '{{vcpus}}'
            }, {
                'label': 'System Disk',
                'key': '{{disk_size}}'
            }];

        if (flavorClass === 'Performance 1' || flavorClass === 'Performance 2') {
            $scope.columns.NextGen.flavor = flavorColumns.concat([{
                    'label': 'Disk I/O',
                    'key': '{{extra_specs.disk_io_index}}'
                }]);
        } else {
            $scope.columns.NextGen.flavor = flavorColumns;
        }
    };

    var loadFlavors = function (svc, svcParams) {
        var promise = svc.getFlavors(svcParams).$promise;
        promise.then(function (flavors) {
            var flavorList = _.sortBy(flavors.flavors, 'ram');

            _.each(flavorList, function (flavor) {
                flavor.value = flavor.id;
            });

            $scope.flavorClasses = CloudServerFlavorClasses(flavorList);
            _.remove($scope.flavorClasses, { id: 'classic' });
            $scope.flavors = _.groupBy(flavorList, function (flavor) {
                return flavor.flavorClass.id;
            });
        });
        rxPromiseNotifications.add(promise, {
            error: 'Error retrieving flavors: {{ data.error.message || statusText }}',
            loading: 'Loading Flavors'
        });
        return promise;
    };

    var selectTabForImage = function (imageId) {
        var isSavedImage = _.some($scope.images.saved, { id: imageId });
        if (isSavedImage) {
            var type = $scope.serverInfo.region.type;
            var savedImageTab = _.last($scope.imageTabs[type]);
            savedImageTab.active = true;
        }
    };

    var selectRegionForImage = function (imageRegion) {
        var region = _.find($scope.regions, { value: imageRegion });
        $scope.serverInfo.region = region || _.first($scope.regions);
    };

    var loadImages = function (svc, svcParams) {
        var deferred = $q.defer();

        Status.setLoading('Loading Images', { prop: 'loadingImages' });

        svc.getImages(svcParams,
        function (images) {
            Status.complete({ prop: 'loadingImages' });
            var imageList = _.sortBy(images.images, 'name');

            _.each(imageList, function (image) {
                image.value = image.id;
            });

            $scope.images = {};
            $scope.images.rackspace = $filter('filter')(imageList, {
                status: 'ACTIVE',
                metadata: {
                    'image_type': 'base'
                }
            });
            $scope.images.saved = $filter('filter')(imageList, {
                status: 'ACTIVE',
                metadata: {
                    'image_type': 'snapshot'
                }
            });

            // Check for pre-selected image
            if ($scope.imageSelected) {
                selectTabForImage($routeParams.imageId);
                $scope.server.image = $routeParams.imageId;

                // Clear selected image so it won't try to reset on region change.
                $scope.imageSelected = false;
            }

            deferred.resolve();
        },
        function (error) {
            Status.setError('Error retrieving images: ${message}', error, { prop: 'loadingImages' });
            deferred.reject();
        });

        return deferred.promise;
    }; // loadImages()

    self.filterNetworks = function () {

        var currentRegion, networks;

        if ($scope.serverInfo.region) {
            currentRegion = $scope.serverInfo.region;
        }

        if (_.isEmpty(currentRegion)) {
            networks = $scope.allNetworks;
        // Only ServiceNet and PublicNet allowed for Rack Connect v2
        } else if ($scope.isRackConnect2()) {
            networks = _.filter($scope.allNetworks, function (network) {
                return network.rackspaceNetwork && network.region === currentRegion.value;
            });
        // Only ServiceNet and RackConnect networks allowed for Rack Connect v3
        } else if ($scope.isRackConnect3()) {
            var serviceNet = _.filter($scope.allNetworks, function (network) {
                return network.title === 'ServiceNet' && network.region === currentRegion.value;
            });
            networks = $scope.rackConnect.networks.concat(serviceNet);
        } else {
            networks = _.filter($scope.allNetworks, function (network) {
                return network.region === currentRegion.value;
            });
        }

        $scope.networks = networks;
        self.setNetworkRestrictions();
    }; // filterNetworks();

    self.setNetworkRestrictions = function () {

        var warningMsgs = {
            /* jshint maxlen:false, quotmark:false */
            'public': "By deselecting PublicNet, this server won't be able to connect to Monitoring or possible future products. This cannot be changed once the server is created",
            'private': "By deselecting ServiceNet, this server won't be able to connect to Load Balancers, Backup, Images, or RackConnect. This cannot be changed once the server is created"
        };

        _.forEach($scope.networks, function (network) {
            network.checked = false;
            network.hasRestrictions = false;
            // If mandatory, it should be checked with no warning message
            // since they can't change it, as it is disabled
            if ($scope.isMandatoryNetwork(network)){
                network.checked = true;
            // If it's not mandatory, but it's an RS network, it should be checked
            // with a warning message
            } else if (network.rackspaceNetwork) {
                network.checked = true;
                network.hasRestrictions = true;
                network.warningMessage = warningMsgs[network.label];
            }
        });

        // Check the first Cloud Network for Rack Connect v3
        if ($scope.isRackConnect3() && !_.isEmpty($scope.rackConnect.networks)) {
            $scope.rackConnect.networks[0].checked = true;
        }

    }; // setNetworkRestrictions()

    self.loadNetworks = function () {
        Status.setLoading('Loading Networks', { prop: 'loadingNetworks' });
        NetworkService.fetchNetworks($scope.user, $scope)
            .then(self.loadNetworksSuccess)
            .finally(self.loadNetworksFinally);
    };

    // There is no loadNetworksFailure function because NetworkService.fetchNetworks
    // always resolves, storing any errors in $scope.failedRequests
    self.loadNetworksSuccess = function (data) {
        $scope.allNetworks = _.flatten(data);
        self.filterNetworks();
    };

    self.loadNetworksFinally = function () {
        if (!_.isEmpty($scope.failedRequests)) {
            var errorMsg = 'Error loading networks: ' + $scope.failedRequests.join(', ');
            Status.setError(errorMsg, {}, { prop: 'loadingNetworks' });
        } else {
            Status.complete({ prop: 'loadingNetworks' });
        }
    };

    $scope.loadRegion = function () {
        $scope.flavors = $scope.images = null;

        // Check for pre-selected image
        if ($scope.imageSelected) {
            selectRegionForImage($routeParams.imageRegion);
        }

        var request = setUpRequest();
        $scope.images = {};
        $scope.flavors = {};
        $scope.flavorClasses = [];
        $scope.rackConnect.networks = [];

        var promises = [loadImages(request.svc, request.svcParams),
                         loadFlavors(request.svc, request.svcParams)];

        // Load RackConnect networks for RackConnect v3 only
        if ($scope.isRackConnect3()) {
            promises.push(loadRackConnectNetworks());
        }

        return $q.all(promises);

    }; // $scope.loadRegion()

    var setUpRequest = function () {
        var svc;
        var svcParams = {
            user: $scope.user
        };

        if ($scope.serverInfo.region.type === 'FirstGen') {
            svc = FirstGenServers;
        } else {
            svc = NextGenServers;
            svcParams.region = $scope.serverInfo.region.value;
        }

        return { 'svc': svc, 'svcParams': svcParams };
    };

    $scope.flavorCheck = function (flavorClass) {
        $scope.bootLocalOnly = false;
        $scope.bootFromVolumeOnly = _.contains(['compute', 'memory'], flavorClass.id);
        if ($scope.bootFromVolumeOnly === true) {
            $scope.serverInfo.bootSource = 'new';
        } else if (flavorClass.id === 'standard') {
            $scope.serverInfo.bootSource = 'local';
            $scope.bootLocalOnly = true;
        }
    };

    $scope.isNextGen = function () {
        if ($scope.serverInfo.region === null) {
            return false;
        } else if ($scope.serverInfo.region.type === 'NextGen') {
            return true;
        } else {
            return false;
        }
    };

    $scope.submit = function () {
        var handleServerSuccess = function (response) {
            // on success, redirect to servers overview page and post PW
            var pw = response.server['admin_pass'];
            Status.setInfo('Server being set up. Admin password will be ' + pw, { show: 'next' });
            $location.path('/' + $scope.accountNumber + '/' + $scope.user + '/servers');
        };

        var request = setUpRequest();

        if ($scope.isNextGen()) {

            // Adds $scope.networks to server config
            NextGenNetworks($scope.server, $scope.networks);

            if ($scope.serverInfo.bootSource !== 'local') {
                // This will delete $scope.server.image, $scope.server.flavor;
                NextGenBootSource($scope.server, $scope.server.image, $scope.volume, $scope.serverInfo.bootSource);
                request.svcParams.id = 'boot-from-volume';

            }
        }
        var createServerPromise = request.svc.save(request.svcParams, $scope.server, handleServerSuccess).$promise;
        rxPromiseNotifications.add(createServerPromise, {
            error: 'Error creating server: {{ data.error.message || statusText }}',
            loading: 'Creating Server...'
        });
    }; // $scope.submit()

    $scope.cancel = function () {
        $location.path('/' + $scope.accountNumber + '/' + $scope.user + '/servers');
    };

    $scope.isRackConnect2 = function () {
        return $scope.rackConnect.version === '2' &&
            self.isRackConnectRegion();
    };

    $scope.isRackConnect3 = function () {
        return $scope.rackConnect.version === '3' &&
            self.isRackConnectRegion() &&
            $scope.serverInfo.region.type === 'NextGen';
    };

    self.isRackConnectRegion = function () {
        return !_.isEmpty($scope.serverInfo.region) &&
            _.include($scope.rackConnect.regions, $scope.serverInfo.region.value);
    };

    // Promises should resolve successfully here to ensure subsequent
    // promises (i.e. filterNetworks) will run.
    self.loadAccount = function () {
        return $q.all([
            self.loadAccountDetails(),
            self.loadRackConnectAccountDetails()
        ]);
    };

    self.loadAccountDetails = function () {
        Status.setLoading('Loading account details', { prop: 'loadingAccountDetails' });
        var supportServiceParams = {
            id: $scope.user
        };
        var deferred = $q.defer();

        var success = function (data) {
            $scope.serviceLevel = data.serviceLevel;
            Status.complete({ prop: 'loadingAccountDetails' });
            deferred.resolve();
        };

        var failure = function () {
            /*jshint quotmark: double */
            Status.setError("Could not determine if this is a 'Managed' account.", {},
                            { prop: "loadingAccountDetails" });

            // We resolve to ensure the success callback for $scope.loadAccount will run
            deferred.resolve();
        };

        Encore.getAccountByIdentityUsername(supportServiceParams, success, failure);

        return deferred.promise;

    }; // self.loadAccountDetails()

    self.loadRackConnectAccountDetails = function () {
        var svcParams = {
            user: $scope.user,
            accountNumber: $scope.accountNumber
        };
        var deferred = $q.defer();

        var success = function (data) {
            $scope.rackConnect.version = data['version'];
            $scope.rackConnect.regions = data['regions'];
        };

        // We resolve because not every account will be Rack Connected, and to ensure
        // the success callback for $scope.loadAccount will run
        RackConnectAccountResource.get(svcParams).$promise.then(success)
            .finally(deferred.resolve.bind(deferred));

        return deferred.promise;
    }; // loadRackConnectAccountDetails()

    var loadRackConnectNetworks = function () {
        Status.setLoading('Loading Rack Connect Networks', { prop: 'loadingRackConnectNetworks' });
        var svcParams = {
            'region': $scope.serverInfo.region.value,
            'accountNumber': $scope.accountNumber
        };
        var deferred = $q.defer();

        var success = function (data) {
            $scope.rackConnect.networks = data['cloud_networks'];

            _.each($scope.rackConnect.networks, function (network) {
                network.region = $scope.serverInfo.region.value;
            });

            self.filterNetworks();
            Status.complete({ prop: 'loadingRackConnectNetworks' });
            deferred.resolve();
        };

        var failure = function () {
            Status.complete({ prop: 'loadingRackConnectNetworks' });
            // We resolve because it is okay to not have Rack Connect networks,
            // since not every account is Rack Connected, and to ensure the success
            // callback for $scope.loadRegion will run
            deferred.resolve();
        };

        RackConnectNetworkResource.get(svcParams, success, failure);

        return deferred.promise;
    }; // loadRackConnectNetworks()

    // Determines whether the passed-in network is mandatory for server creation
    $scope.isMandatoryNetwork = function (network) {
        var rackConnect = self.isRackConnectRegion() ? $scope.rackConnect : null;
        // ServiceNet and PublicNet are required for Rack Connect v2
        // ServiceNet is required for Rack Connect v3 "managed" accounts
        if (rackConnect) {
            if (network.title === 'ServiceNet') {
                return rackConnect.version === '2' ||
                    rackConnect.version === '3' && $scope.serviceLevel === 'managed';
            } else if (network.title === 'PublicNet') {
                return rackConnect.version === '2';
            } else {
                return false;
            }
        } else {
            return $scope.serviceLevel === 'managed' && network.rackspaceNetwork;
        }
    };

    $scope.shouldDisableCreateButton = function () {
        return !$scope.loaded || $scope.serviceLevel === undefined;
    };

    self.loadNetworks();

    var regionsPromise = CloudRegions.getRegions($scope.user, 'NextGen')
        .then(function (regions) {
            $scope.regions = CloudRegions.convert(regions, 'NextGen');

            // Add FirstGen region if available to user
            CloudUsers.catalog({ user: $scope.user }).$promise.then(function (data) {
                var loadFirstGen = _.some(data.endpoints, { name: 'cloudServers' });
                if (loadFirstGen) {
                    $scope.regions.push({
                        label: 'DFW (Dallas)',
                        value: 'DFW',
                        type: 'FirstGen'
                    });
                }
            });

            $scope.serverInfo.region = $scope.regions[0];
            Status.complete();
        })
        .then(self.loadAccount)
        .then($scope.loadRegion)
        .then(self.filterNetworks);

    rxPromiseNotifications.add(regionsPromise, {
        loading: 'Gathering regions, images, and flavors',
        error: 'Error retrieving regions: {{ data.error.message || statusText }}'
    });

});

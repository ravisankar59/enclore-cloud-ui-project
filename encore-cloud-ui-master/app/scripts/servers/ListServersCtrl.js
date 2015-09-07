angular.module('servers')
    .controller('ListServersCtrl', function ($scope, $routeParams, $q, rxStatusMappings, CloudUsers,
        Status, CloudServerLoaders, TableBoilerplate, CloudAllSettled, CloudRegionStatusUpdate,
        FirstGenMigrating, SelectFilter, rxNotify) {

        Status.setScope($scope);

        $scope.user = $routeParams.user;
        $scope.accountNumber = $routeParams.accountNumber;

        $scope.servers = [];
        $scope.actionList = ['createImage', 'attachVolume', 'deleteServer', 'rebootServer'];

        $scope.hasFirstGen = false;

        var nextGenFailedRequests = { failedRequests: [] };
        var firstGenFailedRequests = { failedRequests: [] };

        TableBoilerplate.setup($scope, { predicate: 'name', reverse: false });

        var appendServers = function (servers) {
            // servers is an array, simply pushing to $scope.servers would just push the array.
            $scope.servers.push.apply($scope.servers, servers);
            return servers;
        };

        var setSelected = function (servers) {
            // rowIsSelected is the key we pass to rx-bulk-select to indicate
            // whether a user has clicked the checkbox beside a server
            return _.each(servers, function (server) {
                server.rowIsSelected = false;
            });
        };

        $scope.isServerMigrating = FirstGenMigrating;

        // Map server statuses to one of: ACTIVE INFO WARNING ERROR PENDING
        rxStatusMappings.mapToError(['DELETED', 'UNKNOWN'], 'servers');
        rxStatusMappings.mapToInfo(['RESCUE'], 'servers');
        rxStatusMappings.mapToPending(['HARD_REBOOT', 'BUILD', 'MIGRATING', 'PASSWORD', 'PREP_RESIZE',
                                       'REBOOT', 'REBUILD', 'RESIZE', 'REVERT_RESIZE', 'VERIFY_RESIZE',
                                       'PREP_RESCUE'],
                                      'servers');
        rxStatusMappings.mapToWarning(['SUSPENDED'], 'servers');

        var loadNextGenServers = function () {
            var regionsStatus = CloudRegionStatusUpdate();

            var nextGenMsg = 'Loading NextGen Servers (${regionName})';

            var nextGenPromise = CloudServerLoaders.loadNextGenServers($scope.user,
                                                 nextGenFailedRequests,
                                                 regionsStatus.buildRegionsCallback(nextGenMsg));

            nextGenPromise
                .then(setSelected)
                .then(appendServers);

            nextGenPromise.finally(function () {
                if (nextGenFailedRequests.failedRequests.length > 0) {
                    var error = { message: nextGenFailedRequests.failedRequests.join(', ') };
                    Status.setError('Error loading NextGen servers: ${message}', error);
                }
            });

            regionsStatus.promiseHandler(nextGenPromise);
        };

        var loadFirstGenServers = function () {

            var firstGenMsg = 'Loading FirstGen Servers';

            Status.setLoading(firstGenMsg, { prop: 'loadingFirstGenServers' });

            var firstGenPromise = CloudServerLoaders.loadFirstGenServers($scope.user, firstGenFailedRequests);

            firstGenPromise
                .then(setSelected)
                .then(appendServers)
                .then(function (data) {
                    Status.complete({ prop: 'loadingFirstGenServers' });

                    // This is temporary for 2015 until FirstGen is all gone:  Check for the migration flag
                    $scope.migrating = _.any(data, FirstGenMigrating);
                });

            firstGenPromise.finally(function () {
                if (firstGenFailedRequests.failedRequests.length > 0) {
                    var error = { message: firstGenFailedRequests.failedRequests.join(', ') };
                    Status.setError('Error loading FirstGen servers: ${message}', error);
                }
            });
        };

        // Requests servers for each region available
        // @note we make this function available on the scope so that we can refresh the data manually from the UI
        // @returns null
        $scope.loadServers = function () {
            $scope.servers = [];

            loadNextGenServers();

            // Check if FirstGen servers are available in the user's catalog
            // load them if 'First' is selected in rxSelectFilter, this returns a promise because it's called async
            CloudUsers.catalog({ user: $scope.user }, function (data) {
                $scope.hasFirstGen = _.some(data.endpoints, { name: 'cloudServers' });
                if (!$scope.hasFirstGen) {
                    rxNotify.add('No First Gen Servers In User Catalog', { type: 'info', timeout: 3 });
                } else if (_.contains($scope.genType.selected.gen, 'First')) {
                    loadFirstGenServers();
                }

            });
        };

        $scope.genType = SelectFilter.create({
            properties: ['gen'],
            available: {
                'gen': ['Next', 'First'],
            },
            selected: {
                'gen': ['Next',  'First']
            }
        });

        var unbindWatch = $scope.$watchCollection('genType.selected.gen', function (newest) {
            if (_.contains(newest, 'First')) {
                loadFirstGenServers();
                unbindWatch();
            }
        });

        $scope.loadServers();
    });

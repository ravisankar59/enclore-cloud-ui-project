/**
* @ngdoc controller
* @name ShowInstanceCtrl
* @requires $scope
* @requires $routeParams
* @requires $q
* @requires Status
* @requires TableBoilerplate
* @requires DbaasDatabaseResource
* @requires DbaasInstanceResource
* @requires DbaasRootResource
* @requires DbaasUserResource
*/
angular.module('databases')
    .controller('ShowInstanceCtrl', function ($scope, $routeParams, $q,
        Status, TableBoilerplate, DbaasDatabaseResource, DbaasInstanceResource, DbaasRootResource, DbaasUserResource) {

        TableBoilerplate.setup($scope, { predicate: 'name', reverse: false });

        $scope.loaded = false;
        Status.setScope($scope);

        $scope.page = {};

        $scope.actions = {
            'fullList': ['goToReach', 'restartInstance', 'changeFlavor', 'resizeVolume', 'deleteInstance'],
            'createDatabase': ['createDatabase'],
            'createUser': ['createUser'],
        };

        $scope.user = $routeParams.user;
        $scope.accountNumber = $routeParams.accountNumber;
        $scope.region = $routeParams.region;
        $scope.instanceId = $routeParams.instanceid;
        $scope.failedRequests = [];
        $scope.diskSpacePercent = 0;
        $scope.instance = {};

        $scope.svcParams = {
            user: $scope.user,
            id: $scope.instanceId,
            region: $scope.region
        };

        var loadInstance = function () {
            var deferred = $q.defer();

            var loadInstanceSuccess = function (data) {
                $scope.instance = data.instance;
                deferred.resolve();
            };

            var loadInstanceFailure = function (error) {
                $scope.error = error;
                Status.setError('Error loading Instance Details: ${message}',
                        error, { prop: 'loadingInstance' });
                deferred.reject();
            };

            DbaasInstanceResource.get($scope.svcParams, loadInstanceSuccess, loadInstanceFailure);
            return deferred.promise;
        };

        var loadRootStatus = function () {
            var deferred = $q.defer();

            Status.setLoading('Loading Root Status...', { prop: 'loadingRootStatus' });
            var loadRootStatusSuccess = function (data) {
                $scope.instance.rootEnabled = data.root.rootEnabled ? 'Yes' : 'No';
                Status.complete({ prop: 'loadingRootStatus' });
                deferred.resolve();
            };

            var loadRootStatusFailure = function (error) {
                $scope.error = error;
                Status.setError('Error loading Root Status: ${message}',
                        error, { prop: 'loadingRootStatus' });
                deferred.reject();
            };

            DbaasRootResource.get($scope.svcParams, loadRootStatusSuccess, loadRootStatusFailure);
            return deferred.promise;
        };

        $scope.calcDiskSpace = function () {
            if ($scope.instance.volume.size === 0) {
                $scope.diskSpacePercent = 0;
                return;
            }

            $scope.diskSpacePercent = Math.ceil(
                ($scope.instance.volume.used / $scope.instance.volume.size) * 100) || 0;
        };

        $scope.loadUsers = function () {
            var deferred = $q.defer();

            Status.setLoading('Loading Users...', { prop: 'loadingUsers' });

            var loadUsersSuccess = function (data) {
                $scope.instance.users = data.users;

                _.each($scope.instance.users, function (user) {
                    user.dbArray = _.pluck(user.databases, 'name');
                    user.dbList = user.dbArray.join(', ');
                });
                Status.complete({ prop: 'loadingUsers' });

                deferred.resolve();
            };

            var loadUsersFailure = function (error) {
                $scope.error = error;
                Status.setError('Error loading users: ${message}', error, { prop: 'loadingUsers' });
                deferred.reject();
            };

            DbaasUserResource.get($scope.svcParams, loadUsersSuccess, loadUsersFailure);
            return deferred.promise;
        };

        $scope.loadDatabases = function () {
            var deferred = $q.defer();
            Status.setLoading('Loading Databases...', { prop: 'loadingDatabases' });
            var loadDatabasesSuccess = function (data) {
                $scope.instance.databases = data.databases;
                Status.complete({ prop: 'loadingDatabases' });
                deferred.resolve();
            };

            var loadDatabasesFailure = function (error) {
                $scope.error = error;
                Status.setError('Error loading databases: ${message}', error, { prop: 'loadingDatabases' });
                deferred.reject();
            };

            DbaasDatabaseResource.get($scope.svcParams, loadDatabasesSuccess, loadDatabasesFailure);
            return deferred.promise;
        };

        $scope.loadInstanceDetails = function () {
            Status.setLoading('Loading Instance Details');

            var loadRemainingDetails = function () {
                if ($scope.instance.status === 'BUILD') {

                    var msg = 'The database instance is being provisioned. ' +
                        'Databases and users will appear once the instance is Active.';

                    Status.setWarning(msg);

                } else {
                    // Load remaining details and depending on state of $scope.failedRequests
                    // clear loading message or display errors.
                    $q.all([loadRootStatus(), $scope.loadUsers(), $scope.loadDatabases(), $scope.calcDiskSpace()]).
                        finally(Status.complete);
                }

            };

            // Load instance details before making additional calls
            // if unsuccessful display error and stop
            loadInstance().then(loadRemainingDetails, Status.complete);
        };

        $scope.loadInstanceDetails();

    });

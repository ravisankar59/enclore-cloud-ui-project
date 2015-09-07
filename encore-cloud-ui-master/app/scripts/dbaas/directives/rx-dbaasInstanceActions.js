/**
* @ngdoc directive
* @name rxDbaasInstanceActions
* @requires DbaasFlavorResource
* @requires DbaasInstanceResource
* @requires DbaasDatabaseResource
* @requires DbaasUserResource
* @requires PageSvcPostHook
* @requires $location
* @requires $route
* @requires Status
*/
angular.module('databases')
    .directive('rxDbaasInstanceActions', function (DbaasFlavorResource, DbaasInstanceResource, DbaasDatabaseResource,
                DbaasUserResource, PageSvcPostHook, $location, $route, Status) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                user: '=',
                accountNumber: '=',
                instance: '=',
                status: '=',
                actions: '=',
                database: '=',
                reloadDatabases: '&',
                reloadUsers: '&'
            },
            templateUrl: 'views/dbaas/directives/rx-dbaasInstanceActions.html',
            controller: function ($scope) {

                var defaultSvcParams = {
                    user: $scope.user,
                    id: $scope.instance.id,
                    region: $scope.instance.region
                };

                if (!_.isUndefined($scope.database)) {
                    defaultSvcParams.databasename = $scope.database.name;
                }

                $scope.displayAction = function (actionName) {
                    return _.indexOf($scope.actions, actionName) > -1;
                };

                // Reboot Instance
                $scope.restartInstance = {
                    postHook: new PageSvcPostHook($scope, DbaasInstanceResource.restart, defaultSvcParams, {
                        loading: 'Sending reboot signal...',
                        success: 'Instance rebooting.',
                        fail: 'Error rebooting instance.'
                    })
                };

                $scope.resizeFlavor = {
                    preHook: function (modalScope) {
                        modalScope.isLoading = true;
                        modalScope.fields = {};

                        var populateFlavorData = function (jsonResponse) {
                            // convert response into array [ { key, value} ]
                            modalScope.flavors = _.map(jsonResponse.flavors, function (instance) {
                                var option = {
                                    label: instance.name,
                                    value: instance.id
                                };

                                if (option.value === $scope.instance.flavor.id) {
                                    option.disabled = true;
                                }

                                return option;
                            });

                            modalScope.isLoading = false;
                        };

                        var flavorsFail = function () {
                            // remove loading spinner, error message will show automatically
                            modalScope.isLoading = false;
                        };

                        DbaasFlavorResource.get({
                            user: $scope.user,
                            region: $scope.instance.region
                        }, populateFlavorData, flavorsFail);
                    },
                    postHook: new PageSvcPostHook($scope, DbaasInstanceResource.changeFlavor, defaultSvcParams, {
                        loading: 'Sending resize request...',
                        success: 'Instance is being resized.',
                        fail: 'Error resizing instance.'
                    })
                };

                $scope.resizeVolume = {
                    postHook: new PageSvcPostHook($scope, DbaasInstanceResource.resize, defaultSvcParams, {
                        loading: 'Sending resize volume request...',
                        success: 'Volume is being resized.',
                        fail: 'Error resizing volume.'
                    })
                };

                // Delete Instance
                $scope.deleteInstance = {
                    postHook: new PageSvcPostHook($scope, DbaasInstanceResource.delete, defaultSvcParams, {
                        // KLUDGE: Loading message refuses to disappear in some scenarios
                        // loading: 'Removing database instance...',
                        fail: 'Error deleting instance.'
                    }, function () {
                        Status.setSuccessNext('Instance deleted.');

                        // To fire off routeChange either reload or redirect
                        var path = '/' + $scope.accountNumber + '/' + $scope.user + '/databases/instances';
                        if ($location.path() === path) {
                            $route.reload();
                        } else {
                            $location.path(path);
                        }
                    })
                };

                // Create Database
                $scope.createDatabase = {
                    preHook: function (modalScope) {
                        modalScope.fields = {};
                    },
                    postHook: function (fields) {
                        Status.setLoading('Creating new database');
                        var createSuccess = function () {
                            Status.setSuccessImmediate('Database created.');
                            $scope.reloadDatabases();
                        };

                        var createFailure = function (error) {
                            Status.setError('Error creating database: ${message}', error.data.error);
                        };

                        var db = fields.database;
                        var createData = {
                            'databases': [{}]
                        };

                        /* jshint camelcase: false */
                        createData.databases[0].name = db.name;
                        createData.databases[0].character_set = db.character_set ? db.character_set : 'utf8';
                        createData.databases[0].collate = db.collate ? db.collate : 'utf8_general_ci';

                        DbaasDatabaseResource.save(defaultSvcParams, createData, createSuccess, createFailure);
                    }
                };

                // Create User
                $scope.createUser = {
                    preHook: function (modalScope) {

                        // We need to initialize fields.user.dblist as an arry
                        // to get the rx-option-table checkbox directive
                        // to work properly.

                        modalScope.fields = {
                            user: {
                                host: '%',
                                dbList: []
                            }
                        };

                        modalScope.instance.userColumns = [{
                            label: 'Database',
                            key: 'name'
                        }];

                        var populateDBList = function (jsonResponse) {

                            // Tweak the databases list result from the service call into a kosher format
                            // for data field in rx-option-table directive.

                            var dbList = [];
                            var defaultDbName = defaultSvcParams.databasename;

                            _.forEach(jsonResponse.databases, function (database) {
                                dbList.push({
                                    name: database.name,
                                    value: database.name
                                });
                            });
                            modalScope.instance.dbList = dbList;

                            // If user clicked on "Create User" from the Database table in the DBaaS
                            // instance page, then defaultSvcParams.databasename is the name of the database
                            // that should be prefilled in the Create User form. Again, we have to
                            // massage modalScope.fields.user.dbList to match the format of the encore-ui
                            // checkbox directive.

                            if (defaultDbName !== false) {
                                var dbArray = _.pluck(dbList, 'name');

                                _.forEach(dbArray, function (db) {
                                    modalScope.fields.user.dbList.push(
                                        (db === defaultDbName) ? defaultDbName : false
                                    );
                                });
                            }

                        };

                        var dbLoadFail = function () {
                            // remove loading spinner, error message will show automatically
                            modalScope.isLoading = false;
                        };

                        if ($scope.instance.databases) {
                            populateDBList($scope.instance);
                        } else {
                            DbaasDatabaseResource.get({
                                user: $scope.user,
                                id: $scope.instance.id,
                                region: $scope.instance.region
                            }, populateDBList, dbLoadFail);
                        }

                    },
                    postHook: function (fields) {
                        Status.setLoading('Creating new user');
                        var createSuccess = function () {
                            Status.setSuccessImmediate('User created.');
                            $scope.reloadUsers(); // Reload current view
                        };

                        var createFailure = function (error) {
                            Status.setError('Error creating user: ${message}', error.data.error);
                        };

                        var userFields = fields.user;
                        var createData = { 'users': [{}] };

                        createData.users[0].databases = [];

                        _.forEach(userFields.dbList, function (userDb) {
                            if (userDb !== false) {
                                createData.users[0].databases.push({
                                    'name': userDb
                                });
                            }
                        });

                        createData.users[0].name = userFields.username;
                        createData.users[0].password = userFields.password;
                        createData.users[0].host = userFields.host;

                        DbaasUserResource.save(defaultSvcParams, createData, createSuccess, createFailure);
                    }
                };

            }
        };
    });

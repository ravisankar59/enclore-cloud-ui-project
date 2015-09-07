/**
 * @ngdoc directive
 * @name rxDbaasDatabaseActions
 * @description
 * Actions for working with the table of databases on a given database instance.
 * i.e. Edit/manage/delete
 *
 * user - The user being impersonated
 * instance - The database instance
 * database - One of the actual databases residing in the instance, returned
 *            by Dbaas.getDatabases
 *
 */
angular.module('databases')
.directive('rxDbaasDatabaseActions', function ($q, DbaasDatabaseResource, DbaasDatabaseAccessResource, $route, Status) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            user: '=',
            instance: '=',
            database: '=',
            reloadUsers: '&',
            reloadDatabases: '&'
        },
        templateUrl: 'views/dbaas/directives/rx-dbaasDatabaseActions.html',
        controller: function ($scope) {
            var defaultSvcParams = {
                user: $scope.user,
                id: $scope.instance.id,
                region: $scope.instance.region,
                databasename: $scope.database.name
            };

            $scope.deleteDatabase = {
                postHook: function () {
                    Status.setLoading('Deleting database...');
                    var deleteSuccess = function () {
                        Status.setSuccessImmediate('Database deleted.');
                        $scope.reloadDatabases();
                    };

                    var deleteFailure = function (error) {
                        Status.setError('Error deleting database: ${message}', error);
                    };
                    DbaasDatabaseResource.delete(
                        defaultSvcParams,
                        {},
                        deleteSuccess,
                        deleteFailure);
                }
            };

            $scope.editUsers = {
                preHook: function (modalScope) {
                    modalScope.fields = { database: { userlist: [] }};

                    modalScope.instance.databaseColumns = [{
                        label: 'User',
                        key: 'name'
                    }];

                    var userList = [];
                    var preFill = [];

                    _.forEach(modalScope.instance.users, function (user) {
                        userList.push({
                            name: user.name,
                            value: 'grant',
                            falseValue: 'revoke'
                        });

                        preFill.push(_.contains(user.dbArray, modalScope.database.name) ? 'grant' : 'revoke');
                    });

                    // Available users
                    modalScope.instance.userList = userList;

                    // Pre-fill user access
                    modalScope.fields.database.userlist = preFill;

                    // Pristine copy to check against so we're only
                    // sending the diffs to API
                    modalScope.fields.database.originalList = _.clone(preFill);
                },
                postHook: function (fields) {
                    var users = $scope.instance.userList;
                    var access = fields.database.userlist;
                    var accessData = { databases: [ { name: $scope.database.name } ] };

                    Status.setLoading('Updating users...');

                    var editSuccess = function () {
                        Status.setSuccessImmediate('User access updated.');
                    };

                    var editFailure = function (error) {
                        Status.setError('Error updating user access: ${message}',  error);
                    };

                    var promises = [];

                    _.forEach(users, function (user, index) {
                        // Only send diff to API
                        if (fields.database.originalList[index] !== access[index]) {
                            defaultSvcParams.dbUsername = user.name;
                            if (access[index] === 'grant') {
                                promises.push(DbaasDatabaseAccessResource.update(
                                                _.omit(defaultSvcParams, 'databasename'),
                                                accessData,
                                                editSuccess,
                                                editFailure).$promise);
                            } else {
                                promises.push(DbaasDatabaseAccessResource.delete(
                                                defaultSvcParams,
                                                {},
                                                editSuccess,
                                                editFailure).$promise);
                            }
                        }
                    });

                    $q.all(promises).finally($scope.reloadUsers);
                }
            };
        }
    };

});

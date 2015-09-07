/** 
 * @ngdoc directive
 * @name rxDbaasUserActions
 * @description
 * Actions that can be performed on an individual existing user in a db instance. Currently
 * these will consist of editing, managing access, and deleting a user.
 */
angular.module('databases')
.directive('rxDbaasUserActions', function (DbaasUserResource, $route, Status) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            user: '=',
            instance: '=',
            dbuser: '=',
            reloadUsers: '&'
        },
        templateUrl: 'views/dbaas/directives/rx-dbaasUserActions.html',
        controller: function ($scope) {
            /*
             * A note on working with database users... (I lost *hours* to this, and want to
             * avoid that in the future)
             *
             * The DBaas source APIs that eventually get hit with Database User requests are a bit picky
             * on how things work. There's a lot of implicit knowledge that isn't documented. So let's do that!
             *
             * 1. All DB users have a `host` value. This can either be the wildcard "%", or an actual
             * IP address, like "6.3.6.3". Let's say we have a DB user called "freebird".
             * When you are making API requests specific to this user, the URL
             * for that call requires the DB username.
             *
             * Here's the trick: If the `host` for the dbuser is "%",
             * then simply put the username in URL. i.e. if `host` for "freebird" is set
             * to "%", then the PUT will go to
             * /api/users/hub_cap/dbaas/STAGING/instances/c6cf7cb6-38b1-41ca-936e-01864dc8e0a0/users/freebird
             *
             * However, if the `host` for "freebird" is an IP address, then you need
             * to add an escaped version of "@6.3.6.3" to the username. "@" escaped is "%40". So then a PUT
             * to this user with host 6.3.6.3 would be
             * /api/users/hub_cap/dbaas/STAGING/instances/c6cf7cb6-38b1-41ca-936e-01864dc8e0a0/users/freebird%406.3.6.3
             *
             * Even if you're changing the host or username of "freebird", the username in the URL has to
             * be the username at the time of the request.
             *
             * 2. The JSON body of the PUT requests can have three fields in it for an Edit:
             *  "host", "name" or "password".
             * You can *ONLY* include fields that are actually changing. If the username
             * is "freebird", and you're just changing the password to "abcd", the following *WILL FAIL*
             *
             * { "name": "freebird", "password": "abcd" }
             *
             * It MUST be { "password": "abcd"}
             *
             * This means that before we send the PUT request, we have to look at the fields from
             * the modal, and only send along the ones that are different than the current values
             * for the db user. We don't know the current password, so this means we only
             * send "password" in the JSON body if the user entered some non-empty value
             * in the Password field of the modal.
             *
             * 3. If you're changing the username from "freebird" to "freebird2", and freebird is
             * on host "6.3.6.3", do *NOT* include the "6.3.6.3" component in the JSON body. It
             * needs to be in the PUT URL as described above, but the JSON body would just be
             * { "name": "freebird2" } (i.e. as in #2, only put changed this in the JSON)
             *
             */

            var dbUsername = $scope.dbuser.name;
            if ($scope.dbuser.host !== '%') {
                // %40 is @ escaped.
                dbUsername = dbUsername + '%40' + $scope.dbuser.host;
            }
            var defaultSvcParams = {
                user: $scope.user,
                id: $scope.instance.id,
                region: $scope.instance.region,
                dbUsername: dbUsername
            };

            $scope.deleteUser = {
                postHook: function () {
                    Status.setLoading('Deleting user...');
                    var deleteSuccess = function () {
                        Status.setSuccessImmediate('User deleted.');
                        $scope.reloadUsers();
                    };

                    var deleteFailure = function (error) {
                        Status.setError('Error deleting user: ${message}',  error);
                    };

                    DbaasUserResource.delete(
                        defaultSvcParams,
                        {},
                        deleteSuccess,
                        deleteFailure);

                }

            };

            $scope.editUser = {
                preHook: function (modalScope) {
                    modalScope.fields = {
                        user: {
                            host: modalScope.dbuser.host,
                        },
                        original: {
                            host: modalScope.dbuser.host,
                            name: modalScope.dbuser.name
                        }
                    };
                },
                postHook: function (fields) {
                    Status.setLoading('Editing user...');
                    var editSuccess = function () {
                        Status.setSuccessImmediate('User updated.');
                        $scope.reloadUsers();
                    };

                    var editFailure = function (error) {
                        Status.setError('Error updating user: ${message}',  error);
                    };

                    var originalUsername = fields.original.name;

                    if (fields.user.host.trim() === fields.original.host) {
                        delete fields.user.host;
                    }

                    if (!_.isUndefined(fields.user.name) && fields.user.name.trim() === fields.original.name) {
                        delete fields.user.name;
                    }

                    delete fields.original;

                    if (_.isEmpty(fields.user)) {
                        // They didn't actually change anything. They left the password field
                        // blank and kept the host and username the same. We can't do an API call
                        Status.setStatus('No changes made to ' + originalUsername, { type: 'info' });

                    } else {
                        DbaasUserResource.update(
                            defaultSvcParams,
                            fields.user,
                            editSuccess,
                            editFailure);
                    }
                }
            };

            $scope.manageUserAccess = {
                preHook: function (modalScope) {

                    modalScope.fields = { user: { dblist: [] }};

                    modalScope.instance.userColumns = [{
                        label: 'Database',
                        key: 'name'
                    }];

                    var populateDBList = function (jsonResponse) {

                        // Tweak the databases list result from the service call into a kosher format
                        // for data field in rx-option-table directive.
                        var dbList = [];
                        var preFill = [];
                        var dbArray = _.pluck(modalScope.dbuser.databases, 'name');

                        _.forEach(jsonResponse.databases, function (n) {
                            dbList.push({
                                name: n.name,
                                value: 'grant',
                                falseValue: 'revoke'
                            });

                            // Prefill user access for each database
                            // Example: [ 'grant', 'revoke' ]
                            preFill.push((_.indexOf(dbArray, n.name) > -1) ? 'grant' : 'revoke');
                        });

                        // List out available databases
                        modalScope.instance.dbList = dbList;

                        // Fill the data model with prefilled checkboxes
                        modalScope.fields.user.dblist = preFill;

                        // Load pristine copy to check against so we're only
                        // sending the diffs to API
                        modalScope.fields.user.originalList = _.clone(preFill);
                    };

                    populateDBList($scope.instance);
                },
                postHook: function (fields) {
                    var databases = $scope.instance.dbList;
                    var access = fields.user.dblist;
                    var accessData = { databases: [] };

                    Status.setLoading('Updating user access...');

                    var manageSuccess = function () {
                        Status.setSuccessImmediate('User access updated.');
                        $scope.reloadUsers();
                    };

                    var manageFailure = function (error) {
                        Status.setError('Error updating user access: ${message}',  error);
                    };

                    _.forEach(databases, function (db, index) {
                        // Compare submitted volume to original value
                        if (fields.user.originalList[index] !== fields.user.dblist[index]) {
                            accessData.databases.push({ name: db.name, action: access[index] });
                        }
                    });

                    DbaasUserResource.manageUserAccess(
                        defaultSvcParams,
                        accessData,
                        manageSuccess,
                        manageFailure);
                }
            };
        }
    };
});

angular.module('servers')
    .directive('rxFirstGenActions', function ($location, $route, $window, Status, FirstGenServers, FirstGenActions,
        FirstGenNextGenImage, PageSvcPostHook, FirstGenOpenConsoleUrl, CloudServerActionsDisplay,
        CloudServerActionsDisable, FirstGenMigrating) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                user: '=',
                accountNumber: '=',
                server: '=',
                actions: '=',
                loadServers: '&'
            },
            templateUrl: 'views/servers/templates/server-actions.html',
            controller: function ($scope) {

                var defaultSvcParams = {
                    user: $scope.user,
                    id: $scope.server.id
                };

                $scope.displayAction = CloudServerActionsDisplay($scope);
                $scope.disableAction = CloudServerActionsDisable;

                var reloadOnSuccess = function (msg) {
                    return function () {
                        Status.setSuccessNext(msg);
                        $route.reload();
                    };
                };

                var reloadOnDelete = function (msg) {
                    return function () {
                        var serversPath = '/' + $scope.accountNumber + '/' + $scope.user + '/servers';

                        if ($location.path() === serversPath) {
                            Status.setSuccessImmediate(msg);
                            $scope.loadServers();
                        } else {
                            Status.setSuccessNext(msg);
                            $location.path(serversPath);
                        }
                    };
                };

                $scope.openConsole = function () {
                    var openConsoleWindow = function (data) {
                        var result = $window.open(data.console.url);

                        // Deal with popup blockers
                        if (!result) {
                            var msg = 'Could not open console. Is a popup blocker enabled?';
                            Status.setError(msg);
                        }

                    };

                    var showConsoleErrorMessage = function (error) {
                        Status.setError('Getting console URL failed: ${message}', error);
                    };

                    $scope.console = FirstGenOpenConsoleUrl.getUrl(defaultSvcParams);
                    $scope.console.$promise.then(openConsoleWindow, showConsoleErrorMessage);
                };

                $scope.resizeColumns = [
                    {
                        label: 'Name',
                        key: 'name',
                        selectedLabel: '(Current)'
                    }, {
                        label: 'Disk',
                        key: '{{disk_size}}'
                    }, {
                        label: 'RAM',
                        key: '{{ram}}'
                    }, {
                        label: 'VCUs',
                        key: '{{vcpus}}'
                    }
                ];

                $scope.rebuildColumns = [
                    {
                        label: 'Name',
                        key: 'name',
                        selectedLabel: '(Current)'
                    }, {
                        label: 'Status',
                        key: '{{status}}'
                    }, {
                        label: 'Date',
                        key: '{{created}}'
                    }
                ];

                $scope.serverActions = {
                    preHooks: {
                        // we need to get the different server images in order to populate the form
                        rebuildServer: function (modalScope) {
                            modalScope.isLoading = true;
                            var populateImageData = function (jsonResponse) {
                                var imageList = jsonResponse.images;
                                _.each(imageList, function (image) {
                                    image.value = image.id;
                                });

                                modalScope.images = _.sortBy(imageList, 'name');

                                modalScope.selected = modalScope.server.image.id[0];

                                modalScope.isLoading = false;
                            };

                            var showImageErrorMessage = function () {
                                // remove loading spinner, error message will show automatically
                                modalScope.isLoading = false;
                            };

                            FirstGenServers.getImages({
                                user: defaultSvcParams.user
                            }, populateImageData, showImageErrorMessage);
                        },
                        // we need to get the different server sizes in order to populate the form
                        resizeServer: function (modalScope) {
                            modalScope.isLoading = true;

                            var populateFlavorData = function (jsonResponse) {
                                var flavors = jsonResponse.flavors;

                                _.each(flavors, function (flavor) {
                                    flavor.value = flavor.id;
                                });

                                modalScope.flavors = flavors;
                                // set the selected id so we can disable that option
                                modalScope.selected = modalScope.server.flavor.id;

                                modalScope.isLoading = false;
                            };

                            var flavorsFail = function () {
                                // remove loading spinner, error message will show automatically
                                modalScope.isLoading = false;
                            };

                            FirstGenServers.getFlavors({
                                user: defaultSvcParams.user,
                            }, populateFlavorData, flavorsFail);
                        },
                        rebootServer: function (modalScope) {
                            modalScope.migrating = FirstGenMigrating;
                        }
                    },
                    postHooks: {
                        createImage: new PageSvcPostHook($scope, FirstGenNextGenImage.getImageId, defaultSvcParams, {
                            loading: 'Creating image...',
                            fail: 'Error creating image: {{message}}'
                        }, function (data) {
                            Status.setSuccessImmediate('Creating Next Gen Image: ' + data['image_id']);
                        }),
                        rebootServer: new PageSvcPostHook($scope, FirstGenActions.reboot, defaultSvcParams, {
                            loading: 'Sending reboot signal...',
                            success: 'Server rebooting.',
                            fail: 'Error rebooting server: {{message}}'
                        }),
                        verifyResize: new PageSvcPostHook($scope, FirstGenActions.confirmResize, defaultSvcParams, {
                            loading: 'Verifying resize.',
                            fail: 'Error verifying resize: {{message}}'
                        }, reloadOnSuccess('Resize verified')),
                        revertResize: new PageSvcPostHook($scope, FirstGenActions.revertResize, defaultSvcParams, {
                            loading: 'Sending resize revert signal.',
                            fail: 'Error reverting resize: {{message}}'
                        }, reloadOnSuccess('Resize reverting')),
                        deleteServer: new PageSvcPostHook($scope, FirstGenServers.delete, defaultSvcParams, {
                            loading: 'Sending delete signal.',
                            fail: 'Error deleting server: {{message}}'
                        }, reloadOnDelete('Deleted server.')),
                        changePass: new PageSvcPostHook($scope, FirstGenServers.changePassword, defaultSvcParams, {
                            loading: 'Changing password.',
                            fail: 'Error changing password: {{message}}'
                        }, reloadOnSuccess('Password changed.')),
                        changeName: new PageSvcPostHook($scope, FirstGenServers.changeName, defaultSvcParams, {
                            loading: 'Changing name.',
                            fail: 'Error changing name: {{message}}'
                        }, reloadOnSuccess('Name changed.')),
                        resizeServer: new PageSvcPostHook($scope, FirstGenActions.resize, defaultSvcParams, {
                            loading: 'Sending resizing signal.',
                            fail: 'Error resizing server: {{message}}'
                        }, reloadOnSuccess('Server resizing.')),
                        rebuildServer: new PageSvcPostHook($scope, FirstGenActions.rebuild, defaultSvcParams, {
                            loading: 'Sending rebuild signal.',
                            fail: 'Error rebuilding server: {{message}}'
                        }, reloadOnSuccess('Server rebuilding.')),
                        rescueServer: new PageSvcPostHook($scope, FirstGenActions.rescue, defaultSvcParams, {
                            loading: 'Placing server in rescue mode.',
                            success: 'Successfully placing server into rescue mode.',
                            fail: 'Error rescuing server: {{message}}'
                        }, function (data) {
                            $scope.server = data.server;
                        }),
                        unrescueServer: new PageSvcPostHook($scope, FirstGenActions.unrescue, defaultSvcParams, {
                            loading: 'Taking server out of rescue mode.',
                            fail: 'Error unrescuing server: {{message}}'
                        }, reloadOnSuccess('Successfully unrescuing server.'))
                    }
                };
            }
        };
    });

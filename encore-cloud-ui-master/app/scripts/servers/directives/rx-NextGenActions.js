angular.module('servers')
    .directive('rxNextGenActions', function ($location, $route, $window, Status, NextGenServers, NextGenActions,
        NextGenAttachments, VolumeResource, devicePaths, PageSvcPostHook, CloudServerActionsDisplay,
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
                    id: $scope.server.id,
                    region: $scope.server.region
                };

                var consoleUrl = '/cloud/console.html#/?url=';

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
                        var result = $window.open(consoleUrl + encodeURIComponent(data.console.url));

                        // Deal with popup blockers
                        if (!result) {
                            var msg = 'Could not open console. Is a popup blocker enabled?';
                            Status.setError(msg);
                        }
                    };

                    var showConsoleErrorMessage = function (error) {
                        Status.setError('Getting console URL failed: ${message}', error);
                    };

                    $scope.console = NextGenActions.openConsole(defaultSvcParams);
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

                            NextGenServers.getImages({
                                user: defaultSvcParams.user,
                                region: defaultSvcParams.region
                            }, populateImageData, showImageErrorMessage);
                        },
                        // we need to get the different server sizes in order to populate the form
                        resizeServer: function (modalScope) {
                            modalScope.isLoading = true;

                            var populateFlavorData = function (jsonResponse) {
                                var flavors = jsonResponse.flavors;

                                // remove all 'performance' types, since we can't convert to them
                                flavors = _.remove(flavors, function (flavor) {
                                    return !_.contains(flavor.id, 'performance');
                                });

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

                            NextGenServers.getFlavors({
                                user: defaultSvcParams.user,
                                region: defaultSvcParams.region
                            }, populateFlavorData, flavorsFail);
                        },
                        attachVolume: function (modalScope) {
                            var populateVolumeData = function (jsonResponse) {
                                var volumes = jsonResponse.volumes;

                                // convert response into array [ { key, value} ]
                                modalScope.volumes = _.map(volumes, function (volume) {
                                    var option = {
                                        label: volume['display_name'],
                                        value: volume.id
                                    };

                                    // if volume is already used, disable it as an option and mark it in-use
                                    if (volume.status !== 'available') {
                                        option.disabled = true;
                                        option.label += ' (in-use)';
                                    }

                                    return option;
                                });

                                modalScope.isLoading = false;
                            };

                            var showVolumeErrorMessage = function () {
                                // remove loading spinner, error message will show automatically
                                modalScope.isLoading = false;
                            };

                            // only load servers if they haven't already been loaded
                            // this prevents a duplicate content bug where two sets of form fields appear
                            if (!modalScope.volumes) {

                                modalScope.isLoading = true;

                                modalScope.paths = devicePaths;

                                VolumeResource.get({
                                    user: defaultSvcParams.user,
                                    region: defaultSvcParams.region
                                }, populateVolumeData, showVolumeErrorMessage);
                            }
                        },
                        rebootServer: function (modalScope) {
                            modalScope.migrating = FirstGenMigrating;
                        },
                        passEmptyNickname: function (modalScope) {
                            modalScope.fields = {
                                'nickname': ''
                            };
                        }
                    },
                    postHooks: {
                        createImage: new PageSvcPostHook($scope, NextGenActions.createImage, defaultSvcParams, {
                            loading: 'Creating image...',
                            success: 'Image created successfully.',
                            fail: 'Error creating image: {{message}}'
                        }),
                        attachVolume: new PageSvcPostHook($scope, NextGenAttachments.save, defaultSvcParams, {
                            loading: 'Attaching volume...',
                            success: 'Volume Attached.',
                            fail: 'Error attaching volume: {{message}}'
                        }),
                        rebootServer: new PageSvcPostHook($scope, NextGenActions.reboot, defaultSvcParams, {
                            loading: 'Sending reboot signal...',
                            success: 'Server rebooting.',
                            fail: 'Error rebooting server: {{message}}'
                        }),
                        rescueServer: new PageSvcPostHook($scope, NextGenActions.rescue, defaultSvcParams, {
                            loading: 'Placing server in rescue mode.',
                            fail: 'Error rescuing server: {{message}}'
                        }, reloadOnSuccess('Server now in rescue mode.')),
                        unrescueServer: new PageSvcPostHook($scope, NextGenActions.unrescue, defaultSvcParams, {
                            loading: 'Taking server out of rescue mode.',
                            fail: 'Error unrescuing server: {{message}}'
                        }, reloadOnSuccess('Server back in active mode.')),
                        verifyResize: new PageSvcPostHook($scope, NextGenActions.confirmResize, defaultSvcParams, {
                            loading: 'Verifying resize.',
                            fail: 'Error resizing server: {{message}}'
                        }, reloadOnSuccess('Resize verified')),
                        revertResize: new PageSvcPostHook($scope, NextGenActions.revertResize, defaultSvcParams, {
                            loading: 'Sending resize revert signal.',
                            fail: 'Error reverting resize: {{message}}'
                        }, reloadOnSuccess('Resize reverting')),
                        deleteServer: new PageSvcPostHook($scope, NextGenServers.delete, defaultSvcParams, {
                            loading: 'Sending delete signal.',
                            fail: 'Error deleting server: {{message}}'
                        }, reloadOnDelete('Deleted server.')),
                        changePass: new PageSvcPostHook($scope, NextGenActions.changePass, defaultSvcParams, {
                            loading: 'Changing password.',
                            success: 'Password changed.',
                            fail: 'Error changing password: {{message}}'
                        }),
                        changeName: new PageSvcPostHook($scope, NextGenServers.changeName, defaultSvcParams, {
                            loading: 'Changing name.',
                            fail: 'Error changing name: {{message}}'
                        }, reloadOnSuccess('Name changed.')),
                        changeNickname: new PageSvcPostHook($scope, NextGenActions.changeNickname, defaultSvcParams, {
                            loading: 'Changing nickname.',
                            fail: 'Error changing nickname: {{message}}'
                        }, reloadOnSuccess('Nickname changed.')),
                        resizeServer: new PageSvcPostHook($scope, NextGenActions.resize, defaultSvcParams, {
                            loading: 'Sending resizing signal.',
                            fail: 'Error resizing server: {{message}}'
                        }, reloadOnSuccess('Server resizing.')),
                        rebuildServer: new PageSvcPostHook($scope, NextGenActions.rebuild, defaultSvcParams, {
                            loading: 'Sending rebuild signal.',
                            fail: 'Error rebuilding server: {{message}}'
                        }, reloadOnSuccess('Server rebuilding.'))
                    }
                };
            }
        };
    });

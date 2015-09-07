/*jshint camelcase: false*/
angular.module('servers')
    .controller('ShowFirstGenServerCtrl', function ($scope, $q, $routeParams,
        FirstGenServers, FirstGenBackupSchedule, PageSvcPostHook, FirstGenBackupDropdowns, Status) {

        Status.setScope($scope);
        $scope.server = {
            id: $routeParams.serverId
        };

        $scope.hasMetadata = function (server) {
            return !_.isEmpty(server.metadata);
        };

        var getBackstageUrl = function (region) {
            switch (region) {
                case 'LON':
                    return _.template('https://uk-backstage.slicehost.com/slices/${serverId}',
                    { serverId: $scope.serverId });
                default:
                    return _.template('https://backstage.slicehost.com/slices/${serverId}',
                    { serverId: $scope.serverId });
            }
        };

        $scope.user = $routeParams.user;
        $scope.accountNumber = $routeParams.accountNumber;
        $scope.serverId = $routeParams.serverId;
        $scope.actionList = [
            'createImage', 'changePass', 'changeName', 'rebootServer',
            'rebuildServer', 'resizeServer', 'verifyResize', 'revertResize',
            'rescueServer', 'unrescueServer', 'openConsole', 'deleteServer'
        ];
        $scope.relatedDataTemplates = [
            'views/servers/templates/rd-ip-addresses.html',
            'views/servers/templates/rd-managed-passwords.html',
            'views/servers/templates/rd-metadata.html',
            'views/servers/templates/rd-backup-schedule.html'
        ];

        var defaultSvcParams = {
            user: $scope.user,
            id: $scope.serverId
        };

        var loadBackupSchedule = function () {
            Status.setLoading('Loading Backup Schedule...', { prop: 'loadingBackupSchedule' });

            var backupScheduleSuccess = function (backupSchedule) {
                Status.complete({ prop: 'loadingBackupSchedule' });
                $scope.backupSchedule = backupSchedule;
            };

            var backupScheduleFailure = function (error) {
                Status.setError('Error loading backup schedule: ${message}', error, { prop: 'loadingBackupSchedule' });
            };

            FirstGenBackupSchedule.getBackupSchedule(defaultSvcParams, backupScheduleSuccess, backupScheduleFailure);
        };

        var loadServerDetails = function () {
            var deferred = $q.defer();

            Status.setLoading('Loading Server Details');

            var serverDetailSuccess = function (data) {
                Status.complete();
                $scope.server = data.server;
                $scope.server.gen = 'First';
                deferred.resolve();
                $scope.backstage = getBackstageUrl($scope.server.region);
            };

            var serverDetailFailure = function (error) {
                Status.setError('Error loading server details: ${message}', error);
                deferred.reject();
            };

            FirstGenServers.get(defaultSvcParams, serverDetailSuccess, serverDetailFailure);
            return deferred.promise;
        };

        $scope.loadServer = function () {
            loadServerDetails().then(loadBackupSchedule).finally(function () {
            });
        };

        $scope.loadServer();

        $scope.backupScheduleActions = {
            preHooks: {
                // we need to get the different server images in order to populate the form
                updateBackupSchedule: function (modalScope) {
                    modalScope.isLoading = true;

                    modalScope.fields.daily = $scope.backupSchedule.daily;
                    modalScope.fields.weekly = $scope.backupSchedule.weekly;

                    /* The `enabled` field is required by the API at
                     * http://docs-internal.rackspace.com/servers/api/v1.0/cs-devguide-1/content/Create_Update_Backup_Schedule-d1e4935.html
                     * but its value is ignored by the API... It doesn't matter whether we set it to
                     * `true` or `false`, the API will always return `true` for this given backup_schedule,
                     * unless you do the DELETE method on it, at which point it will go to `false`
                     */
                    modalScope.fields.enabled = true;
                    var dropdowns = FirstGenBackupDropdowns.dropdowns();
                    modalScope.days = dropdowns.days;
                    modalScope.hours = dropdowns.hours;

                    modalScope.isLoading = false;
                }
            },
            postHooks: {
                deleteBackupSchedule: new PageSvcPostHook($scope, FirstGenBackupSchedule.deleteBackupSchedule,
                defaultSvcParams, {
                    loading: 'Sending disable signal.',
                    success: 'Disabled backup schedule.',
                    fail: 'Error disabling backup schedule: {{message}}'
                }, function () {
                    loadBackupSchedule();
                }),
                updateBackupSchedule: new PageSvcPostHook($scope, FirstGenBackupSchedule.saveBackupSchedule,
                defaultSvcParams, {
                    loading: 'Updating...',
                    success: 'Updated backup schedule.',
                    fail: 'Error updating backup schedule: {{message}}'
                }, function () {
                    loadBackupSchedule();
                })
            }
        };

    });

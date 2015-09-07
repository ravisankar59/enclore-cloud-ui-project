/**
* @ngdoc directive
* @name backup.rxBackup
* @requires $routeParams
* @requires backup.BackupUtil
* @requires rxNotify
* @requires GetAccountRegion
* @requires CloudUsers
* @requires $sce
* @description
* redirects users to the Cloud Backup Page. 
*/
angular.module('backup')
    .directive('rxBackup', function ($routeParams, BackupUtil, GetAccountRegion, CloudUsers, $sce, rxNotify) {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'views/templates/rx-backup.html',
            scope: {},
            link: function (scope, element) {

                var form = element.find('form');
                var formEl = form[0];
                var rackTokenInput = form.find('input').eq(1);
                var getToken = new CloudUsers().$reach({ user: $routeParams.user });
                var region = GetAccountRegion($routeParams.accountNumber);
                var backupUrl = BackupUtil.getUrl(region);

                getToken.then(function (result) {
                    rackTokenInput.val(result.token);
                    form.attr('action', $sce.trustAsResourceUrl(backupUrl));
                    formEl.submit();
                }).catch(function (error) {
                    if (error.status === 404) {
                        rxNotify.add('Could not retrieve impersonation token: Not Found', {
                            type: 'error'
                        });
                    } else if (error.status === 500) {
                        rxNotify.add('Unexpected Error has Occurred unable to retrieve impersonation token', {
                            type: 'error'
                        });
                    }
                });
                
                scope.user = $routeParams.user;
                scope.accountNumber = $routeParams.accountNumber;
            }
        };
    });
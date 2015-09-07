angular.module('backup')
    /**
    * @ngdoc controller
    * @name backup.showBackupCtrl
    * @requires $scope
    * @requires $routeParams
    * @description:
    * Attaches the $routeParams user/account number to the scope elements
    * of similar names
    */
    .controller('ShowBackupCtrl', function ($scope, $routeParams) {
        $scope.user = $routeParams.user;
        $scope.accountNumber = $routeParams.accountNumber;
    });
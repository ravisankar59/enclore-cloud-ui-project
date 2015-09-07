/**
* @ngdoc controller
* @name ShowHeatCtrl
* @requires $scope
* @requires $routeParams
*/
angular.module('heat')
    .controller('ShowHeatCtrl', function ($scope, $routeParams) {
        $scope.user = $routeParams.user;
        $scope.accountNumber = $routeParams.accountNumber;
    });

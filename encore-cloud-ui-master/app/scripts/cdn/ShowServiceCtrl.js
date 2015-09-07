/**
* @ngdoc controller
* @name ShowServiceCtrl
* @requires $scope
* @requires $routeParams
* @requires CDNService
* @requires CDNStatus
* @requires Status
*/
angular.module('cdn')
.controller('ShowServiceCtrl',
    function ($scope, $routeParams, CDNService, CDNStatus, Status) {

    var self = this;
    $scope.service = {};
    $scope.featureStatus = CDNStatus;
    Status.setScope($scope);

    self.loadServiceSuccess = function (data) {
        $scope.service = data;
        Status.complete();
    };//loadServiceSuccess

    self.loadServiceFailure = function (response) {
        var msg = 'unknown error';
        if (response.error && response.error.message) {
            msg = response.error.message;
        }
        $scope.service = {};
        Status.setError('Error loading CDN Service: ' + msg);
    };//loadServiceFailure

    $scope.hasRules = function (obj) {
        return (obj.rules && obj.rules.length > 0 ? true : false);
    };

    $scope.loadService = function () {
        Status.setLoading('Loading CDN Service');
        CDNService.get({
            accountId: $routeParams.accountNumber,
            serviceId: $routeParams.serviceId,
            user: $routeParams.user
        }, self.loadServiceSuccess, self.loadServiceFailure);
    };//loadService

    $scope.loadService();
});

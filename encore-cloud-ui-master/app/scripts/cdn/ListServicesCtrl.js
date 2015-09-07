/**
* @ngdoc controller
* @name ListServiceCtrl
* @requires $scope
* @requires $routeParams
* @requires rxStatusMappings
* @requires CDNService
* @requires CDNStatus
* @requires TableBoilerplate
* @requires Status
*/
angular.module('cdn')
.controller('ListServicesCtrl', function ($scope, $routeParams, rxStatusMappings,
    CDNService, CDNStatus, TableBoilerplate, Status) {

    var self = this;
    rxStatusMappings.mapToActive('deployed', 'cdn');
    rxStatusMappings.mapToPending(['update_in_progress', 'delete_in_progress', 'create_in_progress'], 'cdn');
    rxStatusMappings.mapToError('failed', 'cdn');

    // set up column sorting (none for now)
    TableBoilerplate.setup($scope, { predicate: 'name', reverse: false });
    Status.setScope($scope);

    $scope.user = $routeParams.user;
    $scope.services = [];
    $scope.featureStatus = CDNStatus;

    $scope.truncateTooltipAfter = 2;

    self.loadServicesSuccess = function (data) {
        $scope.services = data;
        Status.complete();
    };//loadServicesSuccess

    self.loadServicesFailure = function (response) {
        // var msg;
        // error code 404 is handled differently on encore-ui-svcs
        // and returns an empty array. this is done so in the event
        // that a requested account does not have CDN enabled
        // see CDNServiceTransforms on encore-ui-svcs
        var msg = 'unknown error'; // default
        var errorObj;
        if (response.data[0]) { errorObj = response.data[0].error; }

        if (response.status === 404) {
            msg = response.statusText;
        } else if (errorObj.code) {
            if (errorObj.message) { // if error message, display it
                msg = errorObj.message;
            } else if (errorObj.type) { // if no error message, display type
                msg = errorObj.type;
            }
        }

        $scope.services = [];
        Status.setError('Error loading CDN Services: ' + msg);
    };//loadServicesFailure

    $scope.tooltipFor = function (arr, key) {
        var out = '';
        if (arr.length > $scope.truncateTooltipAfter) {
            out = arr
                .slice($scope.truncateTooltipAfter)
                .map(function (item) { return '<div>' + item[key] + '</div>'; })
                .join('');
        }
        return out;
    };//tooltipFor()

    $scope.hasServices = function () {
        return !_.isEmpty($scope.services);
    };

    $scope.loadServices = function () {
        Status.setLoading('Loading CDN Services');
        CDNService.list({
            accountId: $routeParams.accountNumber,
            user: $routeParams.user
        }, self.loadServicesSuccess, self.loadServicesFailure);
    };//loadServices

    $scope.loadServices();
});

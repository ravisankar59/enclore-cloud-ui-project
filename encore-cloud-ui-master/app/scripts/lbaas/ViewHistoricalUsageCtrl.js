/**
* @ngdoc controller
* @name loabalancers.ViewHistoricalUsageCtrl
* @requires $scope
* @requires $routeParams
* @requires Lbaas
* @requires Status
* @requires TableBoilerplate
* @requires rxStatusMappings
* @requires $filter
*/
angular.module('loadbalancers')
	.controller('ViewHistoricalUsageCtrl', function ($scope, $routeParams,
                Lbaas, Status, TableBoilerplate, rxStatusMappings, $filter) {
        
    TableBoilerplate.setup($scope, { predicate: 'id', reverse: false });

    Status.setScope($scope);

    rxStatusMappings.mapToActive('ONLINE');
    rxStatusMappings.mapToError('OFFLINE');

    var svcParams = {
        user: $routeParams.user,
        id: $routeParams.loadbalancerid,
        region: $routeParams.region
    };
    var historyProp = 'retrievinghistoricalusage';
    var lbProp = 'retrievingloadbalancer';

    var historyMessage = 'Retrieving Historical Usage';
    var lbMessage = 'Retrieving Load Balancer';

    /**
     * @ngdoc function
     * @name encore.cloud.ui.ViewHistoricalUsageCtrl
     * @requires No Parameters
     * @description
     *
     * When page initializes this private method call retrieves the load balancer object to be used
     * to display name and id. On success of this method it invokes the loadHistoricalUsage
     * private method.
     */
    var getLoadBalancer = function () {
        Status.setLoading(lbMessage, { prop: historyProp });

        var success = function (response) {
            $scope.loadBalancer = response.loadBalancer;
            Status.complete({ prop: lbProp });
            Status.setSuccessImmediate(lbMessage + ' is complete for id: ' + $scope.loadBalancer.id);
            loadHistoricalUsage();
        };

        var failure = function (error) {
            Status.complete({ prop: lbProp });
            Status.setError('Error ' + lbMessage + ': ' + error.status + ' - ' + error.statusText);
        };

        var resource = Lbaas.getLoadBalancer(svcParams, success, failure);
        return resource.$promise;
    };

    /**
     * @ngdoc function
     * @name encore.cloud.ui.ViewHistoricalUsageCtrl
     * @requires No Parameters
     * @description
     *
     * This method call is to retrieve the load balancer historical usage data using the /usage
     * API call. start_time and end_time are the two query string parameters with default to
     * difference of 8 and 1 days prior to current date respectively.
     */
	var loadHistoricalUsage = function () {
        Status.setLoading(historyMessage, { prop: historyProp });

        svcParams['start_time'] = encodeURIComponent($filter('date')(moment().
            subtract(8, 'days').toDate(), 'dd MMM yyyy'));

        svcParams['end_time'] = encodeURIComponent($filter('date')(moment().
            subtract(1, 'days').toDate(), 'dd MMM yyyy'));

        var success = function (response) {
            $scope.historicalUsages = response['load_balancer_usage_records'];
            Status.complete({ prop: historyProp });
            Status.setSuccessImmediate(historyMessage + ' is complete for Load Balancer');
        };

        var failure = function (error) {
            Status.complete({ prop: historyProp });
            Status.setError('Error ' + historyMessage + ': ' + error.status + ' - ' + error.statusText);
        };

        var resource = Lbaas.getHistoricalUsage(svcParams, success, failure);
        return resource.$promise;
    };

    getLoadBalancer();
});

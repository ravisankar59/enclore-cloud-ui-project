/**
 * @ngdoc controller
 * @name loadbalancers.UnSuspendLoadBalancerModalCtrl
 * @requires $scope
 * @requires $timeout
 * @requires rxNotify
 * @requires $modalInstance
 * @requires LbaasPermissions
 * @requires LOAD_BALANCER_ROLES
 * @requires $routeParams
 * @requires Status
 * @requires Lbaas
 * @description
 * A Separate controller that handles the functionality for Unsuspend modal behaviour. The relevant template
 * uses the MultiView encore-ui directive to support multiple modal views. Controller has $scope methods to
 * navigate to various views using the setState method. setState method shows unsuspend page when user has 
 * valid permission, otherwise it shows non-permiited page when user has invalid permission.
 */
angular.module('loadbalancers')
	.controller('UnSuspendLoadBalancerModalCtrl', function ($scope, $timeout, rxNotify, $modalInstance,
		LbaasPermissions, LOAD_BALANCER_ROLES, $routeParams, Status, Lbaas) {

        var unSuspendMsg = 'Unsuspending Load Balancer';
        var unSuspendProp = 'unsuspendloadbalancer';

        Status.setScope($scope);
        var svcParams = {
            user: $routeParams.user,
            id: $routeParams.loadbalancerid,
            region: $routeParams.region
        };

        /**
         * @ngdoc function
         * @name encore.cloud.ui.UnSuspendLoadBalancerModalCtrl
         * @requires No Parameters
         * @description
         *
         * When user clicks on Unsuspend load balancer on first modal, this method uses the Permission
         * service to identify if user has rights to access this functionality. If user do not have
         * permission, then user will be displayed do not have permission modal. If user falla into correct
         * group, then user will be allowed to unsuspend load balancer.
         */
        $scope.submit = function () {
			if (LbaasPermissions.hasAccess(LOAD_BALANCER_ROLES.unsuspend)) {
				$scope.setState('hasPermission');
			} else
			{
				$scope.setState('doNotHavePermission');
			}
        };

        /**
         * @ngdoc function
         * @name encore.cloud.ui.UnSuspendLoadBalancerModalCtrl
         * @requires No Parameters
         * @description
         *
         * When user actually unsuspending load balancer DELETE API call happens to unsuspend
         * the suspended load balancer. Status will again become Active on successful call.
         */
        $scope.unSuspendLoadBalancer = function () {
            Status.setLoading(unSuspendMsg, { prop: unSuspendProp });

            var success = function () {
                $scope.loadBalancer.status = 'ACTIVE';
                Status.complete({ prop: unSuspendProp });
                Status.setSuccessImmediate(unSuspendMsg + ' is complete for id: ' + $scope.loadBalancer.id);
            };

            var failure = function (error) {
                Status.complete({ prop: unSuspendProp });

                if (error.status === 404) {
                    Status.setError('Error in locating resource: ' + error.statusText);
                } else if (error.status === 500) {
                    Status.setError('Error in Unsuspending Load Balancer - ' + error.statusText);
                } else {
                    Status.setError('Unexpected error occurred ' + error.statusText);
                }
            };

            Lbaas.unSuspendLoadBalancer(svcParams, success, failure).$promise;

            $scope.cancel();

        };

        $scope.cancel = function () {
            rxNotify.clear('modal');
            $modalInstance.dismiss();
        };
	});
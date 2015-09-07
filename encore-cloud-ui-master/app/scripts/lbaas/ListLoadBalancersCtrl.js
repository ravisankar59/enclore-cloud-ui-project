/**
* @ngdoc controller
* @name loadbalancers.ListLoadBalancersCtrl
* @requires $scope
* @requires $routeParams
* @requires $q
* @requires TableBoilerplate
* @requires CloudRegionsUtil
* @requires Lbaas
* @requires Status
* @requires rxPromiseNotifications
* @requires rxStatusMappings
* @requires  SelectFilter
*/
angular.module('loadbalancers')
    .controller('ListLoadBalancersCtrl', function ($scope, $routeParams, $q, TableBoilerplate,
                                               CloudRegionsUtil, Lbaas, Status, rxPromiseNotifications,
                                               rxStatusMappings, SelectFilter) {

        Status.setScope($scope);

        $scope.user = $routeParams.user;
        $scope.accountNumber = $routeParams.accountNumber;

        $scope.loadBalancers = [];

        rxStatusMappings.mapToInfo('BUILD', 'loadBalancers');
        rxStatusMappings.mapToWarning(['SUSPENDED'], 'loadBalancers');
        rxStatusMappings.mapToPending(['PENDING_UPDATE', 'PENDING_DELETE'], 'loadBalancers');
        rxStatusMappings.mapToError(['DELETED'], 'loadBalancers');

        // set up column sorting
        TableBoilerplate.setup($scope, { predicate: 'name', reverse: false });

        // config data for loadInstances
        var config = {
            svc: Lbaas.getLoadBalancers,
            name: 'LoadBalancers',
            scopeProp: 'loadBalancers',
            user: $scope.user,
            params: {}
        };

        var areDeletedLoadBalancersLoaded = false;

        var loadBalancerSvcParams = function (loadBalancer) {
            return {
                user: $scope.user,
                id: loadBalancer.id,
                region: loadBalancer.region
            };
        };
        /* jshint ignore:start */
        $scope.ipAddressTooltip = function (ipAddressTooltip) {
            var tooltip = '';
            _.each(ipAddressTooltip, function (ip) {
                tooltip += ip.version + ':' + ip.ip_address + '\n';
            });
            return tooltip;
        };
        /* jshint ignore:end */
        $scope.deleteLoadBalancer = function (loadBalancer) {
            Status.setLoading('Deleting Load Balancer ' + loadBalancer.name);

            var svcParams = loadBalancerSvcParams(loadBalancer);

            var deleteLoadBalancerSuccess = function () {
                /* jshint maxlen: false */
                Status.setSuccessImmediate('Load Balancer "' + loadBalancer.name + '" delete successfully initiated. It will take a few moments to complete.');
                fetchLoadBalancers();
            };

            var deleteLoadBalancerFailure = function (error) {
                /* jshint maxlen: false */
                error.loadBalancerName = loadBalancer.name;
                Status.setError('Error deleting Load Balancer ${loadBalancerName}: ${message}', error);
            };

            Lbaas.delete(svcParams, deleteLoadBalancerSuccess, deleteLoadBalancerFailure);
        };

        // Requests instances for each region available
        var fetchLoadBalancers = function (deleted) {
            config.params.status =  deleted ? 'DELETED' : null;

            var promise = CloudRegionsUtil.loadDataForEachRegion(config);

            Status.setLoading('Loading Load Balancers');

            promise.then(function clearStatusMsg (loadBalancers) {
                // if all calls succeed, remove page status
                if (!deleted) {
                    $scope.loadBalancers = loadBalancers;
                }
                Status.complete();
            }, function handleRegionsFailure (failedRegions) {
                // show error message if any fail
                if (deleted) {
                    areDeletedLoadBalancersLoaded = false;
                }
                Status.setError('Error loading Load Balancers for: ' + failedRegions.join(', '));
            }, function updatePageData (loadBalancers) {
                // update page data as data is returned
                $scope.loadBalancers = $scope.loadBalancers.concat(loadBalancers);
            });
        };

        fetchLoadBalancers();

        // Request details for cog actions
        $scope.fetchLoadBalancerActions = function (loadBalancer) {

            $scope.fetchSpinner = true;
            $scope.intialLogging = true;

            var fetchLoadBalancerActionsSuccess = function () {
                $scope.fetchSpinner = false;
                $scope.intialLogging = false;
            };

            var fetchLoadBalancerActionsFailure = function () {
                $scope.fetchSpinner = false;
            };

            loadConnectionLogging(loadBalancer,
                                  fetchLoadBalancerActionsSuccess,
                                  fetchLoadBalancerActionsFailure);

            loadContentCaching(loadBalancer,
                                  fetchLoadBalancerActionsSuccess,
                                  fetchLoadBalancerActionsFailure);

            loadConnectionThrottle(loadBalancer,
                                   fetchLoadBalancerActionsSuccess,
                                   fetchLoadBalancerActionsFailure);

            loadHealthMonitor(loadBalancer,
                                   fetchLoadBalancerActionsSuccess,
                                   fetchLoadBalancerActionsFailure);
        };

        // Enable or Disable log connection for a load balancer
        $scope.toggleLogConnection = function (loadBalancer) {

            var svcParams = loadBalancerSvcParams(loadBalancer);
            var toggleSwitch = { 'enabled': !$scope.logConnections };

            var toggleLoadBalancerActionsSuccess = function () {
                var logConnectionStatus = $scope.logConnections ? 'disabled' : 'enabled';

                Status.setSuccessImmediate('Logging ' + logConnectionStatus + ' for "' + loadBalancer.name + '" ' +
                         '(#' + loadBalancer.id + ')');
            };

            var toggleLoadBalancerActionsFailure = function (error) {
                Status.setError('Error in changing Load Balancer Logging for ' +
                    loadBalancer.name + ' ' + error);
            };

            Lbaas.updateLogConnections(svcParams, toggleSwitch, toggleLoadBalancerActionsSuccess,
                toggleLoadBalancerActionsFailure);
        };

        $scope.toggleContentCaching = function (loadBalancer) {

            var svcParams = loadBalancerSvcParams(loadBalancer);
            var toggleSwitch = { 'enabled': !$scope.contentCaching };

            var toggleLoadBalancerActionsSuccess = function () {
                var contentCachingStatus = $scope.contentCaching ? 'disabled' : 'enabled';

                Status.setSuccessImmediate('Content Caching ' + contentCachingStatus + ' for "' +
                     loadBalancer.name + '" ' + '(#' + loadBalancer.id + ')');
            };

            var toggleLoadBalancerActionsFailure = function (error) {
                Status.setError('Error in changing Load Balancer Content Caching for ' +
                    loadBalancer.name + ' ' + error);
            };

            Lbaas.updateContentCaching(svcParams, toggleSwitch, toggleLoadBalancerActionsSuccess,
                toggleLoadBalancerActionsFailure);
        };

        $scope.updateConnectionThrottle = {

            preHook: function (modalScope, balancer) {
                modalScope.loadBalancer = balancer;
                modalScope.fields = {
                    maxConnections: $scope.connectionThrottle.maxConnections
                };
            },

            postHook: function (loadBalancer, fields) {
                Status.setLoading('Updating Connection Throttle for ' + loadBalancer.name);

                var connectionThrottle = {
                    maxConnections: parseInt(fields.maxConnections),
                    // Default values required to create configuration.
                    // They have no effect on the loadBalancer.
                    minConnections: 1,
                    maxConnectionRate: 1,
                    rateInterval: 1
                };
                updateConnectionThrottle(loadBalancer, connectionThrottle);
            }
        };

        $scope.disableConnectionThrottle = {

            preHook: function (modalScope, balancer) {
                modalScope.loadBalancer = balancer;
            },

            postHook: function (loadBalancer) {
                Status.setLoading('Removing Connection Throttle for ' + loadBalancer.name);
                disableConnectionThrottle(loadBalancer);
            }
        };

        var loadConnectionLogging = function (loadBalancer, fetchActionsSuccess, fetchActionsFailure) {

            var svcParams = loadBalancerSvcParams(loadBalancer);

            var success = function (data) {
                $scope.logConnections = data.connectionLogging.enabled;
                fetchActionsSuccess();
            };

            var failure = function (error) {
                Status.setError('Error loading Load Balancer Logging Connections for ' +
                    loadBalancer.name + ' ' + error.message);
                fetchActionsFailure();
            };

            Lbaas.getLogConnections(svcParams, success, failure);
        };

        var loadContentCaching = function (loadBalancer, fetchActionsSuccess, fetchActionsFailure) {

            var svcParams = loadBalancerSvcParams(loadBalancer);

            var success = function (data) {
                $scope.contentCaching = data.contentCaching.enabled;
                fetchActionsSuccess();
            };

            var failure = function (error) {
                Status.setError('Error loading Load Balancer Content Caching for ' +
                    loadBalancer.name + ' ' + error.message);
                fetchActionsFailure();
            };

            Lbaas.getContentCaching(svcParams, success, failure);
        };

        var loadConnectionThrottle = function (loadBalancer, fetchActionsSuccess, fetchActionsFailure) {

            var svcParams = loadBalancerSvcParams(loadBalancer);

            var success = function (data) {
                $scope.connectionThrottle = data.connectionThrottle;
                fetchActionsSuccess();
            };

            var failure = function (error) {
                Status.setError('Error loading Connection Throttling for ' +
                    loadBalancer.name + ' ' + error.message);
                fetchActionsFailure();
            };

            Lbaas.getConnectionThrottle(svcParams, success, failure);
        };

        var updateConnectionThrottle = function (loadBalancer, connectionThrottle) {

            var svcParams = loadBalancerSvcParams(loadBalancer);

            var success = function (data) {
                Status.setSuccessImmediate('Enabled Connection Throttle for ' + loadBalancer.name +
                         ' (#' + loadBalancer.id + ')');

                $scope.connectionThrottle = data.connectionThrottle;
            };

            var failure = function (error) {
                Status.setError('Error updating Connection Throttling for ' +
                    loadBalancer.name + ' ' + error.message);
            };

            Lbaas.addUpdateConnectionThrottle(svcParams, connectionThrottle, success, failure);
        };

        var disableConnectionThrottle = function (loadBalancer) {

            var svcParams = loadBalancerSvcParams(loadBalancer);

            var success = function () {
                Status.setSuccessImmediate('Disabled Connection Throttle for ' + loadBalancer.name +
                         ' (#' + loadBalancer.id + ')');
                $scope.connectionThrottle = {};
            };

            var failure = function (error) {
                Status.setError('Error disabling Connection Throttling for ' +
                    loadBalancer.name + ' ' + error.message);
            };

            Lbaas.disableConnectionThrottle(svcParams, success, failure);
        };

        var loadHealthMonitor = function (loadBalancer, fetchActionsSuccess, fetchActionsFailure) {

            var svcParams = loadBalancerSvcParams(loadBalancer);

            var success = function (data) {
                $scope.healthMonitor = data.healthMonitor;
                fetchActionsSuccess();
            };

            var failure = function (error) {
                Status.setError('Error loading Health Monitor for ' +
                    loadBalancer.name + ' ' + error.message);
                fetchActionsFailure();
            };

            Lbaas.getHealthMonitor(svcParams, success, failure);
        };

        var updateHealthMonitor = function (loadBalancer, healthMonitor) {

            var svcParams = loadBalancerSvcParams(loadBalancer);

            $scope.updateHealthMonitorPromise = Lbaas.updateHealthMonitor(svcParams, healthMonitor);

            rxPromiseNotifications.add($scope.updateHealthMonitorPromise.$promise, {
                loading: 'Enabling Health Monitoring for ' + loadBalancer.name + ' (#' + loadBalancer.id + ')',
                success: 'Health monitoring updated.',
                error: 'Error updating Health Monitoring for {{loadBalancer.name}} {{error.message}}'
            });
        };

        $scope.updateHealthMonitor = {

            preHook: function (modalScope, balancer) {
                modalScope.loadBalancer = balancer;
            },

            postHook: function (loadBalancer, fields) {
                updateHealthMonitor(loadBalancer, fields);
            }
        };

        var disableHealthMonitor = function (loadBalancer) {

            var svcParams = loadBalancerSvcParams(loadBalancer);

            var success = function () {
                Status.setSuccessImmediate('Disabled Health Monitoring for ' + loadBalancer.name +
                         ' (#' + loadBalancer.id + ')');
                $scope.healthMonitor = {};
            };

            var failure = function (error) {
                Status.setError('Error disabling Health Monitoring for ' +
                    loadBalancer.name + ' ' + error.message);
            };

            Lbaas.disableHealthMonitor(svcParams, success, failure);
        };

        $scope.disableHealthMonitor = {

            preHook: function (modalScope, balancer) {
                modalScope.loadBalancer = balancer;
            },

            postHook: function (loadBalancer) {
                Status.setLoading('Disabling Health Monitor for ' + loadBalancer.name);
                disableHealthMonitor(loadBalancer);
            }
        };

        //set up status filtering
        $scope.statuses = SelectFilter.create({
            properties: ['status'],
            available: {
                status: ['ACTIVE', 'BUILD', 'PENDING_UPDATE', 'PENDING_DELETE', 'SUSPENDED', 'ERROR', 'DELETED'],
            },
            selected: {
                status:['ACTIVE', 'BUILD', 'PENDING_UPDATE', 'PENDING_DELETE', 'SUSPENDED', 'ERROR'],
            }
        });

        $scope.$watchCollection('statuses.selected.status', function (newest) {
            if (_.contains(newest, 'DELETED') && !areDeletedLoadBalancersLoaded){
                fetchLoadBalancers(true);
                areDeletedLoadBalancersLoaded = true;
            }
        });
    });

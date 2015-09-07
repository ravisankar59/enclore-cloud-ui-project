/**
* @ngdoc controller
* @name loadbalancers.ShowLoadBalancerCtrl
* @requires $scope
* @requires $routeParams
* @requires $q
* @requires $interval
* @requires $location
* @requires Lbaas
* @requires Status
* @requires CloudServerLoaders
* @requires TableBoilerplate
* @requires PageSvcPostHook
* @requires rxPromiseNotifications
* @requires rxStatusMappings
* @requires LOAD_BALANCER_VIP_TYPES
* @requires LOAD_BALANCER_ADD_VIP_ROLES
* @requires TOGGLE_SWITCH
* @requires ERROR_PAGE_CONTENT
* @requires LbaasNodeService
* @requires CLOUD_URL
* @requires ALGORITHMS
* @requires LOAD_BALANCER_ROLES
* @requires LbaasCloudServerService
* @requires PERSISTENCE_TYPE
*/
angular.module('loadbalancers')
    .controller('ShowLoadBalancerCtrl', function ($scope, $routeParams, $q, $interval, $location,
                Lbaas, Status, CloudServerLoaders, TableBoilerplate, PageSvcPostHook, rxPromiseNotifications,
                rxStatusMappings, LOAD_BALANCER_VIP_TYPES, LOAD_BALANCER_ADD_VIP_ROLES, TOGGLE_SWITCH,
                ERROR_PAGE_CONTENT, LbaasNodeService, CLOUD_URL, ALGORITHMS, LOAD_BALANCER_ROLES,
                LbaasCloudServerService, PERSISTENCE_TYPE, LBAAS_CONSTANTS) {

        TableBoilerplate.setup($scope, { predicate: 'condition', reverse: false });

        Status.setScope($scope);

        rxStatusMappings.mapToActive('ONLINE');
        rxStatusMappings.mapToError('OFFLINE');

        var svcParams = {
            user: $routeParams.user,
            id: $routeParams.loadbalancerid,
            region: $routeParams.region
        };

        var failedRequestMapping = {
            'details': 'Details',
            'errorPage': 'Error Page',
            'sslTermination': 'SSL Termination',
            'healthMonitor': 'Health Monitor',
            'accessList': 'Access List',
            'connectionThrottle': 'Connection Throttle',
            'firstGenServers': 'FirstGen Servers',
            'admin_virtualips': 'Virtual Ips',
            'externalNodes': 'External Nodes'
        };

        $scope.historicalUsageUrl = CLOUD_URL.loadbalancers + '/' + svcParams.region +
            '/' + svcParams.id + '/historicalusage';

        $scope.vipTypes = LOAD_BALANCER_VIP_TYPES;
        $scope.roles = LOAD_BALANCER_ADD_VIP_ROLES.join();
        $scope.nodeRole = LOAD_BALANCER_ROLES.removeNode.join();

        $scope.page = {};

        $scope.cloudServerInfo = { servers: [], ipMapping: {}};
        $scope.failedRequests = [];
        $scope.errorLoading = function (request) {
            return _.contains($scope.failedRequests, request);
        };

        $scope.user = $routeParams.user;
        $scope.accountNumber = $routeParams.accountNumber;

        $scope.actionList = [
            'changeName'
        ];

        $scope.isEmpty = function (obj) {
            return _.isEmpty(obj);
        };

        var vipSvcParams = function (vip) {
            return {
                user: $routeParams.user,
                id: $routeParams.loadbalancerid,
                region: $routeParams.region,
                detailId: vip.id
            };
        };

        var postDeleteVip = function (vip) {

            var svcParams = vipSvcParams(vip);
            var resource = Lbaas.deleteVip(svcParams);

            rxPromiseNotifications.add(resource.$promise, {
                /* jshint camelcase: false */
                loading: 'Deleting Virtual IP ' + vip.ip_address,
                /* jshint camelcase: false */
                success: 'Virtual IP "' + vip.ip_address + '" successfully deleted.',
                /* jshint camelcase: false */
                error: 'Error deleting Virtual IP ' + vip.ip_address + '.'
            });

            /*
                The VIP takes more than a second to delete, so essentially we issue the delete call, but it
                just queues it up in the background. It takes a couple of seconds for the call to actually
                get updated virtual IPs or the deleted virtual IP. The current solution is to add an interval
                to wait for 3 seconds before fetching updated data. We might have to consider another,
                less hacky solution.
            */
            return resource.$promise.then($interval(fetchLoadBalancerDetails, 3000, 1, false));
        };

        var updateNodes = function (params) {
            var success = function () {
                Status.complete({
                    prop: 'updatingloadbalancerNodes'
                });
                Status.setSuccessImmediate('Nodes Added Successfully.');
                loadDetails();
            };
            var failure = function (error) {
                Status.clear();
                if (error.status === 404) {
                    Status.setError('Error in locating resource: ' + error.statusText);
                } else if (error.status === 500) {
                    Status.setError('Error in adding Nodes - ' + error.statusText);
                } else {
                    Status.setError('Unexpected error occurred ' + error.statusText);
                }
            };
            var resource = Lbaas.addBulkNodes(svcParams, params, success, failure);
            return resource.$promise;
        };

        var updateSpecificNode = function (nodeParams, id) {

            var params = {
                user: $routeParams.user,
                id: $routeParams.loadbalancerid,
                region: $routeParams.region,
                nodeid: id
            };

            var success = function () {
                Status.setSuccessImmediate('Node updated successfully.');
                loadDetails();
            };
            var failure = function (error) {

                if (error.status === 404) {
                    Status.setError('Error in locating resource: ' + error.statusText);
                } else if (error.status === 500) {
                    Status.setError('Error in updating Node - ' + error.statusText);
                } else {
                    Status.setError('Unexpected error occurred ' + error.statusText);
                }

            };
            LbaasNodeService.updateNode(params, nodeParams, success, failure);
        };

        var putErrorPageContent = function (fields) {

            var errorPageFailure = function (error) {
                if (error.status === 404) {
                    Status.setError('Error in locating resource: ' + error.statusText);
                } else if (error.status === 500) {
                    Status.setError('Unable to update "Error Page" content - ' + error.statusText);
                } else {
                    Status.setError('Unexpected error occurred ' + error.statusText);
                }
            };
            var errorPageSuccess = function () {
                $scope.loadBalancer.errorPage = 'Custom';
                Status.setSuccessImmediate('Error Page Updated to Custom successfully');
            };

            var params = {
                content: fields.errorPageContent
            };
            var resource = Lbaas.changeErrorPage(svcParams, params, errorPageSuccess, errorPageFailure);
            return resource.$promise;
        };

        var deleteErrorPageContent = function () {

            var errorPageFailure = function (error) {
                if (error.status === 404) {
                    Status.setError('Error in locating resource: ' + error.statusText);
                } else if (error.status === 500) {
                    Status.setError('Unable to update "Error Page" content to default - ' + error.statusText);
                } else {
                    Status.setError('Unexpected error occurred ' + error.statusText);
                }
            };
            var errorPageSuccess = function () {
                $scope.loadBalancer.errorPage = 'Default Error Page';
                Status.setSuccessImmediate('Error Page Updated to Default successfully');
            };
            var resource = Lbaas.deleteErrorPage(svcParams, errorPageSuccess, errorPageFailure);
            return resource.$promise;
        };

        /**
         * @ngdoc function
         * @name encore.cloud.ui.ShowLoadBalancerCtrl
         * @requires requestedSetting parameter
         * @description
         *
         * Method to hook preHook, postHook and templateUrl dynamically used within modal popup. This will trigger
         * when user clicks on individual toggle setting.
         */
        var hookModalSettings = function (requestedSetting) {
            var settingParameters;
            var findItem = _.find(TOGGLE_SWITCH.settingsParameters, function (settingParams) {
                return settingParams.settingName === requestedSetting.settingName;
            });

            settingParameters = requestedSetting.isEdit ? (_.isEmpty(findItem.edit) ? findItem.enable : findItem.edit) :
            ($scope.actions.toggleStatus[requestedSetting.settingName] ? findItem.disable : findItem.enable);

            setSettingParameters(settingParameters);
        };

        var callEditMethod = function (param) {
            hookModalSettings(param);
        };

        var toggleStatus = TOGGLE_SWITCH.toggleStatus;

        /**
         * @ngdoc function
         * @name encore.cloud.ui.ShowLoadBalancerCtrl
         * @requires loadBalancer
         * @description
         *
         * When page initializes toggle flags are being set via loadBalancer object using the relevant
         * rule for each setting.
         */
        var setToggleStatus = function (loadBalancer) {
            _.forEach($scope.actions.toggleStatus, function (value, key, obj) {
                var getSettingKey = _.findKey(loadBalancer, function (val, lbKey) {
                    return lbKey === key;
                });

                if (!_.isEmpty(loadBalancer[getSettingKey])) {
                    if (key === 'contentCaching' || key === 'connectionLogging') {
                        obj[key] = (loadBalancer.status === 'ACTIVE' &&
                            loadBalancer[getSettingKey].enabled === false) ? false : true;
                    } else {
                        obj[key] = true;
                    }
                } else {
                    obj[key] = false;
                }
            });
        };

        var setSettingParameters = function (hookParams) {
            if (!_.isEmpty(hookParams.preHook)) {
                $scope.preHookMethod = hookParams.preHook;
            }
            $scope.postHookMethod = hookParams.postHook;
            $scope.templateUrl = hookParams.templateUrl;

        };

        /**
         * @ngdoc function
         * @name $scope.actions.postAddVirtualIp
         * @requires
         * @description
         * scope actions method to add virtual ips. It takes fields as parameter, which contains vip type,
         * ticket number and reason.
         */
        var postAddVirtualIp = function (fields) {
            Status.setLoading('Adding Virtual IP ' + $scope.loadBalancer.name);

            var virtualIpToAdd = {
                type: fields.vipType.name,
                ticket: {
                    ticketId: parseInt(fields.ticketNumber),
                    comment: fields.reason
                }
            };

            addVirtualIp(virtualIpToAdd);
        };

        var getNodesList = function () {

            var successHandler = function (result) {
                $scope.loadBalancer.nodes = result.nodes;
                checkForNodeNames();
            };
            var errorHandler = function (error) {
                if (error.status === 404) {
                    Status.setError('Error in locating resource: ' + error.statusText);
                } else if (error.status === 500) {
                    Status.setError('Error in getting LB nodes list - ' + error.statusText);
                } else {
                    Status.setError('Unexpected error occurred ' + error.statusText);
                }
            };
            return LbaasNodeService.getNodeListExtendedView(svcParams, successHandler, errorHandler).$promise;
        };

        var fetchLoadBalancerDetails = function () {
            var fetchLBSuccess = function (data) {
                $scope.loadBalancer = data.loadBalancer;
                if (!_.has($scope.loadBalancer, 'nodes')) {
                    $scope.loadBalancer.nodes = [];
                }
                getNodesList();
            };

            var fetchLBFailure = function (error) {
                $scope.error = error;
                $scope.failedRequests.push('details');
                Status.setError('Error loading Load Balancer details: ${message}', error);
            };

            var resource = Lbaas.getLoadBalancers(svcParams, fetchLBSuccess, fetchLBFailure);
            return resource.$promise;
        };

        var setFetchingComplete = function () {
            $scope.fetchConnectionThrottle = false;
            $scope.fetchConnectionLogging = false;
            $scope.fetchContentCaching = false;
            $scope.fetchTemporaryRateLimit = false;
        };

        var setStatus = function () {
            Status.setSuccessImmediate('Load Balancer details loaded');
            setFetchingComplete();
        };

        var makeSuccessFunction = function (request) {
            return function (data) {
                $scope.loadBalancer[request] = data[request];
            };
        };

        var makeFailureFunction = function (request) {
            return function (error) {
                $scope.error = error;
                $scope.failedRequests.push(request);
                Status.setError('Error loading: ' + failedRequestMapping[request]);
            };
        };

        var makeDefaultFunctions = function (request) {
            return {
                'success': makeSuccessFunction(request),
                'failure': makeFailureFunction(request),
            };
        };

        var checkForNodeNames = function () {
            _.forEach($scope.loadBalancer.nodes, function (node) {
                if (_.has($scope.cloudServerInfo.ipMapping, node.address)) {
                    node.name = $scope.cloudServerInfo.ipMapping[node.address];
                }
            });
        };

        // ------------- Page load Functions --------------

        var loadErrorPage = function () {

            var success = function (data) {
                if (data.errorPage.content.indexOf('The service is temporarily unavailable') > -1) {
                    $scope.loadBalancer.errorPage = 'Default Error Page';
                } else {
                    $scope.loadBalancer.errorPage = 'Custom';
                }
            };

            var resource = Lbaas.getErrorPage(svcParams, success, makeFailureFunction('errorPage'));
            return resource.$promise;
        };

        var loadSSLTermination = function () {
            var success = function (data) {
                if (!_.has(data.sslTermination, 'configured')) {
                    $scope.loadBalancer.sslTermination = data.sslTermination;
                }
            };

            var resource = Lbaas.getSSLTermination(svcParams, success, makeFailureFunction('sslTermination'));
            return resource.$promise;
        };

        var loadHealthMonitor = function (msg) {
            if (msg){
                Status.setSuccessImmediate(msg);
            }

            var defaults = makeDefaultFunctions('healthMonitor');
            var resource = Lbaas.getHealthMonitor(svcParams, defaults.success, defaults.failure);
            return resource.$promise;
        };

        var loadAccessList = function () {
            var defaults = makeDefaultFunctions('accessList');
            var resource = Lbaas.getAccessList(svcParams, defaults.success, defaults.failure);
            return resource.$promise;
        };

        $scope.deleteAccessId = function (accessElement) {
            var params =  {
                user: svcParams.user,
                id: svcParams.id,
                region: svcParams.region,
                detailId: accessElement.id
            };

            var lbaasPromise = Lbaas.deleteAccessId(params).$promise;

            lbaasPromise.then(function () {
               /* _.pull cannot be used since when running the tests
                it will fail to recongize any object as a part of the
                set. So switching to _.remove */
                _.remove($scope.loadBalancer.accessList, accessElement);
            });

            rxPromiseNotifications.add(lbaasPromise, {
                error: 'Access Control: IP (' + accessElement.address + ') Removal Failure',
                success: 'Access Control: IP (' + accessElement.address + ') Removal Success'
            });

        };

        var loadConnectionThrottle = function () {
            var defaults = makeDefaultFunctions('connectionThrottle');
            var resource = Lbaas.getConnectionThrottle(svcParams, defaults.success, defaults.failure);
            return resource.$promise;
        };

        var loadSessionPersistence = function () {
            var defaults = makeDefaultFunctions('sessionPersistence');
            var resource = Lbaas.getSessionPersistence(svcParams, defaults.success, defaults.failure);
            return resource.$promise;
        };

        /**
         * @ngdoc function
         * @name addVirtualIp
         * @requires
         * @description
         * It is local function to call API via Lbaas service and takes virtualIP object
         * parameter sent from $scope.addVirtualIp method. It returns the address, type and ip
         * response from API, which then binds to load balancer virtualIps object.
         */
        var addVirtualIp = function (virtualIp) {
            var defaults = makeDefaultFunctions('admin_virtualips');
            var success = function (response) {
                Status.setSuccessImmediate('Virtual IP successfully added for Load Balancer ' +
                                           $scope.loadBalancer.name);

                $scope.loadBalancer.virtualIps.push({
                    'ip_address': response.address,
                    'ip_type': response.type,
                    'id': response.id
                });
            };
            var resource = Lbaas.addVirtualip(svcParams,
                                            virtualIp,
                                            success,
                                            defaults.failure);
            return resource.$promise;
        };

        var loadCloudServerDetails = function () {
            /* Load all the firstgen and nextgen servers for this user,
             * and iterate through all of them, checking their IP addresses.
             * If an IP address matches the IP address of a node, then grab
             * the name of the server and assign it in $scope.cloudServerInfo.ipMapping
             */
            var firstGenContainer = { failedRequests: [] };
            var nextGenContainer = { failedRequests: [] };

            var success = function (data) {
                $scope.cloudServerInfo.servers = $scope.cloudServerInfo.servers.concat(data);
                _.forEach(data, function (server) {
                    _.forEach(server.addresses, function (address) {
                        /* jshint camelcase:false */
                        $scope.cloudServerInfo.ipMapping[address.ip_address] = server.name;
                    });
                });
                checkForNodeNames();
            };

            var nextGenPromise = CloudServerLoaders.loadNextGenServers($scope.user, nextGenContainer)
                .then(success);
            var firstGenPromise = CloudServerLoaders.loadFirstGenServers($scope.user, firstGenContainer)
                .then(success);

            return $q.all([nextGenPromise, firstGenPromise])
                    .finally(function () {
                        if (firstGenContainer.failedRequests.length) {
                            Status.setError('Error loading First Gen Servers');
                        }
                        if (nextGenContainer.failedRequests.length) {
                            Status.setError('Error loading Next Gen Servers');
                        }
                    });
        };

        var pendingStatusPromise;
        var loadDetails = function () {
            Status.setLoading('Loading Load Balancer Details');

            $scope.fetchContentCaching = true;
            $scope.fetchConnectionThrottle = true;
            $scope.fetchConnectionLogging = true;
            $scope.fetchTemporaryRateLimit = true;

            var loadRemainingDetails = function (loadBalancer) {
                return $q.all(
                    [
                        loadErrorPage(),
                        loadSSLTermination(),
                        loadHealthMonitor(),
                        loadAccessList(),
                        loadConnectionThrottle(),
                        loadSessionPersistence(),
                        loadCloudServerDetails()
                    ])
                    .finally(function () {
                        setStatus();
                        setToggleStatus(loadBalancer.loadBalancer);
                        return loadBalancer.loadBalancer;
                    });
            };

            var checkPendingStatus = function (loadBalancer) {
                if (_.isEmpty(pendingStatusPromise) && _.contains(loadBalancer.status, 'PENDING')) {
                    pendingStatusPromise = $interval(loadDetails, 1000, 5, false);
                } else if (!_.isEmpty(pendingStatusPromise) && !_.contains(loadBalancer.status, 'PENDING')) {
                    $interval.cancel(pendingStatusPromise);
                    pendingStatusPromise = undefined;
                }
                return loadBalancer;
            };

            fetchLoadBalancerDetails().then(loadRemainingDetails, setStatus).then(checkPendingStatus);
        };

        // ---------------- Private Actions -----------------
        var preEditNode = function (modalScope, node) {
            modalScope.changedNode = (JSON.parse(JSON.stringify(node))); //node;
            modalScope.nodeConditions = ['ENABLED', 'DISABLED', 'DRAINING'];
            modalScope.changedNode.condition = modalScope.changedNode.condition || 'ENABLED';
            modalScope.weightStatus = $scope.loadBalancer.algorithm.indexOf('WEIGHTED') ===
                                                        -1 ? true : false;
        };

        var postEditNode = function (changedNode) {
            var nodeParams = {
                condition: changedNode.condition,
                weight: changedNode.weight,
                type: changedNode.nodeType
            };
            updateSpecificNode(nodeParams, changedNode.id);
        };

        /**
         * @ngdoc function
         * @name deleteNode
         * @requires nodeId
         * @param {Int} index Int representing the index
         * @param {String} nodeId String representing the node id
         * @private
         * @description
         *
         * Delete the single node from nodes table
        */
        var deleteNode = function (index, nodeId) {

            var svcParams = {
                user:  $routeParams.user,
                id: $routeParams.loadbalancerid,
                region: $routeParams.region,
                nodeid: nodeId
            };

            Status.setLoading('Deleting node');

            var success = function () {
                Status.clear();
                /*jshint multistr: true */
                var successMessage = 'Node is scheduled for removal and will no longer ' +
                                 'be visible in the node list once removal is complete.';
                Status.setSuccessImmediate(successMessage);
                $scope.loadBalancer.nodes.splice(index, 1);
            };

            var error = function () {
                Status.clear();
                if (error.status === 404) {
                    Status.setError('Error in locating resource: Could not remove nodes');
                } else if (error.status === 500) {
                    Status.setError('Error: Could not remove nodes');
                } else {
                    Status.setError('Unexpected error occurred: Could not remove nodes');
                }
            };

            return LbaasNodeService.deleteNode(svcParams, success, error).$promise;
        };

        var preEditErrorPage = function (modalScope) {

            var errorPageFailure = function (error) {

                if (error.status === 404) {
                    Status.setError('Error in locating resource: ' + error.statusText);
                } else if (error.status === 500) {
                    Status.setError('Unable to read "Error Page" content - ' + error.statusText);
                } else {
                    Status.setError('Unexpected error occurred ' + error.statusText);
                }
            };
            var errorPageSuccess = function (success) {
                var defaultContent = ERROR_PAGE_CONTENT.defaultErrorPageContent;

                var tempActualMsg = success.errorPage.content;
                var actualMsg = decodeURIComponent(tempActualMsg).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                var errorCond = tempActualMsg.indexOf('The service is temporarily unavailable.');
                var errorHtml = errorCond > -1 ? defaultContent : actualMsg;
                var lbProtocol = $scope.loadBalancer.protocol;
                var protocolCondition = lbProtocol ? (lbProtocol === 'HTTP') : false ;
                var errorTypeList =  protocolCondition ? ['Default', 'Custom'] : ['Default'];
                var selectedError = ((errorHtml === defaultContent || !protocolCondition)  ? 'Default' : 'Custom');

                modalScope.fields = {
                    errorPageContent: errorHtml,
                    errorType: errorTypeList,
                    selectedType: selectedError,
                    isCustomSelected: (errorHtml === defaultContent || !protocolCondition) ? false : true
                };

                modalScope.changeAction = function () {
                    if (modalScope.fields.selectedType === 'Custom') {
                        modalScope.fields.isCustomSelected = true;
                        modalScope.fields.errorPageContent = errorHtml;
                    } else {
                        modalScope.fields.errorPageContent = defaultContent;
                        modalScope.fields.isCustomSelected = false;
                    }
                };
            };
            Lbaas.getErrorPage(svcParams, errorPageSuccess, errorPageFailure);
        };

        var postEditErrorPage = function (fields) {

            Status.setLoading('Updating Error Page content');
            if (fields.selectedType === 'Default') {
                deleteErrorPageContent();
            } else {

                putErrorPageContent(fields);
            }
        };

        /**
         * @ngdoc function
         * @name preAddCloudServers
         * @param {Object} modalScope Object containing modal fields
         * @private
         * @description
         *
         * Method for prepopulate a cloud servers of loadbalancer
        */
        var preAddCloudServers = function (modalScope) {

            var svcParams = {
                user: $routeParams.user
            };
            modalScope.isLoading = true;
            modalScope.servers = [];
            var firstGenPromise = {};
            var accountServersPromise = {};
            var serversList = [];

            var firstGenSuccess = function (data) {
                serversList = serversList.concat(data.servers);
            };

            var accountServersSuccess = function (data) {
                serversList = serversList.concat(data.servers);
            };

            var error = function () {
                modalScope.isLoading = false;
                if (error.status === 404) {
                    Status.setError('Error in locating resource: ' + error.statusText);
                } else if (error.status === 500) {
                    Status.setError('Error in getting of nodes - ' + error.statusText);
                } else {
                    Status.setError('Unexpected error occurred ' + error.statusText);
                }
            };

            var getServersList = function (server) {
                modalScope.isLoading = false;
                var conditionTypes = ['ENABLED', 'DISABLED', 'DRAINING'];
                var weightStatus = $scope.loadBalancer.algorithm.indexOf('WEIGHTED');

                server.forEach(function (server) {
                    _.forEach(server.addresses, function (serverIpAddress) {
                        if (serverIpAddress['ip_type'] === 'private') {
                            var selectStatus = true;

                            $scope.loadBalancer.nodes.forEach(function (selectedServer) {
                                var ipCond = serverIpAddress['ip_address'] === selectedServer.address;
                                var nameCond = server.name === selectedServer.name;
                                if (ipCond && nameCond)
                                {
                                    selectStatus = false;
                                }
                            });

                            if (selectStatus === true) {
                                modalScope.servers.push({
                                    name: server.name,
                                    weightState: weightStatus === -1 ? true : false,
                                    weight: weightStatus === -1 ? '' : 1,
                                    ipAddress: serverIpAddress['ip_address'],
                                    conditions: conditionTypes,
                                    selectedCondition: conditionTypes[0],
                                    port: 80,
                                    rowIsSelected: false
                                });
                            }
                        }
                    });
                });
            };

            firstGenPromise = LbaasCloudServerService.getFirstGenServers(svcParams, firstGenSuccess, error).$promise;
            accountServersPromise = LbaasCloudServerService.getAccountServers(svcParams, accountServersSuccess, error)
                                    .$promise;

            return $q.all([firstGenPromise, accountServersPromise])
                .finally(function () {
                    getServersList(serversList);
                });
        };

        var postAddCloudServers = function (servers) {

            var serversToAdd = [];
            Status.setLoading('Updating loadBalancer Nodes', { prop: 'updatingloadbalancerNodes' });

            servers.forEach(function (result) {

                if (result['rowIsSelected'] === true) {
                    (function () {
                        var tempResult = {
                            'address': result.ipAddress,
                            'port': Number(result.port),
                            'condition': result.selectedCondition,
                            'weight': result.weight
                        };
                        if (!result.weight) {
                            delete tempResult.weight;
                        }
                        serversToAdd.push(tempResult);
                    })();
                }
            });

            if (serversToAdd.length > 0) {
                updateNodes({ 'nodes': serversToAdd });
            } else {
                Status.complete({
                    prop: 'updatingloadbalancerNodes'
                });
                Status.setError('No Servers Added: No Nodes Selected');
            }

        };

        var postChangeName = function (changeName) {
            var success = function () {
                $scope.loadBalancer.name = changeName.name;
                Status.setSuccessImmediate('Name changed.');
            };

            var error = function () {
                Status.setError('Error changing name:');
            };

            var resource = Lbaas.changeName(svcParams,
                                                  changeName,
                                                  success,
                                                  error);
            return resource.$promise;
        };

        /**
         * @ngdoc function 
         * @name preUpdateHealthMonitor
         * @param {Object} modalScope Object containing modal fields
         * @private
         * @description
         *
         * Method for prepopulate a health monitor of loadbalancer
        */
        var preUpdateHealthMonitor = function (modalScope) {
            modalScope.fields = {
                delay: $scope.loadBalancer.healthMonitor.delay,
                timeout: $scope.loadBalancer.healthMonitor.timeout,
                attemptsBeforeDeactivation: $scope.loadBalancer.healthMonitor.attemptsBeforeDeactivation,
                path: $scope.loadBalancer.healthMonitor.path,
                statusRegex: $scope.loadBalancer.healthMonitor.statusRegex,
                bodyRegex: $scope.loadBalancer.healthMonitor.bodyRegex,
                type: $scope.loadBalancer.healthMonitor.type
            };
        };

        var postUpdateHealthMonitor = function (healthMonitor) {
            if (healthMonitor.type !== ('HTTP' || 'HTTPS')) {
                delete healthMonitor.path;
                delete healthMonitor.statusRegex;
                delete healthMonitor.bodyRegex;
            }
            Status.setLoading('Enabling health monitoring');
            var defaults = makeDefaultFunctions('healthMonitor');
            var success = function () {
                Status.clear();
                Status.setSuccessImmediate('Health monitoring updated.');
                $scope.actions.toggleStatus.healthMonitor = true;
                loadHealthMonitor();
            };
            var resource = Lbaas.updateHealthMonitor(svcParams,
                                                  healthMonitor,
                                                  success,
                                                  defaults.failure);
            return resource.$promise;
        };

        var postDisableHealthMonitor = function (healthMonitor) {
            var defaults = makeDefaultFunctions('healthMonitor');
            var success = function () {
                Status.setSuccessImmediate('Health monitoring disabled.');
                $scope.actions.toggleStatus.healthMonitor = false;
                loadHealthMonitor();
            };
            var resource = Lbaas.disableHealthMonitor(svcParams,
                                                  healthMonitor,
                                                  success,
                                                  defaults.failure);
            return resource.$promise;
        };

        var postDeleteLoadBalancer = function () {
            var success = function () {
                var msg = 'Load Balancer "' + $scope.loadBalancer.name +
                    '" delete successfully initiated. It will take a few moments to complete.';
                Status.setSuccessNext(msg);

                var loadBalancersPath = '/' + $routeParams.accountNumber + '/' + $scope.user + '/loadbalancers';
                $location.path(loadBalancersPath);
            };

            var error = function () {
                Status.setError('Error deleting Load Balancer');
            };

            var resource = Lbaas.delete(svcParams,
                                        null,
                                        success,
                                        error);
            return resource.$promise;
        };

        var addUpdateConnectionThrottle = function (connectionThrottle, msgParam) {
            $scope.fetchConnectionThrottle = true;
            var defaults = makeDefaultFunctions('connectionThrottle');
            var success = function () {
                loadConnectionThrottle();
                Status.setSuccessImmediate('Connection Throttling successfully ' + msgParam + ' for Load Balancer ' +
                                           $scope.loadBalancer.name);
                $scope.fetchConnectionThrottle = false;
                $scope.actions.toggleStatus.connectionThrottle = true;
            };
            var resource = Lbaas.addUpdateConnectionThrottle(svcParams,
                                                  connectionThrottle,
                                                  success,
                                                  defaults.failure);
            return resource.$promise;
        };

        var postDisableConnectionThrottle = function () {
            Status.setLoading('Removing Connection Throttle ' + $scope.loadBalancer.name);
            $scope.fetchConnectionThrottle = true;
            var defaults = makeDefaultFunctions('connectionThrottle');
            var success = function () {
                Status.setSuccessImmediate('Disabled Connection Throttle for ' + $scope.loadBalancer.name);
                $scope.loadBalancer['connectionThrottle'] = {};
                $scope.fetchConnectionThrottle = false;
                $scope.actions.toggleStatus.connectionThrottle = false;
            };
            var resource = Lbaas.disableConnectionThrottle(svcParams, success, defaults.failure);
            return resource.$promise;
        };

        // Enable or Disable log connection for a load balancer
        var postToggleLogConnection = function (loadBalancer) {
            // Set the pending flag
            $scope.fetchConnectionLogging = true;

            var toggleSwitch = { 'enabled': !loadBalancer.connectionLogging.enabled };

            var toggleLoadBalancerActionsSuccess = function () {
                var logConnectionStatus = loadBalancer.connectionLogging.enabled ? 'disabled' : 'enabled';
                // update the current state to match the value sent to the server.
                loadBalancer.connectionLogging.enabled = toggleSwitch.enabled;
                toggleOnEnableDisable(toggleSwitch.enabled, 'connectionLogging');
                Status.setSuccessImmediate('Logging ' + logConnectionStatus + ' for "' + loadBalancer.name + '" ' +
                         '(#' + loadBalancer.id + ')');
            };

            var toggleLoadBalancerActionsFailure = function (error) {
                Status.setError('Error in changing Load Balancer Logging for ' +
                    loadBalancer.name + ' ' + error);
                toggleOnEnableDisable(loadBalancer.connectionLogging.enabled, 'connectionLogging');
            };

            Lbaas.updateLogConnections(svcParams, toggleSwitch)
                .$promise
                .then(toggleLoadBalancerActionsSuccess, toggleLoadBalancerActionsFailure)
                .finally(setFetchingComplete);
        };

        // Enable or Disable content caching for a load balancer
        var postToggleContentCaching = function (loadBalancer) {
            // Set the pending flag
            $scope.fetchContentCaching = true;

            var toggleSwitch = { 'enabled': !loadBalancer.contentCaching.enabled };

            var toggleLoadBalancerActionsSuccess = function () {
                var contentCachingStatus = loadBalancer.contentCaching.enabled ? 'disabled' : 'enabled';
                // update the current state to match the value sent to the server.
                loadBalancer.contentCaching.enabled = toggleSwitch.enabled;
                toggleOnEnableDisable(toggleSwitch.enabled, 'contentCaching');
                Status.setSuccessImmediate('Content Caching ' + contentCachingStatus + ' for "' + loadBalancer.name +
                     '" ' + '(#' + loadBalancer.id + ')');
            };

            var toggleLoadBalancerActionsFailure = function (error) {
                Status.setError('Error in changing Load Balancer Content Caching for ' +
                    loadBalancer.name + ' ' + error.status + ' - ' + error.statusText);
                toggleOnEnableDisable(loadBalancer.contentCaching.enabled, 'contentCaching');
            };

            Lbaas.updateContentCaching(svcParams, toggleSwitch)
                .$promise
                .then(toggleLoadBalancerActionsSuccess, toggleLoadBalancerActionsFailure)
                .finally(setFetchingComplete);
        };

        var toggleOnEnableDisable = function (enableDisableState, settingName) {
                if (enableDisableState) {
                    $scope.actions.toggleStatus[settingName] = true;
                } else {
                    $scope.actions.toggleStatus[settingName] = false;
                }
            };

        var preAddConnectionThrottle = function (modalScope) {
            modalScope.fields = {
                minConnections: $scope.loadBalancer.connectionThrottle.minConnections,
                maxConnections: $scope.loadBalancer.connectionThrottle.maxConnections,
                maxConnectionRate: $scope.loadBalancer.connectionThrottle.maxConnectionRate,
                rateInterval: $scope.loadBalancer.connectionThrottle.rateInterval
            };
        };

        var postAddConnectionThrottle = function (fields) {
            Status.setLoading('Adding Connection Throttle ' + $scope.loadBalancer.name);

            var connectionThrottleFieldsToAdd = {
                minConnections: parseInt(fields.minConnections),
                maxConnections: parseInt(fields.maxConnections),
                maxConnectionRate: parseInt(fields.maxConnectionRate),
                rateInterval: parseInt(fields.rateInterval)
            };

            addUpdateConnectionThrottle(connectionThrottleFieldsToAdd, 'added');
        };

        /**
         * @ngdoc function
         * @name postAddTemporaryRateLimit
         * @param {Object} fields Object containing modal fields
         * @private
         * @description
         *
         * Method to send temporary rate limit fields for adding
        */
        var postAddTemporaryRateLimit = function (fields) {

            Status.setLoading('Adding Temporary Rate Limit');
            if (checkExpirationTime(fields.expirationTime)) {
                var temporaryRateLimit = {
                    expirationTime: fields.expirationTime,
                    maxRequestsPerSecond: (fields.maxRequestsPerSecond).toString(),
                    ticket: {
                        ticketId: fields.ticketId,
                        comment: fields.comment
                    }
                };
                addUpdateTemporaryRateLimit(temporaryRateLimit, 'add');
            }
        };

        /**
         * @ngdoc function
         * @name preUpdateTemporaryRateLimit
         * @param {Object} modalScope Object containing modal fields
         * @private
         * @description
         *
         * Method for prepopulate a temporary rate limit of loadbalancer
        */
        var preUpdateTemporaryRateLimit = function (modalScope) {

            modalScope.fields = {
                editState: true,
                maxRequestsPerSecond: parseInt($scope.loadBalancer.rateLimit.maxRequestsPerSecond),
                expirationTime: moment(moment.utc(new Date($scope.loadBalancer.rateLimit.expirationTime)
                                .toUTCString()).format('YYYY-MM-DD HH:mm:SS'))._i
            };
        };

        /**
         * @ngdoc function
         * @name postUpdateTemporaryRateLimit
         * @param {Object} fields Object containing modal fields
         * @private
         * @description
         *
         * Method to send temporary rate limit fields for updating
        */
        var postUpdateTemporaryRateLimit = function (fields) {

            Status.setLoading('Updating Temporary Rate Limit');
            if (checkExpirationTime(fields.expirationTime)) {
                var temporaryRateLimit = {
                    expirationTime: fields.expirationTime,
                    maxRequestsPerSecond: (fields.maxRequestsPerSecond).toString()
                };
                addUpdateTemporaryRateLimit(temporaryRateLimit, 'updat');
            }
        };

        /**
         * @ngdoc function
         * @name checkExpirationTime
         * @param {String} expirationTime String representing the expiration time
         * @public
         * @description
         *
         * Method for compare the expiration time of ratelimit with Today's date
        */
        var checkExpirationTime = function (expirationTime) {

            if (moment(expirationTime).isValid()) {
                expirationTime = moment.utc(expirationTime).toDate();

                if (new Date() < expirationTime) {
                    return true;
                } else {
                    Status.clear();
                    Status.setError('Expiration time should be greater than today\'s date');
                    return false;
                }

            } else {
                Status.clear();
                Status.setError('Please enter the valid expiration Time');
                return false;
            }
        };

        /**
         * @ngdoc function
         * @name addUpdateTemporaryRateLimit
         * @param {Object} temporaryRateLimit Object containing modal fields
                  {String} msgParam String containing action inforamtion
         * @private
         * @description
         *
         * Method for add and update the temporary ratelimit
        */
        var addUpdateTemporaryRateLimit = function (temporaryRateLimit, msgParam) {

            $scope.fetchTemporaryRateLimit = true;
            var success = function () {
                Status.clear();
                Status.setSuccessImmediate('Temporary Rate Limit successfully' + ' ' + msgParam + 'ed Load Balancer ' +
                                        $scope.loadBalancer.name);
                $scope.fetchTemporaryRateLimit = false;
                $scope.actions.toggleStatus.rateLimit = true;
                loadDetails();
            };

            var failure = function (error) {
                Status.clear();
                if (error.status === 500) {
                    Status.setError('Error' + ' ' + msgParam.charAt(0).toUpperCase() + msgParam.slice(1) +
                    'ing Temporary Rate Limit ' + ' - ' + error.data.error.message);
                } else {
                    Status.setError('Error' + ' ' + msgParam.charAt(0).toUpperCase() + msgParam.slice(1) +
                    'ing Temporary Rate Limit ' + ' - ' + error.statusText);
                }
            };
            if (msgParam === 'add') {
                return Lbaas.addTemporaryRateLimit(svcParams, temporaryRateLimit, success, failure).$promise;
            } else {
                return Lbaas.updateTemporaryRateLimit(svcParams, temporaryRateLimit, success, failure).$promise;
            }

        };

        var getNodeUrl = function (node) {
            var uri;
            if (node.region) {
                uri = CLOUD_URL.servers + '/' + node.region + '/' + node['slice_id'];
            } else {
                uri = CLOUD_URL.servers + '/firstgen/' + node['slice_id'];
            }
            return uri;
        };

        var accessListNodeTemplate = {
            address: '',
            type: 'DENY'
        };

        /**
         * @ngdoc function
         * @name encore.cloud.ui.ShowLoadBalancerCtrl
         * @description
         *
         * Initializes the scope variable with empty template, so that user can see single row
         * text fields of Ip Address and Type into the modal.
         */
        var preAddAccessRule = function () {
            $scope.accessListNodes = {
                accessList: [angular.copy(accessListNodeTemplate)]
            };
        };

        /**
         * @ngdoc function
         * @name encore.cloud.ui.ShowLoadBalancerCtrl
         * @description
         *
         * This method will trigger when user clicks on "Add Hosts" on the Add Access Rule Modal.
         * It creates an accessList object then sends a post request. Displaying Error or success as well
         * as updating the $scope.loadBalancer.accessList to update the on screen list.
         */
        var postAddAccessRule = function () {

            var lbaasPromise = Lbaas.addAccessControlList(svcParams, $scope.accessListNodes).$promise;

            lbaasPromise.then(function () {
                $scope.loadBalancer.accessList =
                    $scope.loadBalancer.accessList.concat($scope.accessListNodes.accessList);
            });

            rxPromiseNotifications.add(lbaasPromise, {
                error: 'Access Control: Failed to Upload Access List',
                success: 'Access Control: Access List Upload Successful'
            });

        };

        /**
         * @ngdoc function

         * @name encore.cloud.ui.ShowLoadBalancerCtrl
         * @description
         *
         * This method will trigger when user clicks on "Add More..." anchorTag on Add Access List Rule modal page.
         * it pushes the empty object into the accessListNode scope object and creates new row of IP address and
         * type.
         */
        var addToAccessListNodes = function () {
            $scope.accessListNodes.accessList.push(angular.copy(accessListNodeTemplate));
        };

         /**
         * @ngdoc function
         * @name encore.cloud.ui.ShowLoadBalancerCtrl
         * @require index (sends index from template, to delete particular index item from the externalNodes list)
         * @description
         *
         * This method will trigger when user clicks on "X" on individual row of Add External Nodes modal page.
         * it removes the corresponding row item from externalNodes scope object and deletes IP address and
         * port number for that particular row.
         */
        var removeFromAccessListNodes = function (index) {
            $scope.accessListNodes.accessList.splice(index, 1);
        };

        var externalNodeTemplate = {
            address: '',
            port: '',
            condition: 'ENABLED'
        };

        /**
         * @ngdoc property
         * @name encore.cloud.ui.ShowLoadBalancerCtrl
         * @description
         *
         * Initializes the scope variable with empty template, so that user can see single row
         * text fields of Ip Address and Port into the modal.
         */
        $scope.externalNodes = {
            items: [angular.copy(externalNodeTemplate)]
        };

        /**
         * @ngdoc function
         * @name encore.cloud.ui.ShowLoadBalancerCtrl
         * @description
         *
         * This method will trigger when user clicks "Add External Nodes" button on Add External Nodes modal page.
         * It sends the externalNodes POST object to api call for adding external nodes. On successful response
         * newly created nodes will be appended to the existing loadbalancer nodes (new nodes will be displayed
         * to Nodes table).
         */
        var postAddExternalNodes = function () {
            Status.setLoading('Adding External Nodes ' + $scope.loadBalancer.name);

            var externalNodesToAdd = {
                nodes: $scope.externalNodes.items
            };

            var defaults = makeDefaultFunctions('externalNodes');

            var success = function (response) {
                Status.setSuccessImmediate('External nodes added successfully');

                _.forEach(response.nodes, function (node) {
                    $scope.loadBalancer.nodes.push(node);
                });

                // resetting the externalNodes object on success. User would see single entry row
                // in the modal page
                $scope.externalNodes.items = [angular.copy(externalNodeTemplate)];
            };

            return Lbaas.addExternalNodes(svcParams, externalNodesToAdd,
                success, defaults.failure).$promise;
        };

        /**
         * @ngdoc function
         * @name encore.cloud.ui.ShowLoadBalancerCtrl
         * @description
         *
         * This method will trigger when user clicks on "Add More..." anchorTag on Add External Nodes modal page.
         * it pushes the empty object into the externalNodes scope object and creates new row of IP address and
         * port number.
         */
        var addToExternalNodeList = function () {
            $scope.externalNodes.items.push(angular.copy(externalNodeTemplate));
        };

        /**
         * @ngdoc function
         * @name encore.cloud.ui.ShowLoadBalancerCtrl
         * @require index (sends index from template, to delete particular index item from the externalNodes list)
         * @description
         *
         * This method will trigger when user clicks on "X" on individual row of Add External Nodes modal page.
         * it removes the corresponding row item from externalNodes scope object and deletes IP address and
         * port number for that particular row.
         */
        var removeFromExternalNodeList = function (index) {
            $scope.externalNodes.items.splice(index, 1);
        };

        var preSuspendModalHook = function (modalScope) {
            modalScope.fields = { ticketNumber: '', reason: '' };
        };

        var postSuspendModalHook = function (fields) {
            var svcParams = {
                reason: fields.reason,
                ticket: {
                    ticketId: fields.ticketNumber,
                    comment: fields.reason
                }
            };

            suspendLoadBalancer(svcParams);
        };

        /**
         * @ngdoc function
         * @name suspendLoadBalancer
         * @required  {object}   - ticket_object contains reason and ticket object - 
         *      ticket_object - { reason: '<reason>', ticket: { ticketId: <ticketnumber> , comment: '<comments>'}}
         * @description
         * Method for suspending specific Load balancer
        */
        var suspendLoadBalancer = function (params) {
            var failure = function (error) {

                if (error.status === 404) {
                    Status.setError('Error in locating resource: ' + error.statusText);
                } else if (error.status === 500) {
                    Status.setError('Error in Suspending LB - ' + error.statusText);
                } else {
                    Status.setError('Unexpected error occurred ' + error.statusText);
                }

            };
            var success = function () {
                Status.setSuccessImmediate('Load Balancer Suspended Successfully.');
                $scope.loadBalancer.status = 'SUSPENDED';
            };

            return Lbaas.suspendLoadBalancer(svcParams, params, success, failure).$promise;
        };

        /**
         * @ngdoc function
         * @name preMoveHostModalHook
         * @required 
         *      modalScope - object poiniting to caller.
         * @description
         * Method loads the fields required to show list of host with status 'ACTiVE_TARGET'
        */
        var preMoveHostModalHook = function (modalScope) {
            modalScope.isLoading = true;
            Status.setLoading('Loading Active Hosts', { prop: 'loadinghostlist' });

            var svcParams = {
                user: $routeParams.user,
                region: $routeParams.region,
                detailId: $scope.loadBalancer.cluster.id
            };
            var failure = function (error) {
                modalScope.isLoading = false;
                Status.complete({
                    prop: 'loadinghostlist'
                });

                if (error.status === 404) {
                    Status.setError('Error in locating resource: ' + error.statusText);
                } else if (error.status === 500) {
                    Status.setError('Error in getting Hosts - ' + error.statusText);
                } else {
                    Status.setError('Unexpected error occurred ' + error.statusText);
                }
            };

            var success = function (result) {
                modalScope.isLoading = false;
                Status.complete({
                    prop: 'loadinghostlist'
                });

                var hostList = [];
                angular.forEach(result.hosts, function (host) {
                    if (host.status === 'ACTIVE_TARGET' || host.status === 'ACTIVE') {
                        hostList.push(host);
                    }
                });

                modalScope.fields = {
                    hosts: hostList,
                    selectedHost: hostList[0],
                };
            };
            Lbaas.getHosts(svcParams, success, failure);
        };

        /**
         * @ngdoc function
         * @name postMoveHostModalHook
         * @required 
         *      fields - contains the list of 'ACTIVE_TARGET' status host and selected host
         * @description
         * Method for take request to assign the Host to LB.
        */
        var postMoveHostModalHook = function (fields) {

            var svcParams = {
                loadBalancers: [{
                    id: $scope.loadBalancer.id,
                    host: {
                        id: fields.selectedHost.id
                    }
                }]
            };
            assignHost(svcParams, fields.selectedHost);
        };

        /**
         * @ngdoc function
         * @name assignHost
         * @required 
         *      params - { id: '<loadBalancerId>', host: { id: <selectedHostId>}}
         *      selectedHost - selected host object
         * @description
         * Method for reassigning the host to Load Balancer
        */
        var assignHost = function (params, selectedHost) {
            var statusProp = 'updatingHost';
            Status.setLoading('Updating Host of Load Balancer', { prop: statusProp });

            var svcParams = {
                user: $routeParams.user,
                region: $routeParams.region
            };

            var failure = function (error) {
                Status.complete({ prop: statusProp });
                if (error.status === 404) {
                    Status.setError('Error in locating resource: ' + error.statusText);
                } else if (error.status === 500) {
                    Status.setError('Error in getting Hosts - ' + error.statusText);
                } else {
                    Status.setError('Unexpected error occurred ' + error.statusText);
                }
            };

            var success = function () {
                Status.complete({ prop: statusProp });
                Status.setSuccessImmediate('Load Balancer Host Moved Successfully.');
                $scope.loadBalancer.host = selectedHost.name;
            };
            return Lbaas.assignHost(svcParams, params, success, failure).$promise;
        };

        /**
         * @ngdoc function
         * @name preEditLoadBalancerDetails
         * @required 
         *      modalScope - this pointer of calling method, 
         * @description 
         * Method updates the modalScope parameter with required objects
        */
        var preEditLoadBalancerDetails = function (modalScope) {

            var fillLoadBalancerDetails = function () {
                var svcParams = {
                    user: $routeParams.user,
                    region: $routeParams.region
                };

                var success = function (data) {
                    modalScope.protocolsList = data.protocols;
                };

                var failure = function (error) {
                    if (error.status === 404) {
                        Status.setError('Error in locating resource: ' + error.statusText);
                    } else if (error.status === 500) {
                        Status.setError('Error in loading LB details- ' + error.statusText);
                    } else {
                        Status.setError('Unexpected error occurred ' + error.statusText);
                    }
                };

                return Lbaas.getProtocols(svcParams, success, failure).$promise;
            };

            modalScope.isLoading = true;
            Status.setLoading('Loading Load Balancer Details', { prop: 'loadingloadbalancerdetails' });

            fillLoadBalancerDetails().finally(function () {

                modalScope.isLoading = false;
                Status.complete({
                    prop: 'loadingloadbalancerdetails'
                });

                var algorithmIndex;
                var protocolIndex;

                protocolIndex = _.findIndex(modalScope.protocolsList, function (obj) {
                    return obj.name === $scope.loadBalancer.protocol;
                });

                algorithmIndex = _.findIndex(ALGORITHMS.algorithmList, function (obj) {
                    return obj.value === $scope.loadBalancer.algorithm;
                });

                modalScope.fields = {
                    selectedName: $scope.loadBalancer.name,
                    protocols: modalScope.protocolsList,
                    selectedProtocol: modalScope.protocolsList[protocolIndex],
                    selectedPort: $scope.loadBalancer.port,
                    selectedTimeout: $scope.loadBalancer.timeout,
                    algorithms: ALGORITHMS.algorithmList,
                    selectedAlgorithm: ALGORITHMS.algorithmList[algorithmIndex]
                };

                modalScope.changeProtocol = function () {
                    modalScope.fields.selectedPort = modalScope.fields.selectedProtocol.port;
                };
            });

        };

        /**
         * @ngdoc function
         * @name postEditLoadBalancerDetails
         * @required 
         *      fields - contains the objects of LB, that are needed to be updated. 
         * @description 
         * Method calls the updateLoadBalancer function, By organizings parameters as required by updateLoadBalancer
        */
        var postEditLoadBalancerDetails = function (fields) {
            Status.setLoading('Updating Load Balancer Details', { prop: 'updatingloadbalancerdetails' });

            var svcParams = {
                name: fields.selectedName,
                protocol: fields.selectedProtocol.name,
                port: fields.selectedPort,
                timeout: fields.selectedTimeout,
                algorithm: fields.selectedAlgorithm.value,
            };

            updateLoadBalancer(svcParams).finally(function () {
                Status.complete({
                    prop: 'updatingloadbalancerdetails'
                });
            });
        };

        /**
         * @ngdoc function
         * @name updateLoadBalancer
         * @required 
         *      params - this pointer of calling method, 
         * @description 
         * Method takes Load Balancer fields object that need to be updated and calls API, to update Load Balancer.
        */
        var updateLoadBalancer = function (params) {
            var success = function () {
                Status.setSuccessImmediate('Load Balancer Updated Successfully.');
                $scope.loadBalancer.name = params.name;
                $scope.loadBalancer.protocol = params.protocol;
                $scope.loadBalancer.port = params.port;
                $scope.loadBalancer.timeout = params.timeout;
                $scope.loadBalancer.algorithm = params.algorithm;
            };
            var failure = function (error) {
                if (error.status === 404) {
                    Status.setError('Error in locating resource: ' + error.statusText);
                } else if (error.status === 500) {
                    Status.setError('Error in updating LB - ' + error.statusText);
                } else {
                    Status.setError('Unexpected error occurred ' + error.statusText);
                }
            };
            return Lbaas.updateLoadBalancer(svcParams, params, success, failure).$promise;
        };

        /**
         * @ngdoc function
         * @name postDisableSessionPersistence
         * @description 
         * Method make the API call to disable the session persistence for particular Load Balancer
        */
        var postDisableSessionPersistence = function () {
            Status.setLoading('Disabling Session Persistence', { prop: 'updatinglb' });
            var success = function () {
                Status.complete({
                    prop: 'updatinglb'
                });
                Status.setSuccessImmediate('Session Persistence Disabled Successfully.');
                $scope.actions.toggleStatus.sessionPersistence = false;
                $scope.loadBalancer.sessionPersistence = {};
            };

            return Lbaas.disableSessionPersistence(svcParams, success, failureHandler).$promise;
        };

        /**
         * @ngdoc function
         * @name failureHandler
         * @description 
         * Method handle failure's of Load Balancer update method
        */
        var failureHandler = function (error) {
            Status.complete({
                prop: 'updatinglb'
            });
            if (error.status === 404) {
                Status.setError('Error in locating resource: ' + error.statusText);
            } else if (error.status === 500) {
                Status.setError('Error in updating LB - ' + error.statusText);
            } else {
                Status.setError('Unexpected error occurred ' + error.statusText);
            }
        };

        /**
         * @ngdoc method
         * @name postDisableSslTermination
         * @methodOf loadbalancers:ShowLoadBalancerCtrl
         * @required 
         * @description 
         * Method calls API to disable the SSL Termination
        */
        var postDisableSslTermination = function () {
            Status.setLoading('Disabling SSL Termination', { prop: 'updatinglb' });

            var success = function () {
                Status.complete({
                    prop: 'updatinglb'
                });
                Status.setSuccessImmediate('SSL Termination Disabled Successfully.');
                $scope.actions.toggleStatus.sslTermination = false;
                $scope.loadBalancer.sslTermination = {};
            };
            return Lbaas.disableSslTermination(svcParams, success, failureHandler).$promise;
        };

        /**
         * @ngdoc method
         * @name postAddSslTermination
         * @methodOf loadbalancers:ShowLoadBalancerCtrl
         * @required
         * fields - object containing following fields
         *             secure_port              - string  - @required
         *             certificate              - string  - @required if cert is adding
         *             enabled                  - boolean - @required
         *             secure_traffic_only      - boolean - @required
         *             private_key              - string  - @required if cert is adding
         *             intermediate_certificate - string  - @optional
         * @description 
         * Method calls API to add the SSL Termination, based on value of fields.showCertificateStatus.
        */
        var postAddSslTermination = function (fields) {

            Status.setLoading('Updating SSL Termination', { prop: 'updatinglb' });
            var params = {
                'secure_port': fields.securePort,
                'enabled': fields.allowedTraffic.id !== 3,
                'secure_traffic_only': fields.allowedTraffic.id === 2,
                'certificate': fields.certificate.replace(/\\n/g, '\n'),
                'intermediate_certificate': fields.intermediateCertificate.replace(/\\n/g, '\n'),
                'private_key': fields.privateKey.replace(/\\n/g, '\n')
            };

            var success = function () {
                Status.complete({
                    prop: 'updatinglb'
                });
                Status.setSuccessImmediate('SSL Termination Updated Successfully.');
                $scope.actions.toggleStatus.sslTermination = true;
                loadSSLTermination();
            };
            return Lbaas.updateSslTermination(svcParams, params, success, failureHandler).$promise;
        };
         
        /**
         * @ngdoc function
         * @name postEnableSessionPersistence
         * @description 
         * Method make the API call to enable the session persistence for particular Load Balancer
        */
        var postEnableSessionPersistence = function () {
            Status.setLoading('Enabling Session Persistence', { prop: 'updatinglb' });

            var success = function () {
                Status.complete({
                    prop: 'updatinglb'
                });
                Status.setSuccessImmediate('Session Persistence Enabled Successfully.');
                $scope.actions.toggleStatus.sessionPersistence = true;
                loadSessionPersistence();
            };

            var persistenceType = $scope.loadBalancer.protocol === 'HTTP' ?
                PERSISTENCE_TYPE.http : PERSISTENCE_TYPE.nonHttp;
            var params = { 'persistenceType': persistenceType };

            return Lbaas.enableSessionPersistence(svcParams, params, success, failureHandler).$promise;
        };

        /**
         * @ngdoc method
         * @name preAddSslTermination
         * @methodOf loadbalancers:ShowLoadBalancerCtrl
         * @required 
         * modalScope - object containing the API payload fields
         * @description 
         * Method handles adding SSL termination data to LB, if allowed traffic is Secure Traffic only
         * then secure port will be updated with 443 by default, But it can be changed explicitly.
         * showCertificateStatus is always true which says, enabling need certificate.
        */
        var preAddSslTermination = function (modalScope) {

            modalScope.fields = {
                allowedTraffic: LBAAS_CONSTANTS.sslTermination.trafficList[0],
                securePort: '',
                certificate: '',
                privateKey: '',
                intermediateCertificate: '',
                allowedTrafficList: LBAAS_CONSTANTS.sslTermination.trafficList,
                hasExternalNode: false,
                submitText: 'Enable SSL Termination',
                showCertificateStatus: true
            };

            modalScope.changeAction = function () {
                if (modalScope.fields.allowedTraffic.id === 2) {
                    modalScope.fields.securePort = 443;
                } else {
                    modalScope.fields.securePort = '';
                }
            };
        };
       
        // Public actions using revealing module pattern
        $scope.actions = {
            postChangeName: postChangeName,
            postUpdateHealthMonitor: postUpdateHealthMonitor,
            preUpdateHealthMonitor: preUpdateHealthMonitor,
            postDisableHealthMonitor: postDisableHealthMonitor,
            postDeleteLoadBalancer: postDeleteLoadBalancer,
            preAddConnectionThrottle: preAddConnectionThrottle,
            postAddConnectionThrottle: postAddConnectionThrottle,
            postDisableConnectionThrottle: postDisableConnectionThrottle,
            postToggleContentCaching: postToggleContentCaching,
            postToggleLogConnection: postToggleLogConnection,
            postAddTemporaryRateLimit: postAddTemporaryRateLimit,
            preUpdateTemporaryRateLimit: preUpdateTemporaryRateLimit,
            postUpdateTemporaryRateLimit: postUpdateTemporaryRateLimit,
            postDeleteVip: postDeleteVip,
            callEditMethod: callEditMethod,
            hookModalSettings: hookModalSettings,
            toggleStatus: toggleStatus,
            postAddVirtualIp: postAddVirtualIp,
            preEditErrorPage: preEditErrorPage,
            postEditErrorPage: postEditErrorPage,
            preAddCloudServers: preAddCloudServers,
            postAddCloudServers: postAddCloudServers,
            preEditNode: preEditNode,
            postEditNode: postEditNode,
            deleteNode: deleteNode,
            getNodeUrl: getNodeUrl,
            postAddExternalNodes: postAddExternalNodes,
            addToExternalNodeList: addToExternalNodeList,
            removeFromExternalNodeList: removeFromExternalNodeList,
            preSuspendModalHook: preSuspendModalHook,
            postSuspendModalHook: postSuspendModalHook,
            preMoveHostModalHook: preMoveHostModalHook,
            postMoveHostModalHook: postMoveHostModalHook,
            preEditLoadBalancerDetails: preEditLoadBalancerDetails,
            postEditLoadBalancerDetails: postEditLoadBalancerDetails,
            postDisableSessionPersistence: postDisableSessionPersistence,
            postEnableSessionPersistence: postEnableSessionPersistence,
            preAddAccessRule: preAddAccessRule,
            postAddAccessRule: postAddAccessRule,
            addToAccessListNodes: addToAccessListNodes,
            removeFromAccessListNodes: removeFromAccessListNodes,
            postDisableSslTermination: postDisableSslTermination,
            preAddSslTermination: preAddSslTermination,
            postAddSslTermination: postAddSslTermination
        };

        $scope.syncLoadBalancer = function () {

            Status.setLoading('Syncing Load Balancer', { prop: 'syncingloadbalancer' });

            var success = function () {
                Status.complete({ prop: 'syncingloadbalancer' });
                Status.setSuccessImmediate('Syncing is complete for Load Balancer');
                loadDetails();
            };

            var failure = function (error) {
                Status.complete({ prop: 'syncingloadbalancer' });
                Status.setError('Error Syncing Load Balancer: ' + error.status + ' - ' + error.statusText);
            };

            var resource = Lbaas.syncLoadBalancer(svcParams, success, failure);
            return resource.$promise;
        };

        /*
         * Watch set on loadBalancer.status scope property. When user suspends the loadBalancer
         * most of the hyperlink actions should be set with 'lbaas-disable-link' style to prevent
         * users performing any action. It sets the tooltip information about suspended Lbaas and
         * also sets the lbaasIsSuspended scope variable.
         */
        $scope.$watch('loadBalancer.status', function (value) {
            if (value === 'SUSPENDED') {
                $scope.setDisableStyles = 'lbaas-disable-link';
                $scope.lbaasIsSuspended = true;
                $scope.suspendTooltipText = 'LBaaS is suspended. Unsuspend to take actions.';
            } else {
                $scope.setDisableStyles = '';
                $scope.lbaasIsSuspended = false;
                $scope.suspendTooltipText = '';
            }
        });

        loadDetails();
    })
    .filter('loadBalancerSessionPersistence', function () {
        return function (persistenceString) {
            if (persistenceString === 'HTTP_COOKIE') {
                return 'HTTP Cookie';
            } else if (persistenceString === 'SOURCE_IP') {
                return 'Source IP';
            }
            return 'Disabled';
        };
    });
/**
* @ngdoc controller
* @name loadbalancers.CreateLoadBalancersCtrl
* @requires $scope
* @requires $routeParams
* @requires $q
* @requires $location
* @requires CloudRegions
* @requires Lbaas
* @requires Status
* @requires CloudServerLoaders
* @requires rxPromiseNotifications
* @requires $filter
*/
angular.module('loadbalancers')
    .controller('CreateLoadBalancerCtrl', function ($scope, $routeParams, $q, $location,
                                                    CloudRegions, Lbaas,
                                                    Status, CloudServerLoaders,
                                                    rxPromiseNotifications, $filter) {

        Status.setScope($scope);

        $scope.page = {};
        $scope.failedRequests = [];

        $scope.serverInfo = {
            // A modified representation of the servers returned by the API
            tweakedServers: [],

            // All the IP Addresses of all the cloud servers
            cloudIpAddresses: [],

            // The external nodes that were added
            externalServers: []
        };

        $scope.user = $routeParams.user;
        $scope.accountNumber = $routeParams.accountNumber;
        $scope.request = {
            region: null
        };
        $scope.loadBalancer = {
            timeout: 30,
            selectedServers: [],
            protocol: {},
        };

        $scope.emptyProtocol = function () {
            return _.isEmpty($scope.loadBalancer.protocol);
        };

        $scope.svcParams = {
            user: $scope.user,
            region: $scope.request.region
        };

        $scope.defaultPort = '';

        $scope.virtualIps = [{
            name: 'Public',
            desc: 'Virtual IPs on this Load Balancer are accessible over the Internet.',
            value: 'PUBLIC'
        }, {
            name: 'ServiceNet',
            desc: 'Virtual IPs on this Load Balancer can only be reached from within the Rackspace Cloud ' +
                'data center. Network that traverses between ServiceNet interfaces is not subject to ' +
                'inbound and outbound bandwidth fees.',
            value: 'SERVICENET'
        }, {
            name: 'Shared VIP',
            desc: 'Allows users to share a common address between multiple load balancing configurations. ' +
                'This option is especially useful for customers who want to load balance both HTTP and HTTPS ' +
                'traffic and require a common IP address for DNS purposes. Unique ports must be used for ' +
                'load balancers sharing a Virtual IP.',
            value: 'Shared VIP'
        }];

        $scope.algorithms = [{
            name: 'Random',
            desc: 'Directs traffic to a randomly selected node.',
            value: 'RANDOM',
            weighted: false,
        }, {
            name: 'Round Robin',
            desc: 'Directs traffic in a circular pattern to each node of a load balancer in succession.',
            value: 'ROUND_ROBIN',
            weighted: false,
        }, {
            name: 'Weighted Round Robin',
            desc: 'Directs traffic in a circular pattern to each node of a load balancer in succession, ' +
                'with a larger proportion of requests being serviced by nodes with a greater weight.',
            value: 'WEIGHTED_ROUND_ROBIN',
            weighted: true,
        }, {
            name: 'Least Connections',
            desc: 'Directs traffic to the node with the fewest open connections to the load balancer.',
            value: 'LEAST_CONNECTIONS',
            weighted: false,
        }, {
            name: 'Weighted Least Connections',
            desc: 'Directs traffic to the node with the fewest open connections between the load balancer, ' +
                'nodes with a larger weight will service more connections at any one time.',
            value: 'WEIGHTED_LEAST_CONNECTIONS',
            weighted: true,
        }];

        $scope.sharedVipColumns = [{
            label: 'Name',
            key: 'name'
        }, {
            label: 'IP Address',
            key: 'address'
        }, {
            label: 'Type',
            key: 'type'
        }, {
            label: 'Protocol (Port)',
            key: 'protocol'
        }];

        $scope.conditions = [
            {
                name: 'Enabled',
                desc: 'Able to receive and service traffic from the load balancer',
                val: 'ENABLED'
            },
            {
                name: 'Draining',
                desc: 'Will honor established connections but will not receive new connections',
                val: 'DRAINING'
            },
            {
                name: 'Disabled',
                desc: 'Will not receive or service traffic from the load balancer',
                val: 'DISABLED'
            }
        ];

        $scope.values = [];

        $scope.updateCheckboxes = function (choice) {
            $scope.values = $scope.values || [];
            if (choice.checked) {
                // Branch to uncheck the checkbox
                $scope.values = _.without($scope.values, choice.uniqueAddress);
            } else {
                // Branch to check the checkbox
                $scope.values.push(choice.uniqueAddress);
            }
        };

        $scope.addCloudServers = {
            preHook: function (modalScope) {
                modalScope.isLoading = !tweakedServersPromise.$resolved;
                tweakedServersPromise.then(function (tweakedData) {
                    modalScope.cloudIpAddresses = tweakedData[0];
                });
                tweakedServersPromise.finally(function () {
                    modalScope.isLoading = false;
                });
            },

            postHook: function (fields) {
                $scope.loadBalancer.selectedServers = [];

                _.forEach($scope.serverInfo.tweakedServers, function (server) {
                    // Clear out the previously selected addresses
                    server.addresses = [];
                });

                _.forEach($scope.serverInfo.cloudIpAddresses, function (ipAddress) {
                    if (!ipAddress.checked) {
                        return;
                    }
                    ipAddress.server.addresses.push(ipAddress);
                    if (ipAddress.server.addresses.length === 1) {
                        $scope.loadBalancer.selectedServers.push(ipAddress.server);
                    }
                });

                // We cleared out selectedServers, so re-add all our external servers
                _.forEach($scope.serverInfo.externalServers, function (node) {
                    $scope.loadBalancer.selectedServers.push(node);
                });
                return fields;

            },
        };

        $scope.addExternalNodes = {
            preHook: function (modalScope) {
                modalScope.fields = { host: '', port: $scope.defaultPort };
            },

            postHook: function (fields) {
                /* jshint camelcase:false */
                var id = 'external:' + fields.host + ':' + fields.port;
                var server = makeEmptyServer('', 'External (' + fields.host + ')');
                server.addresses.push(
                    {
                        address: fields.host,
                        port: fields.port,
                        condition: $scope.conditions[0],
                        id: id,
                        uniqueId: id,
                        type: 'External Server',
                        weight: 1,
                        isCloudServer: false,
                        checked: true,
                        server: server
                    }
                );
                $scope.serverInfo.externalServers.push(server);
                $scope.loadBalancer.selectedServers.push(server);

            }
        };

        $scope.removeSelectedIpAddress = function (ipAddress) {
            var server = ipAddress.server;
            ipAddress.checked = false;
            server.addresses.splice(server.addresses.indexOf(ipAddress), 1);
            if (server.addresses.length === 0) {
                server.expanded = false;
                $scope.loadBalancer.selectedServers.splice($scope.loadBalancer.selectedServers.indexOf(server), 1);
            }
        };

        var regionsPromise = CloudRegions.getRegions($scope.user, 'LoadBalancers');
        regionsPromise.then(
           function (regions) {
            $scope.regions = CloudRegions.convert(regions);
            $scope.request.region = $scope.regions[0].value;
        }, function (error) {
            Status.setError('Error loading regions ${message}', error);
            $scope.error = error;
        });

        $scope.$watch('request.region', function () {
            if ($scope.request.region !== null) {
                $scope.svcParams.region = $scope.request.region;
                loadProtocols().finally(function () {
                    Status.complete();
                });
            }
            $scope.loadBalancer.port = '';
        });

        $scope.$watch('loadBalancer.protocol', function () {
            $scope.defaultPort = $scope.loadBalancer.protocol.port;
            $scope.loadBalancer.port = $scope.defaultPort;
            _.forEach(_.flatten([$scope.serverInfo.cloudIpAddresses,
                                $scope.serverInfo.externalServers]), function (address) {
                if (!address.port) {
                    address.port = $scope.defaultPort;

                }
            });

            $scope.sharedVirtualIps = filterLoadBalancers();
        });

        $scope.$watch('loadBalancer.port', function () {
            $scope.sharedVirtualIps = filterLoadBalancers();
        });
        
        $scope.sharedVipDeselected = function () {
            return (!$scope.loadBalancer.sharedVip && $scope.loadBalancer.virtualIp.name === 'Shared VIP');
        };

        var filterByPort = function (value) {
            return $scope.loadBalancer.port !== value.port;
        };

        var filterLoadBalancers = function () {
            // Exclude shared load balancers that match protocol
            $scope.loadBalancer.sharedVip = null;
            return $filter('filter')($scope.availableSharedVips, filterByPort);
        };

        var loadProtocols = function () {
            var loadProtocolsSuccess = function (data) {
                $scope.protocols = data.protocols;
            };

            var loadProtocolsFailure = function (error) {
                $scope.error = error;
                Status.setError('Error loading protocols ${message}', error);
            };

            return Lbaas.getProtocols($scope.svcParams, loadProtocolsSuccess, loadProtocolsFailure).$promise;
        };

        var makeEmptyServer = function (name, type) {
            return { addresses: [],
                    name: name,
                    type: type,
                   };

        };

        var buildTweakedServers = function (servers) {
            // flatten servers from the two results of NextGen/FirstGen calls
            servers = _.flatten(servers);

            // Given the raw server data from the API calls, massage it into something we can use
            // We're going to consider every IP address its own "server". So if a given Cloud Server
            // has three IPs, we'll create three distinct "tweakedServers"
            var tweakedServers = [];
            var allIpAddresses = [];
            _.forEach(servers, function (server) {
                if (server.addresses.length === 0) {
                    return;
                }
                var type = server.gen + '/' + server.flavor.name;
                var newServer = makeEmptyServer(server.name, type);
                tweakedServers.push(newServer);

                _.forEach(server.addresses, function (addressInfo) {
                    var ipAddress = {};
                    ipAddress.name = server.name;
                    ipAddress.type = type;
                    ipAddress.region = server.region;
                    ipAddress.id = server.id.toString();
                    /* jshint camelcase:false */
                    ipAddress.address = addressInfo.ip_address;
                    ipAddress.port = $scope.defaultPort;
                    ipAddress.uniqueAddress = ipAddress.id + ':' + ipAddress.address;
                    ipAddress.condition = $scope.conditions[0];
                    ipAddress.weight = 1;
                    ipAddress.isCloudServer = true;
                    ipAddress.checked = false;

                    // Keep a link to the server that this IP comes from
                    ipAddress.server = newServer;

                    allIpAddresses.push(ipAddress);
                });
            });
            return $q.when([allIpAddresses, tweakedServers]);
        };

        var loadServersPromise = $q.all([CloudServerLoaders.loadNextGenServers($routeParams.user, $scope),
                                         CloudServerLoaders.loadFirstGenServers($routeParams.user, $scope)]);
        var tweakedServersPromise = loadServersPromise.then(buildTweakedServers);
        tweakedServersPromise.then(function (tweakedData) {
            // I think this is only needed for testing purposes only
            $scope.serverInfo.cloudIpAddresses = tweakedData[0];
            $scope.serverInfo.tweakedServers = tweakedData[1];
            return tweakedData;
        });
        tweakedServersPromise.finally(function () {
            tweakedServersPromise.$resolved = true;
        });
        tweakedServersPromise.$resolved = false;

        rxPromiseNotifications.add(loadServersPromise, {
            loading: 'Loading Cloud Servers for ' + $scope.user,
            error: 'Error loading Cloud Servers: {{ message || statusText }}'
        });

        $scope.loadVirtualIps = function () {
            // Only load for Shared VIP option
            if ($scope.loadBalancer.virtualIp.name === 'Shared VIP') {
                // Convert data for Shared VIP option table
                var convert = function (loadBalancers) {
                    var optionTableData = [];
                    var virtualIps = _.pluck(loadBalancers, 'virtualIps');
                    /*jshint camelcase: false */
                    _.each(loadBalancers, function (loadBalancer, index) {
                        _.each(virtualIps[index], function (virtualIp) {
                            optionTableData.push({
                                value: virtualIp.id,
                                name: loadBalancer.name,
                                address: virtualIp.ip_address,
                                type: virtualIp.ip_type,
                                protocol: loadBalancer.protocol + ' (' + loadBalancer.port + ')',
                                port: loadBalancer.port,
                                protocolType: loadBalancer.protocol
                            });
                        });
                    });

                    return optionTableData;
                };

                var loadVirtualIpSuccess = function (data) {
                    $scope.availableSharedVips = convert(data.loadBalancers);
                    $scope.sharedVirtualIps = filterLoadBalancers();
                };

                var loadVirtualIpFailure = function (error) {
                    $scope.error = error;
                    Status.setError('Error loading Shared Virtual IPs: ${message}', error);
                };

                $scope.svcParams.region = $scope.request.region;
                return Lbaas.getLoadBalancers($scope.svcParams,
                                                      loadVirtualIpSuccess,
                                                      loadVirtualIpFailure).$promise;
            }
        };

        var setUpRequest = function (loadBalancer) {
            var vipType = loadBalancer.virtualIp.value;
            var virtualIps = [ { type: vipType } ];

            // API expects id instead of type for Shared VIP
            if (vipType === 'Shared VIP') {
                virtualIps = [ { id: loadBalancer.sharedVip } ];
            }

            var port = loadBalancer.port ? loadBalancer.port : loadBalancer.protocol.port;

            var nodes = [];

            _.forEach(loadBalancer.selectedServers, function (tweakedServer) {
                _.forEach(tweakedServer.addresses, function (address) {
                    if (!address.checked) {
                        return;
                    }
                    var node = {};
                    /*jshint camelcase: false */
                    node.address = address.address;
                    node.port = address.port;
                    node.condition = address.condition.val;
                    if (loadBalancer.algorithm.weighted) {
                        node.weight = address.weight;
                    }
                    nodes.push(node);
                });

            });

            var payload =  {
                name: loadBalancer.name,
                region: loadBalancer.region,
                virtualIps: virtualIps,
                protocol: loadBalancer.protocol.name,
                port: port,
                algorithm: loadBalancer.algorithm.value,
                timeout: loadBalancer.timeout
            };

            payload.nodes = nodes;

            return payload;
        };
 
        $scope.submit = function () {
            Status.setLoading('Creating load balancer...');
            var createSuccess = function (data) {
                var loadBalancer = data.loadBalancer;

                Status.setSuccessNext('Load Balancer Created');
                $location.path($scope.accountNumber + '/' + $scope.user +
                    '/loadbalancers/' + $scope.request.region + '/' + loadBalancer.id);
            };

            var createFailure = function (error) {
                $scope.error = error;
                Status.setError('Error creating load balancer: ${message}', error);
            };

            var createDetails = setUpRequest($scope.loadBalancer);

            Lbaas.createLoadBalancer($scope.svcParams, createDetails, createSuccess, createFailure);
        };

        $scope.cancel = function () {
            $location.path('/' + $scope.accountNumber + '/' + $scope.user + '/loadbalancers');
        };
    });

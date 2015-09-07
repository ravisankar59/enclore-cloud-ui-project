/**
* @ngdoc service
* @name loadbalancers.LbaasRoute
* @requires CLOUD_API_URL_BASE
*/

angular.module('loadbalancers')
    .factory('LbaasRoute', function (CLOUD_API_URL_BASE) {
        return CLOUD_API_URL_BASE + '/users/:user/lbaas/:region/:id/:details/:detailId/:innerDetails';
    })
    /**
    * @ngdoc service
    * @name loadbalancers.Lbaas
    * @requires $resource
    * @requires LbaasRoute
    * @requires LoadBalancerTransforms
    */
    .factory('Lbaas', function ($resource, LbaasRoute, LoadBalancerTransforms) {
        return $resource(LbaasRoute, {
            user: '@user',
            region: '@region',
            id: '@id',
            detailId: '@detailId'
        }, {
            getLoadBalancers: {
                method: 'GET',
                transformResponse: LoadBalancerTransforms.getLoadBalancers
            },
            disableSessionPersistence: {
                method: 'DELETE',
                params: {
                    details: 'sessionpersistence'
                }
            },
            enableSessionPersistence: {
                method: 'PUT',
                params: {
                    details: 'sessionpersistence'
                }
            },
            getHosts: {
                method: 'GET',
                params: {
                    details: 'clusters',
                    innerDetails: 'hosts'
                }
            },
            assignHost: {
                method: 'PUT',
                params: {
                    details: 'reassign_hosts',
                }
            },
            updateLoadBalancer: {
                method: 'PUT'
            },
            suspendLoadBalancer: {
                method: 'POST',
                params: {
                    details: 'suspend'
                }
            },
            unSuspendLoadBalancer: {
                method: 'DELETE',
                params: {
                    details: 'suspend'
                }
            },
            addBulkNodes: {
                method: 'POST',
                params: {
                    details: 'nodes'
                }
            },
            getErrorPage: {
                method: 'GET',
                params: {
                    details: 'errorpage'
                }
            },
            changeErrorPage: {
                method: 'PUT',
                params: {
                    details: 'errorpage'
                }
            },
            deleteErrorPage: {
                method: 'DELETE',
                params: {
                    details: 'errorpage'
                }
            },
            getSSLTermination: {
                method: 'GET',
                params: {
                    details: 'ssltermination'
                }
            },
            disableSslTermination: {
                method: 'DELETE',
                params: {
                    details: 'ssltermination'
                }
            },
            updateSslTermination: {
                method: 'PUT',
                params: {
                    details: 'ssltermination'
                },
                contentType: 'application/text'
            },
            getContentCaching: {
                method: 'GET',
                params: {
                    details: 'contentcaching'
                }
            },
            getHealthMonitor: {
                method: 'GET',
                params: {
                    details: 'healthmonitor'
                }
            },
            updateHealthMonitor: {
                method: 'PUT',
                params: {
                    details: 'healthmonitor'
                },
                transformRequest: LoadBalancerTransforms.updateHealthMonitor
            },
            disableHealthMonitor: {
                method: 'DELETE',
                params: {
                    details: 'healthmonitor'
                }
            },
            getAccessList: {
                method: 'GET',
                params: {
                    details: 'accesslist'
                }
            },
            deleteAccessId: {
                method: 'DELETE',
                params: {
                    details: 'accesslist'
                }
            },
            addAccessControlList: {
                method: 'POST',
                params: {
                    details: 'accesslist'
                }
            },
            getConnectionThrottle: {
                method: 'GET',
                params: {
                    details: 'connectionthrottle'
                }
            },
            addUpdateConnectionThrottle: {
                method: 'PUT',
                params: {
                    details: 'connectionthrottle'
                }
            },
            disableConnectionThrottle: {
                method: 'DELETE',
                params: {
                    details: 'connectionthrottle'
                }
            },
            getProtocols: {
                method: 'GET',
                params: {
                    details: 'protocols'
                }
            },
            getSessionPersistence: {
                method: 'GET',
                params: {
                    details: 'sessionpersistence'
                }
            },
            createLoadBalancer: {
                method: 'POST'
            },
            changeName: {
                method: 'PUT'
            },
            getLogConnections: {
                method: 'GET',
                params: {
                    details: 'connectionlogging'
                }
            },
            updateLogConnections: {
                method: 'PUT',
                params: {
                    details: 'connectionlogging'
                }
            },
            updateContentCaching: {
                method: 'PUT',
                params: {
                    details: 'contentcaching'
                }
            },
            addVirtualip: {
                method: 'POST',
                params: {
                    details: 'admin_virtualips'
                }
            },
            addTemporaryRateLimit: {
                method: 'POST',
                params: {
                    details: 'ratelimit'
                },
                contentType: 'application/json'
            },
            updateTemporaryRateLimit: {
                method: 'PUT',
                params: {
                    details: 'ratelimit'
                },
                contentType: 'application/json'
            },
            delete: {
                method: 'DELETE'
            },
            deleteVip: {
                method: 'DELETE',
                params: {
                    details: 'virtualips'
                }
            },
            syncLoadBalancer: {
                method: 'PUT',
                params: {
                    details: 'sync'
                }
            },
            addExternalNodes: {
                method: 'POST',
                params: {
                    details: 'nodes'
                }
            },
            getHistoricalUsage: {
                method: 'GET',
                params: {
                    details: 'usage'
                }
            },
            getLoadBalancer: {
                method: 'GET'
            }
        });
    })
    /**
    * @ngdoc service
    * @name loadbalancers.LbaasNodeService
    * @description
    * this factory makes the API request for loadbalancer node's.
    * CLOUD_API_URL_BASE - constant containing base URL
    * @requires user: userid
    * @requires region: region name of loadbalancer
    * @requires id: loadbalancerid
    * @requires nodeid: nodeId
    */
    .factory('LbaasNodeService', function ($resource, CLOUD_API_URL_BASE) {
        var apiPath = CLOUD_API_URL_BASE + '/users/:user/lbaas/:region/:id/nodes/:nodeid/:details';
        return $resource(apiPath, {
            user: '@user',
            region: '@region',
            id: '@id',
            nodeId: '@nodeid'
        }, {
            updateNode: {
                method: 'PUT'
            },
            getNodeListExtendedView: {
                method: 'GET',
                params: {
                    details: 'extended_view'
                }
            },
            deleteNode: {
                method: 'DELETE'
            },
        });
    })
    .factory('LoadBalancerTransforms', function (HttpTransformUtil, $routeParams) {
        return {
            getLoadBalancers: HttpTransformUtil.getTransformResponse(function (data) {
                _.each(data.loadBalancers, function (loadBalancer) {
                    loadBalancer.url = '/cloud/' + $routeParams.accountNumber + '/' + $routeParams.user +
                        '/loadbalancers/' + loadBalancer.region + '/' + loadBalancer.id;
                });
                return data;
            }),
            updateHealthMonitor: HttpTransformUtil.getTransformRequest(function (data) {
                    data.delay = parseInt(data.delay);
                    data.timeout = parseInt(data.timeout);
                    data.attemptsBeforeDeactivation = parseInt(data.attemptsBeforeDeactivation);
                    return data;
                }
            )
        };
    })
    /**
     * @ngdoc service
     * @name LbaasPermissions
     * @description
     *
     * It is the generic method to identify whether the logged-in user is the member of given
     * group. It uses encore-ui Permission service to determine this.
     */
    .factory('LbaasPermissions', function (Permission) {
        return {
            hasAccess: function (rolesHasAccess) {
                var lstRoles = _.pluck(Permission.getRoles(), 'name');
                return (_.intersection(lstRoles, rolesHasAccess).length > 0);
            }
        };
    })
    /**
    * @ngdoc service
    * @name loadbalancers:LbaasCloudServerService
    * @description
    * this factory makes the API request for loadbalancer firstgen servers and account servers.
    * CLOUD_API_URL_BASE - constant containing base URL
    * @requires user: userid
    */
    .factory('LbaasCloudServerService', function ($resource, CLOUD_API_URL_BASE) {
        var apiPath = CLOUD_API_URL_BASE + '/users/:user/:firstgen/servers/:details';
        return $resource(apiPath, {
            user: '@user',
        }, {
            getFirstGenServers: {
                method: 'GET',
                params: {
                    details: 'lite',
                    firstgen: 'firstgen'
                }
            },
            getAccountServers: {
                method: 'GET',
                params: {
                    details: 'account_servers'
                }
            }
        });
    })
    .constant('ALGORITHMS', {
        /*jshint -W101*/
        algorithmList: [{
            description: 'Directs traffic to a randomly selected node.',
            name: 'Random',
            value: 'RANDOM'
        },
        {
            description: 'Directs traffic in a circular pattern to each node for a load balancer in succession.',
            name: 'Round Robin',
            value: 'ROUND_ROBIN'
        },
        {
            description: 'Directs traffic in a circular pattern to each node of a load balancer in succession, with a larger portion of requests being served by nodes with a greater weight.',
            name: 'Weighted Round Robin',
            value: 'WEIGHTED_ROUND_ROBIN'
        },
        {
            description: 'Directs traffic to the node with the fewest open connections to the load balancer.',
            name: 'Least Connections',
            value: 'LEAST_CONNECTIONS'
        },
        {
            description: 'Directs traffic to the node with the fewest open connections between the load balancer. Nodes with a larger weight will service more connections at any one time.',
            name: 'Weighted Least Connections',
            value: 'WEIGHTED_LEAST_CONNECTIONS'
        }]
        /*jshint +W101*/
    })
    .constant('TOGGLE_SWITCH', {
        settingsParameters: [{
            settingName: 'connectionThrottle',
            disable:
            {
                preHook: '',
                postHook: 'actions.postDisableConnectionThrottle()',
                templateUrl: 'views/lbaas/templates/disable-connection-throttle.html'
            },
            enable:
            {
                preHook: 'actions.preAddConnectionThrottle(this)',
                postHook: 'actions.postAddConnectionThrottle(fields)',
                templateUrl: 'views/lbaas/templates/add-connection-throttle.html'
            }
        },
        {
            settingName: 'healthMonitor',
            disable:
            {
                preHook: '',
                postHook:'actions.postDisableHealthMonitor(loadBalancer)',
                templateUrl: 'views/lbaas/templates/disable-health-monitoring.html'
            },
            enable:
            {
                preHook: 'actions.preUpdateHealthMonitor(this)',
                postHook: 'actions.postUpdateHealthMonitor(fields)',
                templateUrl: 'views/lbaas/templates/enable-health-monitoring.html'
            }
        },
        {
            settingName: 'contentCaching',
            disable:
            {
                preHook: '',
                postHook: 'actions.postToggleContentCaching(loadBalancer)',
                templateUrl: 'views/lbaas/templates/disable-content-caching.html'
            },
            enable:
            {
                preHook: '',
                postHook: 'actions.postToggleContentCaching(loadBalancer)',
                templateUrl: 'views/lbaas/templates/enable-content-caching.html'
            }
        },
        {
            settingName: 'connectionLogging',
            disable:
            {
                preHook: '',
                postHook: 'actions.postToggleLogConnection(loadBalancer)',
                templateUrl: 'views/lbaas/templates/disable-connection-logging.html'
            },
            enable:
            {
                preHook: '',
                postHook: 'actions.postToggleLogConnection(loadBalancer)',
                templateUrl: 'views/lbaas/templates/enable-connection-logging.html'
            }
        },
        {
            settingName: 'rateLimit',
            disable:
            {
                preHook: 'TO BE IMPLEMENTED',
                postHook: 'TO BE IMPLEMENTED',
                templateUrl: 'TO BE IMPLEMENTED'
            },
            enable:
            {
                preHook: '',
                postHook: 'actions.postAddTemporaryRateLimit(fields)',
                templateUrl: 'views/lbaas/templates/add-temporary-ratelimit.html'
            },
            edit:
            {
                preHook: 'actions.preUpdateTemporaryRateLimit(this)',
                postHook: 'actions.postUpdateTemporaryRateLimit(fields)',
                templateUrl: 'views/lbaas/templates/add-temporary-ratelimit.html'
            }
        },
        {
            settingName: 'sslTermination',
            disable:
            {
                preHook: '',
                postHook: 'actions.postDisableSslTermination()',
                templateUrl: 'views/lbaas/templates/disable-ssl-termination.html'
            },
            enable:
            {
                preHook: 'actions.preAddSslTermination(this)',
                postHook: 'actions.postAddSslTermination(fields)',
                templateUrl: 'views/lbaas/templates/add-ssl-termination.html'
            },
            edit:
            {
                preHook: '',
                postHook: '',
                templateUrl: ''
            }
        },
        {
            settingName: 'sessionPersistence',
            disable:
            {
                preHook: '',
                postHook: 'actions.postDisableSessionPersistence()',
                templateUrl: 'views/lbaas/templates/disable-session-persistence.html'
            },
            enable:
            {
                preHook: '',
                postHook: 'actions.postEnableSessionPersistence()',
                templateUrl: 'views/lbaas/templates/enable-session-persistence.html'
            }
        }],
        toggleStatus: {
                connectionLogging: false,
                connectionThrottle: false,
                healthMonitor: false,
                contentCaching: false,
                sslTermination: false,
                sessionPersistence: false,
                rateLimit: false
            }
        })
    .constant('LOAD_BALANCER_VIP_TYPES', [
            { id: 'Public', name: 'PUBLIC' },
            { id: 'ServiceNet', name: 'SERVICENET' }
        ])
    .constant('LOAD_BALANCER_ADD_VIP_ROLES', [
            'lbaas_support'
        ])
    .constant('LOAD_BALANCER_ROLES',
            { unsuspend: ['lbaas_support'],
              suspend: ['lbaas_support'],
              removeNode: ['nebops', 'lbaas_admins', 'lbaas_support'] }
        )
    .constant('PERSISTENCE_TYPE', {
            http: 'HTTP_COOKIE',
            nonHttp: 'SOURCE_IP'
        })
    .constant('ERROR_PAGE_CONTENT', {
            defaultErrorPageContent: '<html><head><meta http-equiv=&quot;' +
            'Content-Type&quot; content=&quot;' +
            'text/html;charset=utf-8&quot;><title>Service h1 {font-family: Verdana,' +
            ' Arial, Helvetica, sans-serif;}h2 {font-family: Arial, Helvetica, ' +
            'sans-serif;color: #b10b29;}</style></head><body><h2>Service Unavailable</h2>' +
            '<p>The service is temporarily unavailable. Please try again later.</p></body>' +
            '</html>'
        })
    .constant('LBAAS_CONSTANTS',
        {
            sslTermination:
            {
                trafficList: [
                    { name: 'Both secure and insecure traffic', id: 1 },
                    { name: 'Secure Traffic only', id: 2 },
                    { name: 'Insecure Traffic only', id: 3 }
                ]
            }
        }
    );

angular.module('servers')
/**
 * This is the controller for the "Suspend Servers" modal, available from the "Bulk Actions"
 * menu on the Servers page
 */
.controller('rxSuspendServersCtrl', function ($scope, $modalInstance,
                            SuspendUnsuspendCtrlUtil, SuspendServers, SuspendStates) {
    SuspendUnsuspendCtrlUtil.configure({
        scope: $scope,
        title: 'Batch Suspend Servers',
        states: SuspendStates,
        action: SuspendServers.suspend.bind(SuspendServers),
        actionVerb: 'suspend',
        submittingMsg: 'Authenticating & Suspending Servers',
        submitMsg: 'Authenticate & Suspend Servers',
        modalInstance: $modalInstance
    });
})

/**
 * This is the controller for the "Unsuspend Servers" modal, available from the "Bulk Actions"
 * menu on the Servers page
 */
.controller('rxUnSuspendServersCtrl', function ($scope, $modalInstance, $rootScope,
                            SuspendServers,
                            SuspendUnsuspendCtrlUtil, UnSuspendStates) {

    SuspendUnsuspendCtrlUtil.configure({
        scope: $scope,
        title: 'Batch Unsuspend Servers',
        states: UnSuspendStates,
        action: SuspendServers.unsuspend.bind(SuspendServers),
        actionVerb: 'unsuspend',
        submittingMsg: 'Authenticating & Unsuspending Servers',
        submitMsg: 'Authenticate & Unsuspend Servers',
        modalInstance: $modalInstance
    });
})

/**
 * This factory returns a single function, `configure`, which is used to set up
 * both the rxSuspendServersCtrl and rxUnSuspendServersCtrl controllers. They are
 * functionally almost identical, save for a few parameters. When you call configure,
 * you must pass in a config object, with the following properties:
 *
 *      scope: The scope of the controller
 *      title: The text that should appear at the top of the modal
 *      states: One of SuspendStates or UnSuspendStates, which store unique identifies
 *      action: One of SuspendServers.suspend, or SuspendServers.unsuspend
 *      actionVerb: Either 'suspend' or 'unsuspend', used to populate some text on the modal
 *      submittingMsg: The text to put on the submit button after the user clicks it
 *      submitMsg: The text to put on the submit button before the user clicks it
 *      modalInstance: The $modalInstance for the controller
 *
 * The main purpose of the configuration is to put certain attributes and methods onto
 * the controller scope. These are
 *
 *      mode: One of 'confirm', 'inprogress', or 'complete'
 *            When the modal first opens, the `mode` will be 'confirm'. It will move to 'inprogress'
 *            after they click submit and the actual suspends/unsuspends begin. It will move to 'complete'
 *            when *all* of the servers have either errored out, or successfully completed the suspend/unsuspend
 *            operation. Note that "successfully completed" means we have done a status check on the
 *            server, and it's now in the correct state
 *      title: Set to config.title
 *      infoHeader: This is the header text to be used by the second column in the modal's table.
 *                  This starts as 'UUID' and changes to 'Status' after the user has clicked the submit
 *                  button
 *      infoHeaderProperty: The attribute on the server instances that will be used for sorting the infoHeader column.
 *                          This starts as 'id', to sort by the UUID of the server. After the user clicks submit,
 *                          it changes to 'suspendStatus'
 *      submittingMsg: config.submittingMsg
 *      defaultSubmitMsg: config.submitMsg
 *      actionVerb: config.actionVerb
 *      selectedServers: The set of servers the user selected to suspend/unsuspend. This is a list of objects,
 *                       where each prototypically inherits from one of $scope.servers in ListServersCtrl. By doing
 *                       prototypical inheritance, we can access attributes from the "real" server objects, while
 *                       also adding our own attributes that won't interfere with ListServersCtrl
 *
 *      showPagination: A boolean used in the template, to determine whether or not to show pagination on the table.
 *      serversURL: The URL of the Cloud Servers page, used in the template to give a link for the support racker
 *      submitStatus: An object with `loading` and `disable` attributes, used by the submit button. This is an rxButton,
 *                    so these two attributes are used in the normal way
 *      removeServer: A function used to remove a server from selectedServers, whenever the user clicks the X in the
 *                    table
 *      totalServers: The total number of servers in selectedServers, used to show a "X of Y servers processed" message
 *      numCompleted: The number of servers that have finished suspending/suspending,
 *                    used for "X of Y servers processed"
 *      errorsPresent: Defaults to `false`, will go to `true` if any of the servers failed to
 *                     successfully suspend/unsuspend
 *      submit: The function used to do authentication and kick off the suspend/unsuspend actions
 *      cancel: The function used by the Cancel button, and also by the "Return to Cloud Servers" button that appears
 *              when all server suspend/unsuspends are complete
 *      fields: A container object, used for the `fields.password` model, and also to store all the normal
 *              TableBoilerPlate pagination configuration stuff
 *
 */
.factory('SuspendUnsuspendCtrlUtil', function ($routeParams, $rootScope, $filter, GetCloudURL, TableBoilerplate,
            PageTracking, AdminAuthenticate, Session) {
    var SuspendUnsuspendCtrlUtil = {};

    var selectedServers = function (servers) {
        // Create new server objects, which prototypically inherit from the original ones. This
        // way we don't have to worry about clobbering any values in the original ones
        return _.map(_.where(servers, { rowIsSelected: true, gen: 'Next' }), function (server) {
            var s = Object.create(server);
            s.originalServer = server;
            return s;
        });
    };

    var setDefaultStatus = function (servers, state) {
        _.each(servers, function (server) {
            server.suspendStatus = state;
            server.lastKnownServerStatus = '';
            server.suspendErrorMsg = '';
        });
    };

    var serversURL = GetCloudURL($routeParams.accountNumber, $routeParams.user).servers;

    SuspendUnsuspendCtrlUtil.configure = function (config) {
        var scope = config.scope;

        var itemsPerPage = 8;

        scope.title = config.title;
        scope.mode = 'confirm';
        scope.infoHeader = 'UUID';
        scope.infoHeaderProperty = 'id';
        scope.submittingMsg = config.submittingMsg;
        scope.defaultSubmitMsg = config.submitMsg;
        scope.actionVerb = config.actionVerb;
        scope.selectedServers = selectedServers(scope.servers);
        scope.totalServers = scope.selectedServers.length;
        scope.numCompleted = 0;
        scope.errorsPresent = false;

        scope.showPagination = scope.selectedServers.length > itemsPerPage;

        scope.removeServer = function (server) {
            scope.selectedServers.splice(_.findIndex(scope.selectedServers, function (s) {
                return s.id === server.id;
            }), 1);
            scope.totalServers -= 1;
        };
        scope.serversURL = serversURL;
        setDefaultStatus(scope.selectedServers, config.states.waitingToStart);

        scope.submitStatus = {
            loading: false,
            disable: true
        };

        scope.fields.password = '';

        // We need to redefine the `pager`, to make sure it uses only 8 items per page
        TableBoilerplate.setup(scope.fields, { predicate: 'name', reverse: false });
        scope.fields.pager = PageTracking.createInstance({ itemsPerPage: itemsPerPage });

        var lastStatus = $filter('SuspendServerMsg');
        scope.showLastStatus = function (server) {
            return lastStatus(server) !== '';
        };

        var switchMode = function (adminRegions) {
            scope.mode = 'inprogress';
            scope.infoHeader = 'Status';
            scope.infoHeaderProperty = 'suspendStatus';
            scope.totalServers = scope.selectedServers.length;
            config.action(scope.user, scope.selectedServers, adminRegions)
            .then(function () {
                scope.mode = 'complete';
            }, function () {
                scope.mode = 'complete';
                scope.errorsPresent = true;
            },
            function (numCompleted) {
                scope.numCompleted = numCompleted;
            });
        };

        var stopLoading = function () {
            scope.submitStatus.loading = false;
        };

        scope.submit = function () {
            if (scope.selectedServers.length === 0) {
                return;
            }
            scope.submitStatus.loading = true;
            AdminAuthenticate.authenticate(Session.getUserId(),
                    scope.fields.password,
                    _.unique(_.pluck(scope.selectedServers, 'region')))
            .then(function (data) {
                switchMode(data.access);
                stopLoading();
            }, function () {
                stopLoading();
            });
        };

        scope.cancel = config.modalInstance.dismiss;

        $rootScope.$on('$routeChangeSuccess', config.modalInstance.dismiss);

    };
    return SuspendUnsuspendCtrlUtil;

})

/*
 * This factory provides two methods, `suspend` and `unsuspend`, which each take a
 * list of servers, and an adminRegion mapping, and performs the chosen operation
 * on each server. Optionally, you can pass a single server instead of a list of
 * servers, which will slightly change the return value of the function.
 *
 * The adminRegions is an object mapping ORD, DFW, etc. to the "adminRegion" used
 * by Admin actions. These adminRegions are retrieved by authenticating with the Cloud
 * Admin API, which will return the mapping in its authentication response.
 *
 * Note that our suspend/unsuspend APIs are fairly simplistic. You can tell it to suspend
 * a server, and it will respond with a 200 which means "we have accepted your request to
 * suspend this server". After that, you have to start polling the server's status to find
 * out if the suspend was a success or failure.
 *
 * After the initial suspend/unsuspend request has returned successfully, server.suspendStatus
 * will be set to the `started` value of either SuspendStates or UnSuspendStates. i.e for a suspend,
 * it will result in server.suspendStatus==='suspendStarted'. After it moves to that state, it
 * initiates a poll on that server, to keep checking the status, until the server either returns
 * an error or ends up in the desired state, "ACTIVE", or "SUSPENDED".
 *
 * Both the `SuspendServers.suspend` and `SuspendServers.unsuspend` will return a promise
 * from CloudAllSettled.allSettled, allowing you to do a `.notify()`, whenever a server
 * either fails to suspend/unsuspend, or ends up in the desired state. This promise resolving
 * or rejecting means that *all* servers have completed their operations.
 *
 * If instead of a list of servers you just passed a single server object, then both
 * `SuspendServers.suspend` and `SuspendServers.unsuspend` will return a single promise
 * for that server, instead of a promise from CloudAllSettled.allSettled. This will
 * let you get access to the error directly.
 */
.factory('SuspendServers', function ($timeout, $q, SuspendStates,
            UnSuspendStates, SuspendStatusPoll, NextGenAdmin, CloudAllSettled) {

    var SuspendServers = {};

    // Internal method to support SuspendServers.suspend and SuspendServers.unsuspend
    //      fn - One of NextGenAdmin.suspend or NextGenAdmin.unsuspend
    //      user - The username, ex. hub_cap
    //      servers - A list of server objects to suspend/unsuspend
    //      adminRegions - A mapping from "normal" regions (ORD, DFW, etc). to objects
    //                     with an adminRegion value, i.e.
    //                     { ORD: { adminRegion: 'preprod-ord-rackeradminapi' } }
    //      states - SuspendStates or UnSuspendStates
    //      targetStatus - The status the server needs to be in to indictate it successfully
    //                     completed the intended action. i.e. when suspending, this should be
    //                     "SUSPENDED", and when unsuspending it should be "ACTIVE"
    var action = function (fn, user, servers, adminRegions, states, targetStatus) {
        var promises = [];
        var returnAllSettled = true;

        if (!_.isArray(servers)) {
            // A single server was passed in instead of an array of servers
            returnAllSettled = false;
            servers = [servers];

        }
        _.each(servers, function (server) {
            var deferred = $q.defer();
            var doit = function () {
                var success = function () {
                    server.suspendStatus = states.started;
                    // Start polling this server
                    SuspendStatusPoll.poll(user, server, deferred, states, targetStatus);
                };

                var failure = function (error) {
                    deferred.reject(error);
                    server.suspendStatus = states.error;
                    try {
                        server.suspendErrorMsg = error.data.error.message;
                    } catch (e) {
                        server.suspendErrorMsg = error.statusText;
                    }
                };
                fn({
                    user: user,
                    id: server.id,
                    region: adminRegions[server.region].adminRegion
                }, success, failure);
            };

            // We do the actual work inside of $timeout to prevent the UI
            // from locking. Otherwise this whole `_.each` loop will block
            // everything until it's done sending out all the requests.
            promises.push(deferred.promise);
            $timeout(doit);

        });

        if (returnAllSettled) {
            return CloudAllSettled.allSettled(promises);
        } else {
            return promises[0];
        }

    };

    SuspendServers.suspend = function (user, servers, adminRegions) {
        return action(NextGenAdmin.suspend, user, servers, adminRegions, SuspendStates, 'SUSPENDED');

    };

    SuspendServers.unsuspend = function (user, servers, adminRegions) {
        return action(NextGenAdmin.unsuspend, user, servers, adminRegions, UnSuspendStates, 'ACTIVE');
    };

    return SuspendServers;
})

/**
 * This factory has a single method, `SuspendStatusPoll.poll` which takes:
 *      user: The user (ex. 'hub_cap')
 *      server: The server object we want to poll
 *      deferred: The deferred that should be resolved or rejected when we
 *                will no longer poll (either because the server completed its
 *                operation or failed to successfully complete)
 *      states: One of SuspendStates or UnSuspendStates
 *      targetStatus: The value of `status` on the server that will tell us
 *                    it has successfully completed its operation. If you are
 *                    suspending a server, this should be 'SUSPENDED'. If you
 *                    are unsuspending a server, it should be 'ACTIVE'
 */
.factory('SuspendStatusPoll', function ($timeout, NextGenServers) {
    var SuspendStatusPoll = {};

    // states is one of SuspendStates or UnSuspendStates
    SuspendStatusPoll.poll = function (user, server, deferred, states, targetStatus) {
        var success = function (data) {
            var status = data.status;

            // Update server.status is a status field on an object that prototypically
            // inherits from one of the $scope.servers in ListServersCtrl, and server.originalServer
            // is that server from $scope.servers. We want to update the status on originalServer
            // so the ListServersCtrl table will update automatically
            server.status = status;
            server.originalServer.status = status;
            if (status === targetStatus) {
                server.suspendStatus = states.complete;
                deferred.resolve(status);
            } else {
                server.suspendStatus = states.started;
                // Not actually an error, but there's extra info we want
                // to display to the racker
                server.lastKnownServerStatus = status;
                $timeout(getStatus, 5000);
            }

        };

        var error = function (error) {
            server.suspendStatus = states.error;
            try {
                server.suspendErrorMsg = error.data.error.message;
            } catch (e) {
                server.suspendErrorMsg = error.statusText;
            }
            deferred.reject(error);
        };
        var getStatus = function () {
            return NextGenServers.getStatus({
                user: user,
                id: server.id,
                region: server.region
            }, success, error).$promise;
        };

        $timeout(getStatus, 5000);
    };

    return SuspendStatusPoll;
})

.value('SuspendStates', {
    waitingToStart: 'suspendWaitingToStart',
    started: 'suspendStarted',
    complete: 'suspendComplete',
    error: 'suspendError'
})
.value('UnSuspendStates', {
    waitingToStart: 'unsuspendWaitingToStart',
    started: 'unsuspendStarted',
    complete: 'unsuspendComplete',
    error: 'unsuspendError'
})

/**
 * User readable translations for the values in SuspendStates
 * and UnSuspendStates
 */
.value('SuspendStateText', {
    suspendWaitingToStart: 'Queued to suspend...',
    suspendStarted: 'Suspending...',
    suspendComplete: 'Successfully suspended!',
    suspendError: 'Failed to suspend',
    unsuspendWaitingToStart: 'Queued to unsuspend...',
    unsuspendStarted: 'Unsuspending...',
    unsuspendComplete: 'Successfully unsuspended!',
    unsuspendError: 'Failed to unsuspend'
})

/**
 * A set of methods for checking where in the suspend/unsuspend process a
 * particular server is. You can check if the process is:
 *
 *      waitingToStart: The default `suspendStatus` for servers, when the modal
 *                      first loads
 *      started: Set when we have successfully submitted a request to suspend/unsuspend
 *               the server
 *      complete: When the server has moved to its final state
 *      error: When something went wrong
 */
.factory('SuspendStateUtils', function (SuspendStates, UnSuspendStates) {
    var SuspendStateUtils = {};

    SuspendStateUtils.complete = function (server) {
        var status = server.suspendStatus;
        return (status === SuspendStates.complete || status === UnSuspendStates.complete);
    };

    SuspendStateUtils.waitingToStart = function (server) {
        var status = server.suspendStatus;
        return (status === SuspendStates.waitingToStart || status === UnSuspendStates.waitingToStart);
    };

    SuspendStateUtils.started = function (server) {
        var status = server.suspendStatus;
        return (status === SuspendStates.started || status === UnSuspendStates.started);
    };

    SuspendStateUtils.error = function (server) {
        var status = server.suspendStatus;
        return (status === SuspendStates.error || status === UnSuspendStates.error);
    };

    return SuspendStateUtils;
})

/**
 * A filter that takes a server object as its input, and turns its
 * `suspendStatus` value into a user-readable string
 */
.filter('SuspendServerText', function (SuspendStateText) {
    return function (server) {
        return SuspendStateText[server.suspendStatus] || 'Unknown State';
    };
})

/**
 * When suspend/unsuspends are in progress, we show information from the API in the modal table. If
 * no error has occurred, this shows the current status of the server. If an error has occurred, we
 * want to show the error instead. This filter takes in a server, and returns the appropriate status
 * or error.
 */
.filter('SuspendServerMsg', function (SuspendStateUtils) {
    return function (server) {
        // If there is currently an error on the server, return that
        // Otherwise return the current status, if we have one
        if (server.suspendErrorMsg) {
            return server.suspendErrorMsg;
        } else if (server.lastKnownServerStatus && !SuspendStateUtils.complete(server)) {
            return 'Current Status: ' + server.lastKnownServerStatus;
        }
        return '';

    };
})

/**
 * Given a server, return the correct FontAwesome icon for its current status.
 */
.filter('SuspendServerIcon', function (SuspendStateUtils) {
    return function (server) {
        if (SuspendStateUtils.complete(server)) {
            return 'fa-check-circle-o';
        } else if (SuspendStateUtils.error(server)) {
            return 'fa-ban';
        }
        return '';
    };
})

/**
 * A filter that returns the correct CSS class to be used to wrap server's status
 * text, while the suspend/unsuspend is in progress
 */
.filter('SuspendServerClass', function (SuspendStateUtils) {
    return function (server) {
        if (SuspendStateUtils.complete(server)) {
            return 'server-suspend-success';
        } else if (SuspendStateUtils.error(server)) {
            return 'server-suspend-error';
        } else if (SuspendStateUtils.started(server) || SuspendStateUtils.waitingToStart(server)) {
            return 'server-suspend-inprogress';
        }
        return '';
    };
});

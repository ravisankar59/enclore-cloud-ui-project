// jscs:disable disallowDanglingUnderscores
describe('Controller: rxSuspendServersCtrl', function () {
    var scope, $httpBackend, $timeout, ctrl, novaAdmin, nextGenAdmin, instanceMock, statusMock;

    var routeParams = {
        'user': 'admin',
        'accountNumber': '323676',
    };

    var server = {
        name: 'Test Server',
        id: 123,
        status: 'ACTIVE'
    };

    var fields = {
        password: 'pass'
    };

    var authResponse = {
        'access': {
            'ORD': {
                'adminRegion': 'preprod-ord-rackeradminapi'
            }
        }
    };

    beforeEach(function () {
        module('encore.ui');
        module('encore.svcs.cloud.config');
        module('servers');

        inject(function (_$httpBackend_, $controller, $rootScope, $route, $routeParams,
                         _$timeout_, NovaAdmin, NextGenAdmin) {
            $httpBackend = _$httpBackend_;
            $timeout = _$timeout_;
            scope = $rootScope.$new();
            novaAdmin = NovaAdmin;
            nextGenAdmin = NextGenAdmin;
            scope.server = server;
            scope.fields = fields;
            scope.user = 'admin';

            scope.servers = [
                { id: 'server1', rowIsSelected: true, gen: 'Next', region: 'ORD' },
                { id: 'server2', rowIsSelected: true, gen: 'Next', region: 'ORD' },
                { id: 'server3_FirstGen', rowIsSelected: true, gen: 'First', region: 'DFW' }
            ];

            var instanceApi = {
                close: function () {},
                dismiss: function () {}
            };
            instanceMock = sinon.mock(instanceApi);

            var statusApi = {
                setSuccessNext: function () {},
                setError: function () {}
            };
            statusMock = sinon.mock(statusApi);

            sinon.spy(novaAdmin, 'authenticate');
            sinon.spy(nextGenAdmin, 'suspend');
            sinon.spy(nextGenAdmin, 'unsuspend');

            ctrl = $controller('rxSuspendServersCtrl', {
                $scope: scope,
                $route: $route,
                $routeParams: routeParams,
                $modalInstance: instanceApi,
                NextGenAdmin: nextGenAdmin,
                Status: statusApi
            });
        });

    });

    it('should only have next gen servers in selectedServers', function () {
        expect(scope.selectedServers.length).to.equal(2);
        expect(scope.selectedServers[0].gen).to.equal('Next');
        expect(scope.selectedServers[1].gen).to.equal('Next');
    });

    it('should allow servers to be removed', function () {
        var server = scope.selectedServers[0];
        scope.removeServer(server);
        expect(scope.selectedServers).to.not.contain(server);
    });

    it('should not try to authenticate if all servers are removed', function () {
        scope.removeServer(scope.selectedServers[0]);
        scope.removeServer(scope.selectedServers[0]);
        scope.submit();
        expect(novaAdmin.authenticate.callCount).to.equal(0);
    });

    it('should authenticate when servers are present', function () {
        expect(scope.mode).to.equal('confirm');
        $httpBackend.expectPOST('/api/cloud/admin/nova/authenticate').respond(200, authResponse);
        scope.submit();
        $httpBackend.flush();
        expect(scope.mode).to.equal('inprogress');
    });

    it('should suspend every selected server when authentication is successful', function () {
        $httpBackend.expectPOST('/api/cloud/admin/nova/authenticate').respond(200, authResponse);
        scope.submit();

        // This makes me angry, but here's the situation: The first $httpBackend.flush() is to
        // kick off the authentication request. Then we set up two eventual suspend call requests. But
        // those won't happen until we do a $timeout.flush(), because they're each done within their
        // own timeout. Once we call $timeout.flush(), we can follow up with the $httpBackend.flush()
        // to send the suspend calls.
        $httpBackend.flush();
        $httpBackend.expectPOST(
            '/api/cloud/users/admin/nova/preprod-ord-rackeradminapi/server1/suspend').respond(200, {});
        $httpBackend.expectPOST(
            '/api/cloud/users/admin/nova/preprod-ord-rackeradminapi/server2/suspend').respond(200, {});
        $timeout.flush();
        $httpBackend.flush();

        var suspendParams1 = { id: 'server1', region: 'preprod-ord-rackeradminapi', user: 'admin' };
        var suspendParams2 = { id: 'server2', region: 'preprod-ord-rackeradminapi', user: 'admin' };
        expect(nextGenAdmin.suspend.callCount).to.equal(2);
        sinon.assert.calledWith(nextGenAdmin.suspend, suspendParams1);
        sinon.assert.calledWith(nextGenAdmin.suspend, suspendParams2);

        $httpBackend.expectGET(
            '/api/cloud/users/admin/servers/ORD/server1/status').respond(200, { 'status': 'SUSPENDED' });
        $httpBackend.expectGET(
            '/api/cloud/users/admin/servers/ORD/server2/status').respond(200, { 'status': 'SUSPENDED' });
        $timeout.flush();
        $httpBackend.flush();

        expect(scope.mode).to.equal('complete');
    });

    it('should only switch modes when authentication is successful', function () {
        expect(scope.mode).to.equal('confirm');
        $httpBackend.expectPOST('/api/cloud/admin/nova/authenticate').respond(403, {});
        scope.submit();
        $httpBackend.flush();

        expect(scope.mode).to.equal('confirm');
    });
});

describe('Factory: SuspendServers/SuspendStatusPoll', function () {

    var $httpBackend, $route, SuspendServers, SuspendStatusPoll, $timeout, $rootScope, $q,
        SuspendStates, UnSuspendStates;

    var servers = [
        { id: 'ORD_server', region: 'ORD', originalServer: {} },
        { id: 'DFW_server', region: 'DFW', originalServer: {} }
    ];

    var adminRegions = {
        ORD: { adminRegion: 'preprod-ord-rackeradminapi' },
        DFW: { adminRegion: 'preprod-dfw-rackeradminapi' }
    };

    beforeEach(function () {
        module('encore.ui');
        module('encore.svcs.cloud.config');
        module('servers');

        inject(function (_$httpBackend_, _$route_, _$timeout_, _$q_,
                         _$rootScope_, _SuspendServers_, _SuspendStatusPoll_,
                         _SuspendStates_, _UnSuspendStates_) {
            $httpBackend = _$httpBackend_;
            $route = _$route_;
            SuspendServers = _SuspendServers_;
            $timeout = _$timeout_;
            $rootScope = _$rootScope_;
            $q = _$q_;
            SuspendStatusPoll = _SuspendStatusPoll_;
            SuspendStates = _SuspendStates_;
            UnSuspendStates = _UnSuspendStates_;

        });
    });

    it('should poll for an updated status', function () {
        var deferred = $q.defer();
        var resolvedStatus;

        deferred.promise.then(function (value) { resolvedStatus = value; });

        SuspendStatusPoll.poll('hub_cap', servers[0], deferred, SuspendStates, 'SUSPENDED');
        $httpBackend.expectGET(
            '/api/cloud/users/hub_cap/servers/ORD/ORD_server/status').respond(200, { 'status': 'SUSPENDED' });
        $timeout.flush();
        $httpBackend.flush();

        $rootScope.$apply();
        expect(resolvedStatus).to.equal('SUSPENDED');

    });

    it('should poll until it gets the final status', function () {
        var deferred = $q.defer();
        var resolvedStatus;

        deferred.promise.then(function (value) { resolvedStatus = value; });

        SuspendStatusPoll.poll('hub_cap', servers[0], deferred, SuspendStates, 'SUSPENDED');
        $httpBackend.expectGET(
            '/api/cloud/users/hub_cap/servers/ORD/ORD_server/status').respond(200, { 'status': 'ACTIVE' });
        $timeout.flush();
        $httpBackend.flush();

        $httpBackend.expectGET(
            '/api/cloud/users/hub_cap/servers/ORD/ORD_server/status').respond(200, { 'status': 'SUSPENDED' });
        $timeout.flush();
        $httpBackend.flush();

        $rootScope.$apply();
        expect(resolvedStatus).to.equal('SUSPENDED');
        expect(servers[0].status).to.equal('SUSPENDED');
        expect(servers[0].originalServer.status).to.equal('SUSPENDED');

    });

    it('should handle errors in polling', function () {
        var deferred = $q.defer();
        var resolvedStatus;

        deferred.promise.then(null, function (error) { resolvedStatus = error.data.error.data.error.message; });

        SuspendStatusPoll.poll('hub_cap', servers[0], deferred, SuspendStates, 'SUSPENDED');
        $httpBackend.expectGET(
            '/api/cloud/users/hub_cap/servers/ORD/ORD_server/status').respond(404,
                { error: { data: { error: { 'message': 'Unknown server' }}}});
        $timeout.flush();
        $httpBackend.flush();

        $rootScope.$apply();
        expect(resolvedStatus).to.equal('Unknown server');
    });

    it('should suspend a list of servers', function () {
        $httpBackend.expectPOST(
            '/api/cloud/users/hub_cap/nova/preprod-ord-rackeradminapi/ORD_server/suspend').respond(200, {});
        $httpBackend.expectPOST(
            '/api/cloud/users/hub_cap/nova/preprod-dfw-rackeradminapi/DFW_server/suspend').respond(200, {});

        var done = false;
        var notifyCount;
        var promise = SuspendServers.suspend('hub_cap', servers, adminRegions);
        promise.then(function () { done = true; }, null,
                    function notify (count) { notifyCount = count; });

        $timeout.flush();
        $httpBackend.flush();

        // Set up the polling checks
        $httpBackend.expectGET(
            '/api/cloud/users/hub_cap/servers/ORD/ORD_server/status').respond(200, { 'status': 'SUSPENDED' });
        $httpBackend.expectGET(
            '/api/cloud/users/hub_cap/servers/DFW/DFW_server/status').respond(200, { 'status': 'SUSPENDED' });
        $timeout.flush();
        $httpBackend.flush();

        $rootScope.$apply();
        expect(done).to.be.true;
        expect(notifyCount).to.equal(2);
        expect(servers[0].status).to.equal('SUSPENDED');
        expect(servers[1].status).to.equal('SUSPENDED');

    });

    it('should not use CloudAllSettled for a single server', function () {
        $httpBackend.expectPOST(
            '/api/cloud/users/hub_cap/nova/preprod-ord-rackeradminapi/ORD_server/suspend').respond(200, {});

        var resolvedVal;
        var promise = SuspendServers.suspend('hub_cap', servers[0], adminRegions);
        promise.then(function (val) { resolvedVal = val; });

        $timeout.flush();
        $httpBackend.flush();

        // Set up the polling checks
        $httpBackend.expectGET(
            '/api/cloud/users/hub_cap/servers/ORD/ORD_server/status').respond(200, { 'status': 'SUSPENDED' });
        $timeout.flush();
        $httpBackend.flush();

        $rootScope.$apply();
        expect(resolvedVal).to.equal('SUSPENDED');
        expect(servers[0].status).to.equal('SUSPENDED');
    });
});

describe('Factory: SuspendStateUtils', function () {
    var SuspendStateUtils, SuspendStates, UnSuspendStates;

    var server;

    beforeEach(function () {
        module('servers');

        inject(function (_SuspendStateUtils_, _SuspendStates_, _UnSuspendStates_) {
            SuspendStateUtils = _SuspendStateUtils_;
            SuspendStates = _SuspendStates_;
            UnSuspendStates = _UnSuspendStates_;

        });
        server = {};
    });

    it('should detect the complete suspend state', function () {
        server.suspendStatus = SuspendStates.complete;

        expect(SuspendStateUtils.complete(server)).to.be.true;
        expect(SuspendStateUtils.waitingToStart(server)).to.be.false;
        expect(SuspendStateUtils.started(server)).to.be.false;
        expect(SuspendStateUtils.error(server)).to.be.false;
    });

    it('should detect the complete unsuspend state', function () {
        server.suspendStatus = UnSuspendStates.complete;

        expect(SuspendStateUtils.complete(server)).to.be.true;
        expect(SuspendStateUtils.waitingToStart(server)).to.be.false;
        expect(SuspendStateUtils.started(server)).to.be.false;
        expect(SuspendStateUtils.error(server)).to.be.false;
    });

    it('should detect the waitingToStart suspend state', function () {
        server.suspendStatus = SuspendStates.waitingToStart;

        expect(SuspendStateUtils.complete(server)).to.be.false;
        expect(SuspendStateUtils.waitingToStart(server)).to.be.true;
        expect(SuspendStateUtils.started(server)).to.be.false;
        expect(SuspendStateUtils.error(server)).to.be.false;
    });

    it('should detect the waitingToStart unsuspend state', function () {
        server.suspendStatus = UnSuspendStates.waitingToStart;

        expect(SuspendStateUtils.complete(server)).to.be.false;
        expect(SuspendStateUtils.waitingToStart(server)).to.be.true;
        expect(SuspendStateUtils.started(server)).to.be.false;
        expect(SuspendStateUtils.error(server)).to.be.false;
    });

    it('should detect the started suspend state', function () {
        server.suspendStatus = SuspendStates.started;

        expect(SuspendStateUtils.complete(server)).to.be.false;
        expect(SuspendStateUtils.waitingToStart(server)).to.be.false;
        expect(SuspendStateUtils.started(server)).to.be.true;
        expect(SuspendStateUtils.error(server)).to.be.false;
    });

    it('should detect the started unsuspend state', function () {
        server.suspendStatus = UnSuspendStates.started;

        expect(SuspendStateUtils.complete(server)).to.be.false;
        expect(SuspendStateUtils.waitingToStart(server)).to.be.false;
        expect(SuspendStateUtils.started(server)).to.be.true;
        expect(SuspendStateUtils.error(server)).to.be.false;
    });

    it('should detect the error suspend state', function () {
        server.suspendStatus = SuspendStates.error;

        expect(SuspendStateUtils.complete(server)).to.be.false;
        expect(SuspendStateUtils.waitingToStart(server)).to.be.false;
        expect(SuspendStateUtils.started(server)).to.be.false;
        expect(SuspendStateUtils.error(server)).to.be.true;
    });

    it('should detect the error unsuspend state', function () {
        server.suspendStatus = UnSuspendStates.error;

        expect(SuspendStateUtils.complete(server)).to.be.false;
        expect(SuspendStateUtils.waitingToStart(server)).to.be.false;
        expect(SuspendStateUtils.started(server)).to.be.false;
        expect(SuspendStateUtils.error(server)).to.be.true;
    });
});

describe('Filter: SuspendServerMsg', function () {
    var $filter, SuspendServerMsg, SuspendStates;
    var server;

    beforeEach(function () {

        module('servers');

        inject(function (_$filter_, _SuspendStates_) {
            $filter = _$filter_;
            SuspendStates = _SuspendStates_;
            SuspendServerMsg = $filter('SuspendServerMsg');
        });

        server = {};
    });

    it('should return suspendErrorMsg if present', function () {
        server.suspendErrorMsg = 'ERROR';
        server.lastKnownServerStatus = 'FOO';
        server.suspendStatus = SuspendStates.complete;
        expect(SuspendServerMsg(server)).to.equal('ERROR');
    });

    it('should return a "Current Status" string if not complete and lastKnownServerStatus is set', function () {
        server.suspendErrorMsg = '';
        server.lastKnownServerStatus = 'Some Status';
        server.suspendStatus = SuspendStates.waiting;
        expect(SuspendServerMsg(server)).to.equal('Current Status: Some Status');
    });

    it('should return an empty string if complete and lastKnownServerStatus is set', function () {
        server.suspendErrorMsg = '';
        server.lastKnownServerStatus = 'Some Status';
        server.suspendStatus = SuspendStates.complete;
        expect(SuspendServerMsg(server)).to.equal('');
    });

    it('should return an empty string if complete and no suspendErrorMsg', function () {
        server.suspendErrorMsg = '';
        server.lastKnownServerStatus = 'Some Status';
        server.suspendStatus = SuspendStates.complete;
        expect(SuspendServerMsg(server)).to.equal('');
    });
});

describe('Filter: SuspendServerIcon/SuspendServerClass', function () {
    var $filter, SuspendServerIcon, SuspendStates, SuspendServerClass;
    var server;

    beforeEach(function () {

        module('servers');

        inject(function (_$filter_, _SuspendStates_) {
            $filter = _$filter_;
            SuspendStates = _SuspendStates_;
            SuspendServerIcon = $filter('SuspendServerIcon');
            SuspendServerClass = $filter('SuspendServerClass');
        });

        server = {};
    });

    it('should return success icon/class when suspend is complete', function () {
        server.suspendStatus = SuspendStates.complete;
        expect(SuspendServerIcon(server)).to.equal('fa-check-circle-o');
        expect(SuspendServerClass(server)).to.equal('server-suspend-success');
    });

    it('should return error icon/class when suspend errored', function () {
        server.suspendStatus = SuspendStates.error;
        expect(SuspendServerIcon(server)).to.equal('fa-ban');
        expect(SuspendServerClass(server)).to.equal('server-suspend-error');
    });

    it('should return an empty string for all other states', function () {
        server.suspendStatus = SuspendStates.waitingToStart;
        expect(SuspendServerIcon(server)).to.equal('');
        expect(SuspendServerClass(server)).to.equal('server-suspend-inprogress');

        server.suspendStatus = SuspendStates.started;
        expect(SuspendServerIcon(server)).to.equal('');
        expect(SuspendServerClass(server)).to.equal('server-suspend-inprogress');
    });
});

describe('Filter: SuspendServerText', function () {
    var $filter, SuspendServerText, SuspendStates;
    var server;

    beforeEach(function () {

        module('servers');

        inject(function (_$filter_, _SuspendStates_) {
            $filter = _$filter_;
            SuspendStates = _SuspendStates_;
            SuspendServerText = $filter('SuspendServerText');
        });

        server = {};
    });

    it('should return the suspendStatus mapping string for `complete`', function () {
        server.suspendStatus = SuspendStates.complete;
        expect(SuspendServerText(server)).to.equal('Successfully suspended!');
    });

    it('should return the suspendStatus mapping string for `started`', function () {
        server.suspendStatus = SuspendStates.started;
        expect(SuspendServerText(server)).to.equal('Suspending...');
    });

    it('should return the suspendStatus mapping string for `waitingToStart`', function () {
        server.suspendStatus = SuspendStates.waitingToStart;
        expect(SuspendServerText(server)).to.equal('Queued to suspend...');
    });

    it('should return the suspendStatus mapping string for `error`', function () {
        server.suspendStatus = SuspendStates.error;
        expect(SuspendServerText(server)).to.equal('Failed to suspend');
    });

    it('should return Unknown State if we somehow get a bad state on the server', function () {
        server.suspendStatus = SuspendStates.complete + 'abcdefg';
        expect(SuspendServerText(server)).to.equal('Unknown State');
    });

});

/* jshint node: true */
describe('Module: rxReachLink', function () {
    describe('Service: ReachServiceTarget', function () {
        var reachTarget, env;
        beforeEach(function () {

            // Load the directive's module
            module('rxReachLink');
            module('servers');

            // Inject in angular constructs otherwise,
            //  you would need to inject these into each test
            inject(function (ReachServiceTarget, Environment) {
                reachTarget = ReachServiceTarget;
                env = Environment;
                sinon.stub(env, 'get').returns({ name: 'local' });
            });
        });

        it('Should return the given target if no service type defined', function () {
            var target = reachTarget('/server', 'something', {});
            expect(target).to.equal('/server#something');
        });

        it('Should return a path to Reach First Gen Server Details', function () {
            var target = reachTarget('/server', 'compute', {
                serverId: 123,
                serverGen: 'First'
            });
            expect(target).to.equal('/server#compute,cloudServers/123');
        });

        it('Should return a path to Reach Next Gen Non Unified Server Details', function () {
            var target = reachTarget('/server', 'compute', {
                serverId: 123,
                serverGen: 'Next',
                region: 'ORD'
            });
            expect(target).to.equal('/server#compute,cloudServersPreprod,ORD/123');
        });

    });

    describe('Service: ReachServiceTarget (Unified)', function () {
        beforeEach(module(function ($provide) {
            $provide.constant('Environment', {
                get: function () {
                    return {
                        name: 'unified'
                    };
                }
            });
        }));

        var reachTarget, env;
        beforeEach(function () {

            // Load the directive's module
            module('rxReachLink');
            module('servers');

            // Inject in angular constructs otherwise,
            //  you would need to inject these into each test
            inject(function (ReachServiceTarget, Environment) {
                reachTarget = ReachServiceTarget;
                env = Environment;
                sinon.stub(env, 'get').returns({ name: 'local' });
            });
        });

        it('Should return a path to Reach Next Gen Unified Server Details', function () {
            env.get = sinon.stub().returns({ name: 'unified' });
            var target = reachTarget('/server', 'compute', {
                serverId: 123,
                serverGen: 'Next',
                region: 'ORD'
            });
            expect(target).to.equal('/server#compute,cloudServersOpenStack,ORD/123');
        });
    });

    describe('Directive: rxReachLink', function () {
        var rootScope, scope, compile, reachLink, items,
            validTemplate = '<rx-reach-link reach-target="/servers">Reach Servers</rx-reach-link>';

        var reachInfo, adminResponse, httpBackend;

        beforeEach(function () {

            // Load the directive's module
            module('encore');
            module('encore.ui');
            module('encore.svcs.encore');
            module('rxReachLink');
            module('encore.svcs.cloud.config');

            module('views/templates/rx-reachLink.html');

            // Inject in angular constructs otherwise,
            //  you would need to inject these into each test
            inject(function ($rootScope, $compile, $templateCache, $routeParams, $httpBackend) {
                httpBackend = $httpBackend;
                rootScope = $rootScope;
                compile = $compile;
                scope = $rootScope.$new();

                reachInfo = { reachUrl: '/reach', token: '123' };
                adminResponse = { admin: 'hub_cap' };
                $routeParams.user = 'hub_cap';

                $httpBackend.when('GET', '/api/cloud/users/hub_cap/reach').respond(reachInfo);

                var reachLinkHTML = $templateCache.get('views/templates/rx-reachLink.html');
                $templateCache.put('/views/templates/rx-reachLink.html', reachLinkHTML);
            });

            reachLink = helpers.createDirective(angular.element(validTemplate), compile, scope);
            items = reachLink.find('input');
        });

        afterEach(function () {
            // zero out link element
            reachLink = null;
            items = null;
        });

        describe('Check Generated HTML', function () {
            var username, password, next, form, button, directiveScope;
            beforeEach(function () {
                directiveScope = reachLink.find('form').scope();
                form = reachLink.find('form');
                username = items.filter('[name=username]');
                password = items.filter('[name=password]');
                next = items.filter('[name=next]');
                button = form.find('button');
                httpBackend.when('GET', '/api/encore/accounts/admin-user').respond(adminResponse);
            });

            it('Should track when data is loading', function () {
                expect(directiveScope.loading, 'Scope Loading Flag').to.be.empty;

                directiveScope.goToReach();
                expect(directiveScope.loading, 'Scope Loading Flag').to.be.true;
                httpBackend.flush();
                expect(directiveScope.loading, 'Scope Loading Flag').to.be.false;
            });

            it('Should set the required form data', function () {
                expect(username.val()).to.equal('hub_cap');
                expect(next.val()).to.equal('/servers');

                directiveScope.goToReach();
                httpBackend.flush();

                expect(password.val()).to.equal('123');
                expect(form.attr('action')).to.equal('/reach');
            });
        });

        describe('when account admin cannot be retrieved', function () {

            var directiveScope;

            beforeEach(function () {
                directiveScope = reachLink.find('form').scope();
                httpBackend.when('GET', '/api/encore/accounts/admin-user').respond(404, { message: 'Not Found' });
            });

            it('should set loading to false', function () {
                expect(directiveScope.loading, 'Scope Loading Flag').to.be.empty;
                directiveScope.goToReach();
                expect(directiveScope.loading, 'Scope Loading Flag').to.be.true;
                httpBackend.flush();
                expect(directiveScope.loading, 'Scope Loading Flag').to.be.false;
            });
        });
    });
});

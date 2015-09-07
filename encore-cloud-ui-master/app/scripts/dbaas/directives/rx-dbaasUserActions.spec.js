describe('Directive: Database User Actions', function () {

    var el, elScope, scope, compile, rootScope, rxNotify, Status, httpBackend, requestURL, $location, buildRequestURL,
        template = '<rx-dbaas-user-actions user="user" instance="instance"' +
                   ' dbuser="dbuser"></rx-dbaas-user-actions>';

    beforeEach(function () {
        module('encore');
        module('encore.ui');
        module('encore.svcs.cloud.config');
        module('databases');

        module('views/dbaas/directives/rx-dbaasUserActions.html');
        // jscs:disable
        inject(function ($rootScope, $compile, $templateCache, $httpBackend, _$location_, _Status_, _rxNotify_,
                CLOUD_API_URL_BASE) { // jscs:enable
            var actionMenuHtml = $templateCache.get('views/dbaas/directives/rx-dbaasUserActions.html');
            $templateCache.put('/views/dbaas/ShowInstance.html', '');
            $templateCache.put('/views/dbaas/directives/rx-dbaasUserActions.html', actionMenuHtml);
            rootScope = $rootScope;
            var apiBase = CLOUD_API_URL_BASE;

            scope = $rootScope.$new();

            scope.instance = {
                'name': 'AlphaInstance',
                'id': '432e170c-7cbd-4144-8da0-6d0a4c705ace',
                'region': 'STAGING',
                'status': 'ACTIVE'
            };
            scope.user = 'hub_cap';

            scope.dbuser = { name: 'foo', host: '6.3.6.3' };

            scope.loaded = false;

            buildRequestURL = function (scope) {
                var url = apiBase + '/users/' + scope.user + '/dbaas/' + scope.instance.region +
                         '/instances/' + scope.instance.id + '/users/' + scope.dbuser.name;
                if (scope.dbuser.host !== '%') {
                    url = url + '%2540' + scope.dbuser.host;
                }
                return url;
            };

            // jscs:disable
            compile = $compile;
            rxNotify = _rxNotify_;
            Status = _Status_;
            $location = _$location_;
            httpBackend = $httpBackend;
            // jscs:enable
        });

        // Explicitly set the $location because the directive does $route.reload()
        $location.path('/hub_cap/databases/instances/STAGING/' + scope.instance.id);

        el = helpers.createDirective(template, compile, scope);

        elScope = el.isolateScope();

        Status.setScope(scope);

        requestURL = buildRequestURL(scope);
    });

    it('should contain three user action', function () {
        var actions = el.find('span.ng-scope');

        expect(actions.length).to.equal(3);
        expect(actions.eq(0).text()).to.contain('Edit User');
        expect(actions.eq(1).text()).to.contain('Manage User Access');
        expect(actions.eq(2).text()).to.contain('Delete User');
    });

    it('should post to rxNotify on success', function () {
        httpBackend.whenDELETE(requestURL).respond(200);
        elScope.deleteUser.postHook();
        httpBackend.flush();
        expect(rxNotify.stacks.page[0].text).to.contain('User deleted');

    });

    it('should post to rxNotify on failure', function () {
        httpBackend.whenDELETE(requestURL).respond(400);
        elScope.deleteUser.postHook();
        httpBackend.flush();
        expect(rxNotify.stacks.page[0].text).to.contain('Error deleting user');

    });

    it('should post to rxNotify on user access success', function () {
        httpBackend.whenPUT(requestURL + '/databases/access').respond(200);
        elScope.manageUserAccess.postHook({ user: { dblist: ['grant', 'revoke'] }});
        httpBackend.flush();
        expect(rxNotify.stacks.page[0].text).to.contain('User access updated');
    });

    it('should post to rxNotify on user access failure', function () {
        httpBackend.whenPUT(requestURL + '/databases/access').respond(400);
        elScope.manageUserAccess.postHook({ user: { dblist: ['grant', 'revoke'] }});
        httpBackend.flush();
        expect(rxNotify.stacks.page[0].text).to.contain('Error updating user access');
    });

    it('should post to rxNotify on edit success', function () {
        elScope.editUser.preHook(scope);
        httpBackend.whenPUT(requestURL).respond(200);
        // Change password
        scope.fields.user.password = 'abcd';
        elScope.editUser.postHook(scope.fields);
        httpBackend.flush();
        expect(rxNotify.stacks.page[0].text).to.contain('User updated');
    });

    it('should post to rxNotify on edit failure', function () {
        elScope.editUser.preHook(scope);
        httpBackend.whenPUT(requestURL).respond(400);
        scope.fields.user.password = 'abcd';
        elScope.editUser.postHook(scope.fields);
        httpBackend.flush();
        expect(rxNotify.stacks.page[0].text).to.contain('Error updating user');
    });

    it('should not send a request if nothing changed', function () {
        elScope.editUser.preHook(scope);
        httpBackend.whenPUT(requestURL).respond(400);
        elScope.editUser.postHook(scope.fields);

        // page[0] contains 'Editing user...'. page[1] is the 'No changes made...'
        // message that gets pushed on after
        expect(rxNotify.stacks.page[1].text).to.contain('No changes made');

    });

    describe('dbuser with a wildcard host', function () {
        beforeEach(function () {
            scope.dbuser = { name: 'foo', host: '%' };
            el = helpers.createDirective(template, compile, scope);

            elScope = el.isolateScope();

            requestURL = buildRequestURL(scope);

        });

        it('should post to rxNotify on edit success with no host', function () {
            elScope.editUser.preHook(scope);
            httpBackend.whenPUT(requestURL).respond(200);
            // Change password
            scope.fields.user.password = 'abcd';
            elScope.editUser.postHook(scope.fields);
            httpBackend.flush();
            expect(rxNotify.stacks.page[0].text).to.contain('User updated');
        });

    });

});

describe('Directive: Dbaas Database Actions', function () {

    var el, elScope, scope, compile, rootScope, rxNotify, Status, httpBackend, requestURL, $location, apiBase,
        template = '<rx-dbaas-database-actions user="user" instance="instance"' +
                   ' database="database"></rx-dbaas-database-actions>';

    beforeEach(function () {
        module('encore');
        module('encore.ui');
        module('encore.svcs.cloud.config');
        module('databases');

        module('views/dbaas/directives/rx-dbaasDatabaseActions.html');
        // jscs:disable
        inject(function ($rootScope, $compile, $templateCache, $httpBackend, _$location_, _Status_, _rxNotify_,
                CLOUD_API_URL_BASE) { // jscs:enable
            var actionMenuHtml = $templateCache.get('views/dbaas/directives/rx-dbaasDatabaseActions.html');
            $templateCache.put('/views/dbaas/ShowInstance.html', '');
            $templateCache.put('/views/dbaas/directives/rx-dbaasDatabaseActions.html', actionMenuHtml);
            rootScope = $rootScope;
            apiBase = CLOUD_API_URL_BASE;

            scope = $rootScope.$new();

            scope.instance = {
                'name': 'AlphaInstance',
                'id': '432e170c-7cbd-4144-8da0-6d0a4c705ace',
                'region': 'STAGING',
                'status': 'ACTIVE'
            };
            scope.user = 'hub_cap';
            scope.loaded = false;

            scope.database = { name: 'so_data' };

            // jscs:disable
            compile = $compile;
            $location = _$location_;
            rxNotify = _rxNotify_;
            Status = _Status_;
            httpBackend = $httpBackend;
            // jscs:enable
        });

        // Explicitly set the location because the directive does $route.reload()
        $location.path('/hub_cap/databases/instances/STAGING/' + scope.instance.id);

        el = helpers.createDirective(template, compile, scope);

        elScope = el.isolateScope();
        requestURL = apiBase + '/users/' + scope.user + '/dbaas/' + scope.instance.region +
                       '/instances/' + scope.instance.id + '/databases/' + scope.database.name;

        Status.setScope(scope);
    });

    it('should contain edit users action', function () {
        var actions = el.find('span.ng-scope');

        expect(actions.eq(0).text()).to.contain('Edit Users');
    });

    it('should contain delete database action', function () {
        var actions = el.find('span.ng-scope');

        expect(actions.eq(1).text()).to.contain('Delete Database');
    });

    it('should post to rxNotify on success', function () {
        httpBackend.whenDELETE(requestURL).respond(200);
        elScope.deleteDatabase.postHook();
        httpBackend.flush();
        expect(rxNotify.stacks.page[0].text).to.contain('Database deleted');

    });

    it('should post to rxNotify on failure', function () {
        httpBackend.whenDELETE(requestURL).respond(400);
        elScope.deleteDatabase.postHook();
        httpBackend.flush();
        expect(rxNotify.stacks.page[0].text).to.contain('Error deleting database');

    });

});

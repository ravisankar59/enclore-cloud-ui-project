/* jshint node: true */
describe('Directive: Dbaas Instance Actions', function () {
    var el, scope, compile, rootScope,
        template = '<rx-dbaas-instance-actions actions="actions.list" user="user" ' +
                   'instance="instance"></rx-dbaas-instance-actions>';

    beforeEach(function () {
        // load module
        module('encore');
        module('encore.ui');
        module('databases');
        module('encore.svcs.cloud.config');

        // load templates
        module('views/dbaas/directives/rx-dbaasInstanceActions.html');

        // Inject in angular constructs
        inject(function ($rootScope, $compile, $templateCache) {
            rootScope = $rootScope;
            compile = $compile;
            scope = $rootScope.$new();

            scope.instance = {
                'name': 'AlphaInstance',
                'id': '432e170c-7cbd-4144-8da0-6d0a4c705ace',
                'region': 'STAGING',
                'status': 'ACTIVE'
            };

            scope.actions = {
                'list': [
                    'restartInstance', 'changeFlavor', 'resizeVolume', 'deleteInstance', 'createDatabase', 'createUser'
                ]
            };

            scope.user = 'hub_cap';

            // Now we need to grab the individual templates and put them in the
            // cache. This has to be done instead of the whenGET calls due to
            // the URL and Filepaths not being the same.
            var actionMenuHtml = $templateCache.get('views/dbaas/directives/rx-dbaasInstanceActions.html');
            $templateCache.put('/views/dbaas/directives/rx-dbaasInstanceActions.html', actionMenuHtml);

            el = helpers.createDirective(template, compile, scope);
        });
    });

    it('should contain a list of actions', function () {
        var actions = el.find('span.ng-scope');

        expect(actions.length).to.equal(6);
        expect(actions.eq(0).text()).to.equal(' Create Database\n        ');
    });
});

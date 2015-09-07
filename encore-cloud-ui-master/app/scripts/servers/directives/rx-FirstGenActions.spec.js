/* jshint node: true */
describe('Directive: FirstGen Actions', function () {
    var el, scope, compile, rootScope,
        template = '<rx-first-gen-actions actions="actions.list" user="user" server="server"></rx-first-gen-actions>';

    beforeEach(function () {
        // load module
        module('encore');
        module('encore.ui');
        module('servers');
        module('encore.svcs.cloud.config');

        // load templates
        module('views/servers/templates/server-actions.html');
        module('views/templates/rx-reachLink.html');
        module('views/templates/rx-cloudControlLink.html');

        // Inject in angular constructs
        inject(function ($rootScope, $compile, $templateCache, $q, Encore, CloudUsers) {
            rootScope = $rootScope;
            compile = $compile;
            scope = $rootScope.$new();

            helpers.resourceStub($q, Encore, 'getAccountByIdentityUsername', {});
            helpers.resourceStub($q, Encore, 'getAccount', {});
            helpers.resourceStub($q, CloudUsers, 'reach', {});

            scope.server = {
                'id': '2999ca73-f2d7-4275-ba45-84753332903b',
                'region': 'ORD',
                'status': 'ACTIVE',
                'gen': 'First'
            };

            scope.actions = {
                'list': [
                    'createImage', 'deleteServer', 'rebootServer'
                ]
            };

            scope.user = 'hub_cap';

            // Now we need to grab the individual templates and put them in the
            // cache. This has to be done instead of the whenGET calls due to
            // the URL and Filepaths not being the same.
            var actionMenuHtml = $templateCache.get('views/servers/templates/server-actions.html');
            $templateCache.put('/views/servers/templates/server-actions.html', actionMenuHtml);

            el = helpers.createDirective(template, compile, scope);
        });
    });

    it('should contain a list of actions', function () {
        var actions = el.find('span.ng-scope');

        expect(actions.length).to.equal(5);
        expect(actions.eq(0).text()).to.equal('Create NextGen Image');
    });
});

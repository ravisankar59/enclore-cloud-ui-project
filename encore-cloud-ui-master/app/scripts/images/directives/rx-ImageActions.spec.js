/* jshint node: true */
describe('Directive: Image Actions', function () {
    var el, scope, compile, rootScope,
        template = '<rx-image-actions user="user" image="image"></rx-image-actions>';

    beforeEach(function () {
        // load module
        module('encore');
        module('encore.ui');
        module('encore.svcs.cloud.config');
        module('images');

        // load templates
        module('views/images/templates/image-actions.html');

        // Inject in angular constructs
        inject(function ($rootScope, $compile, $templateCache) {
            rootScope = $rootScope;
            compile = $compile;
            scope = $rootScope.$new();

            scope.user = 'hub_cap';
            scope.accountNumber = '323676';

            scope.image = {
                'id': '2999ca73-f2d7-4275-ba45-84753332903b',
                'name': 'Core OS',
                'region': 'ORD',
                'status': 'ACTIVE',
                'gen': 'Next',
                'visibility': 'private'
            };

            // Now we need to grab the individual templates and put them in the
            // cache. This has to be done instead of the whenGET calls due to
            // the URL and Filepaths not being the same.
            var actionMenuHtml = $templateCache.get('views/images/templates/image-actions.html');
            $templateCache.put('/views/images/templates/image-actions.html', actionMenuHtml);

            el = helpers.createDirective(template, compile, scope);
        });
    });

    it('should contain a list of actions', function () {
        var createServer = el.find('a.create-server');
        expect(createServer.length).to.equal(1);
        expect(createServer.eq(0).text()).to.contain('Create Server from Image');

        var deleteImage = el.find('span.ng-scope');
        expect(deleteImage.length).to.equal(1);
        expect(deleteImage.eq(0).text()).to.contain('Delete Image');
    });
});

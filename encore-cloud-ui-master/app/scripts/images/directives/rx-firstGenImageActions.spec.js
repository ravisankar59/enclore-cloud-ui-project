/* jshint node: true */
describe('Directive: FirstGen Image Actions', function () {
    var el, scope, compile, rootScope,
        template = '<rx-first-gen-image-actions user="user" image="image"></rx-first-gen-image-actions>';

    beforeEach(function () {
        // load module
        module('encore');
        module('encore.ui');
        module('images');
        module('encore.svcs.cloud.config');

        // load templates
        module('views/images/templates/image-actions-firstgen.html');

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
                'gen': 'First',
                'visibility': 'private'
            };

            // Now we need to grab the individual templates and put them in the
            // cache. This has to be done instead of the whenGET calls due to
            // the URL and Filepaths not being the same.
            var actionMenuHtml = $templateCache.get('views/images/templates/image-actions-firstgen.html');
            $templateCache.put('/views/images/templates/image-actions-firstgen.html', actionMenuHtml);

            el = helpers.createDirective(template, compile, scope);
        });
    });

    it('should contain a list of actions', function () {
        var deleteImage = el.find('span.ng-scope');
        expect(deleteImage.length).to.equal(1);
        expect(deleteImage.eq(0).text()).to.contain('Delete Image');
    });
});

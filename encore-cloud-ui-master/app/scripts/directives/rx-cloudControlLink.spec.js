describe('Module: rxCloudControlLink', function () {
    describe('Directive: rxCloudControlLink', function () {
        var routeParams, rootScope, scope, compile, cloudControlLink, httpBackend,
            getCloudControlURLSvc, environmentSvc, getAccountRegionSvc;

        var validTemplate = '<rx-cloud-control-link ' +
            'service-type="servers" ' +
            'region="ORD" ' +
            'server-gen="Next" ' +
            'server-id="123">' +
            'Go To Cloud Control' +
            '</rx-cloud-control-link>';

        var userAccountInfo = { supportRegion: 'US', users: [ { id: '295', username: 'User' }] };

        beforeEach(function () {
            module('encore');
            module('rxCloudControlLink');
            module('encore.svcs.encore');
            module('views/templates/rx-cloudControlLink.html');
            module(function ($provide) {
                $provide.factory('GetCloudControlURL', function () {
                    return getCloudControlURLSvc;
                });
                $provide.factory('Environment', function () {
                    return environmentSvc;
                });
                $provide.factory('GetAccountRegion', function () {
                    return getAccountRegionSvc;
                });
            });

            environmentSvc = {
                isUnified: sinon.stub(),
                isPreProd: sinon.stub(),
                isUnifiedPreProd: sinon.stub(),
                isLocal: sinon.stub()
            };

            getCloudControlURLSvc = sinon.stub();

            getAccountRegionSvc = sinon.stub();

            inject(function ($rootScope, $compile, $templateCache, $routeParams, $httpBackend, Environment) {
                routeParams = $routeParams;
                rootScope = $rootScope;
                compile = $compile;
                httpBackend = $httpBackend;
                scope = $rootScope.$new();
                Environment = environmentSvc;
                routeParams.user = 'User';
                routeParams.accountNumber = '323676';
                httpBackend.when('GET', '/api/encore/accounts/323676').respond(userAccountInfo);
            });

            cloudControlLink = helpers.createDirective(angular.element(validTemplate), compile, scope);
        });

        describe('Get Cloud Control URL by environment', function () {

            var form, directiveScope;

            beforeEach(function () {
                directiveScope = cloudControlLink.find('form').scope();
                getAccountRegionSvc.returns('US');
                form = cloudControlLink.find('form');
                sinon.spy(form[0], 'submit');
                httpBackend.when('GET', '/api/encore/accounts/323676').respond(userAccountInfo);
            });

            it('retrieves the production url', function () {
                var prodURL = 'prod.com';
                getCloudControlURLSvc.withArgs('US', 'production', '323676', '295', sinon.match.any)
                    .returns(prodURL);
                environmentSvc.isUnified.returns(true);
                directiveScope.goToCloudControl();
                httpBackend.flush();
                expect(form.attr('action')).to.equal(prodURL);
            });

            it('retrieves the staging url', function () {
                var stagingURL = 'staging.com';
                getCloudControlURLSvc.withArgs('US', 'staging', '323676', '295', sinon.match.any)
                    .returns(stagingURL);
                environmentSvc.isUnifiedPreProd.returns(true);
                directiveScope.goToCloudControl();
                httpBackend.flush();
                expect(form.attr('action')).to.equal(stagingURL);
            });

            it('retrieves the preprod url', function () {
                var preProdURL = 'preprod.com';
                getCloudControlURLSvc.withArgs('US', 'preprod', '323676', '295', sinon.match.any)
                    .returns(preProdURL);
                environmentSvc.isPreProd.returns(true);
                directiveScope.goToCloudControl();
                httpBackend.flush();
                expect(form.attr('action')).to.equal(preProdURL);
            });

            it('retrieves the local url', function () {
                var localURL = 'local.com';
                getCloudControlURLSvc.withArgs('US', 'local', '323676', '295', sinon.match.any)
                    .returns(localURL);
                environmentSvc.isLocal.returns(true);
                directiveScope.goToCloudControl();
                httpBackend.flush();
                expect(form.attr('action')).to.equal(localURL);
            });

            describe('when the account cannot be retrieved', function () {

                beforeEach(function () {
                    httpBackend.expect('GET', '/api/encore/accounts/323676').respond(404, { });
                });

                it('should set loading to false', function () {
                    directiveScope.goToCloudControl();
                    httpBackend.flush();
                    expect(directiveScope.loading).to.be.false;
                });

                it('should not submit to Cloud Control', function () {
                    directiveScope.goToCloudControl();
                    httpBackend.flush();
                    expect(form[0].submit.callCount).to.equal(0);
                });

            });

        });

        describe('Check Generated HTML', function () {
            var form, directiveScope;
            var cloudControlURL = 'https://cc.rackspace.net/customer/323676/users/295/next_gen_servers/ORD/123';

            beforeEach(function () {
                environmentSvc.isLocal.returns(true);
                getCloudControlURLSvc.returns(cloudControlURL);
                directiveScope = cloudControlLink.find('form').scope();
                form = cloudControlLink.find('form');
                sinon.spy(form[0], 'submit');
            });

            it('should track when data is loading', function () {
                expect(directiveScope.loading, 'Scope Loading Flag').to.be.empty;
                directiveScope.goToCloudControl();
                expect(directiveScope.loading, 'Scope Loading Flag').to.be.true;
                httpBackend.flush();
                expect(directiveScope.loading, 'Scope Loading Flag').to.be.false;
            });

            it('should set the required form data', function () {
                directiveScope.goToCloudControl();
                httpBackend.flush();
                expect(form.attr('action')).to.equal(cloudControlURL);
            });

            it('should submit the form to go to Cloud Control', function () {
                directiveScope.goToCloudControl();
                httpBackend.flush();
                sinon.assert.called(form[0].submit);
            });
        });

    }); // describe 'Directive: rxCloudControlLink'
});

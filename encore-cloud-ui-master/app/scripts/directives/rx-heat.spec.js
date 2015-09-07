describe('Directive: rxHeat', function () {

    var rootScope, scope, compile, httpBackend,
        sessionSvc, heatDirective, form, inputs;

    var validTemplate = '<rx-heat></rx-heat>';
    var reachInfo = { token: '123' };
    var heatUtilInfo = {
        url: function () { return 'https://heat.com'; }
    };

    beforeEach(function () {
        module('heat');
        module('views/templates/rx-heat.html');

        module(function ($provide) {
            $provide.factory('HeatUtil', function () {
                return heatUtilInfo;
            });
        });

        inject(function ($rootScope, $compile, $httpBackend, $routeParams, Session) {
            rootScope = $rootScope;
            compile = $compile;
            scope = rootScope.$new();
            httpBackend = $httpBackend;
            sessionSvc = Session;
        });

        sinon.stub(sessionSvc, 'getUserName').returns('racker_username');
        sinon.stub(sessionSvc, 'getTokenId').returns('racker_token');
    });

    describe('when the impersonation token is retrieved successfully', function () {

        beforeEach(function () {
            httpBackend.when('GET', '/api/cloud/users/reach').respond(reachInfo);
            heatDirective = helpers.createDirective(angular.element(validTemplate), compile, scope);
            inputs = heatDirective.find('input');
            form = heatDirective.find('form');
            sinon.stub(form[0], 'submit');
            httpBackend.flush();
        });

        it('should set the input value for racker username', function () {
            expect(inputs.filter('[name=racker_username]').val()).to.equal('racker_username');
        });

        it('should set the input value for racker token', function () {
            expect(inputs.filter('[name=racker_token]').val()).to.equal('racker_token');
        });

        it('should set the input value for the impersonation token', function () {
            expect(inputs.filter('[name=impersonation_token]').val()).to.equal(reachInfo.token);
        });

        it('should set form action with the heat url', function () {
            expect(form.attr('action')).to.equal(heatUtilInfo.url());
        });

        it('should submit the form', function () {
            sinon.assert.called(form[0].submit);
        });

    }); // describe('when the impersonation token is retrieved successfully')

    describe('when the impersonation token is NOT retrieved successfully', function () {

        beforeEach(function () {
            httpBackend.when('GET', '/api/cloud/users/reach').respond(404, {});
            heatDirective = helpers.createDirective(angular.element(validTemplate), compile, scope);
            inputs = heatDirective.find('input');
            form = heatDirective.find('form');
            sinon.stub(form[0], 'submit');
            httpBackend.flush();
        });

        it('should not submit the form', function () {
            expect(form[0].submit.callCount).to.equal(0);
        });

    }); // describe('when the impersonation token is NOT retrieved')

});

describe('Directive: rxCustomToggleSwitch', function () {
    var rootScope, compile, scope, directiveScope, el, postHookEL, postHookDisabledEL,
        validTemplate = '<rx-custom-toggle-switch ng-model="model" toggle-model="input"></rx-custom-toggle-switch>',
        postHookTemplate = '<rx-custom-toggle-switch ng-model="model" post-hook="callMe()"></rx-custom-toggle-switch>';
    var postHookDisable = '<rx-custom-toggle-switch ng-model="model" post-hook="callMe()" ';
    postHookDisable += 'disabled="true"></rx-custom-toggle-switch>';

    beforeEach(function () {
        module('loadbalancers');
        module('views/lbaas/directives/rx-lbaasCustomToggleSwitch.html');

        inject(function ($rootScope, $compile) {
            rootScope = $rootScope;
            compile = $compile;
            scope = rootScope.$new();
            scope.callMe = sinon.stub();

        });

        el = helpers.createDirective(validTemplate, compile, scope);
        el = helpers.getChildDiv(el, 'rx-toggle-switch', 'class');

        postHookEL = helpers.createDirective(postHookTemplate, compile, scope);
        postHookEL = helpers.getChildDiv(postHookEL, 'rx-toggle-switch', 'class');

        postHookDisabledEL = helpers.createDirective(postHookDisable, compile, scope);
        postHookDisabledEL = helpers.getChildDiv(postHookDisabledEL, 'rx-toggle-switch', 'class');
    });

    describe('Custom Toggle Switch', function () {
        it('should render correct template', function () {
            expect(el).to.not.be.empty;
            expect(el.hasClass('rx-toggle-switch')).to.be.true;
            expect(el.hasClass('ON')).to.be.false;
            expect(helpers.getChildDiv(el, 'knob', 'class')).not.be.empty;
        });

        it('status should be turn ON and OFF based on toggle model', function () {
            directiveScope = el.scope();
            var element = compile(validTemplate)(scope);
            element.scope().$apply();
            expect(directiveScope.state).to.equal('OFF');

            scope.input = true;
            element.scope().$apply();
            expect(directiveScope.state).to.equal('ON');
        });

        it('should call posthook method when hits update click event', function () {
            directiveScope = postHookEL.scope();
            directiveScope.update();
            scope.$apply();
            sinon.assert.calledOnce(scope.callMe);
        });

        it('should not call posthook method when in disable mode', function () {
            directiveScope = postHookDisabledEL.scope();
            directiveScope.update();
            scope.$apply();
            sinon.assert.notCalled(scope.callMe);
        });
    });
});
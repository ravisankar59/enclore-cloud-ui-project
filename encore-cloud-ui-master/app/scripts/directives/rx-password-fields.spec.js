/* jshint node: true */
describe('Directive: rxFormPassword', function () {
    var myPasswordFields, scope, compile, items,
        validTemplate = '<form name="form"><rx-form-password model="password"></rx-form-password></form>';

    beforeEach(function () {

        // Load the directive's module
        module('encore');
        module('views/templates/rx-form-password.html');

        // Inject in angular constructs otherwise,
        //  you would need to inject these into each test
        inject(function ($rootScope, $compile, $templateCache) {
            scope = $rootScope.$new();
            compile = $compile;

            var passwordHtml = $templateCache.get('views/templates/rx-form-password.html');
            $templateCache.put('/views/templates/rx-form-password.html', passwordHtml);
        });

        myPasswordFields = helpers.createDirective(angular.element(validTemplate), compile, scope);
        items = myPasswordFields.find('input');
    });

    afterEach(function () {
        // zero out link element
        myPasswordFields = null;
        items = null;
    });

    it('should have two input fields', function () {
        
        var passwordField = items.eq(0);
        var confirmPasswordField = items.eq(1);

        expect(passwordField.hasClass('field-input')).to.be.true;
        expect(confirmPasswordField.hasClass('field-input')).to.be.true;
    });

    it('should throw validation errors when password fields do not match', function () {
        var form = scope.form;

        form.password.$setViewValue('abc');
        form.repeatPassword.$setViewValue('ab');

        expect(form.repeatPassword.$valid).to.be.false;
    });

    it('should not validation errors when password fields match', function () {
        var form = scope.form;

        form.password.$setViewValue('abc');
        form.repeatPassword.$setViewValue('abc');

        expect(form.repeatPassword.$valid).to.be.true;
    });

    it('should throw validation errors when password fields match, and then password field is changed', function () {
        var form = scope.form;

        form.password.$setViewValue('abc');
        form.repeatPassword.$setViewValue('abc');

        expect(form.repeatPassword.$valid).to.be.true;

        form.password.$setViewValue('ab');

        expect(form.repeatPassword.$valid).to.be.false;

    });

});
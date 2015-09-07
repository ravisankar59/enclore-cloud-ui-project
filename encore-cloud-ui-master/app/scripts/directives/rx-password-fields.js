angular.module('encore')
    /**
     * @ngdoc directive
     * @name encore.directives:rxFormPassword
     * @restrict E
     * @description
     * This directive is used to create a password and confirm password inputs
     * It will also show an error message if they don't match #balla
     * This directive depends on the repeatPassword directive below
     * @scope
     * required - Value to bind to input's 'ng-required' attribute
     * model - Value to bind input to using ng-model
     * minLength - Value passed to input's 'minLength' attribute
     * maxLength - Value passed to input's 'maxLength' attribute
     * max - Value passed to input's 'max' attribute
     * min - Value passed to input's 'min' attribute
     * description - Text to place after input
     * suffix - Text to use after <label>
     */
    .directive('rxFormPassword', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/templates/rx-form-password.html',
            scope: {
                required: '=',
                model: '=',
                minLength: '@',
                maxLength: '@',
                max: '@',
                min: '@',
                description: '@',
                suffix: '@'
            }
        };
    })

    /**
     *
     * @ngdoc directive
     * @name encore.directives:repeatPassword
     * @description
     * This directive is used to make sure two inputs have the same value
     * http://piotrbuda.eu/2013/02/angularjs-directive-for-password-matching.html
     * This direcective is used in the rxFormPassword's directives template.
     */
    .directive('repeatPassword', function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                //We set the formCtrl so that we can check this data in the template rendered 
                //from the rxFormPassword directive
                scope.formCtrl = elem.inheritedData('$formController');
                var otherInput = elem.inheritedData('$formController')[attrs.repeatPassword];

                ctrl.$parsers.push(function (value) {
                    if (value === otherInput.$viewValue) {
                        ctrl.$setValidity('repeat', true);
                        return value;
                    }
                    ctrl.$setValidity('repeat', false);
                });

                otherInput.$parsers.push(function (value) {
                    ctrl.$setValidity('repeat', value === ctrl.$viewValue);
                    return value;
                });
            }
        };
    });

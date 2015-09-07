angular.module('rxDateRange', [])
/* @ngdoc filter
 * @name rxDateRange:rxDateRange
 * @requires MomentJS
 * @returns {array} filtered object
 * @description
 *
 * Filters data based on a set of options provided.
 *
 * Note: this filter is not inclusive in nature, if you want to be 
 * inclusive you will need to bump the date accordingly prior to calling the
 * filter
 *
 * @example
 * ```
 * var options = {
 *  fromAttr: 'attr',
 *  toAttr: 'attr',
 *  fromDate: new moment(),
 *  toDate: new moment()
 * };
 *
 * $filter('rxDateRange')(data, options);
 * ```
 */
.filter('rxDateRange', function () {
    return function (data, opts) {
        // If we dont have what we need just return the data
        if (!opts.toDate || !opts.fromDate) {
            return data;
        }
        // return a filtered object
        return _.filter(data, function (instance) {
            // Convert the data's date objects to moment objects
            var instFromDate = new moment(instance[opts.fromAttr]);
            var instToDate = new moment(instance[opts.toAttr]);
            // start validating
            if (opts.fromDate.isValid() && opts.toDate.isValid()){
                return ((instFromDate.isSame(opts.fromDate) || instFromDate.isAfter(opts.fromDate)) &&
                        instToDate.isBefore(opts.toDate));
            } else {
                return true;
            }
        });
    };
})
/* @ngdoc service
 * @name rxDateRange:rxDateRangeActions
 * @requires $interpolate
 * @description
 * @returns {object} defining the actions that can be used with this directive
 */
.factory('rxDateRangeActions', function ($interpolate) {
    return {
        validate: function ($scope, fromDate, toDate) {
            if ($scope.fromDate && fromDate.isValid() === false) {
                $scope.rxDateRangeForm.fromDate.$setValidity('date', false);
            } else {
                $scope.rxDateRangeForm.fromDate.$setValidity('date', true);
            }

            if ($scope.toDate && toDate.isValid() === false) {
                $scope.rxDateRangeForm.toDate.$setValidity('date', false);
            } else {
                $scope.rxDateRangeForm.toDate.$setValidity('date', true);
            }

            // Make sure its a good range
            if (toDate.isBefore(fromDate)) {
                $scope.rxDateRangeForm.fromDate.$setValidity('dateRange', false);
                $scope.rxDateRangeForm.toDate.$setValidity('dateRange', false);
            } else {
                $scope.rxDateRangeForm.fromDate.$setValidity('dateRange', true);
                $scope.rxDateRangeForm.toDate.$setValidity('dateRange', true);
            }

            // Is end date > today?
            if (toDate.isAfter(moment())) {
                $scope.rxDateRangeForm.toDate.$setValidity('dateExceed', false);
            } else {
                $scope.rxDateRangeForm.toDate.$setValidity('dateExceed', true);
            }

            // manage error state more clearly
            $scope.hasError = false;
            if ($scope.rxDateRangeForm.$error.date !== undefined &&
                    $scope.rxDateRangeForm.$error.date !== false) {
                $scope.hasError = true;
            } else if ($scope.rxDateRangeForm.$error.dateRange !== undefined &&
                    $scope.rxDateRangeForm.$error.dateRange !== false) {
                $scope.hasError = true;
            } else if ($scope.rxDateRangeForm.$error.dateExceed !== undefined &&
                    $scope.rxDateRangeForm.$error.dateExceed !== false) {
                $scope.hasError = true;
            } else {
                $scope.hasError = false;
            }
        },
        updateData: function ($scope) {
            // Convert user input into moment.js objects
            var fromDate = moment($scope.fromDate, ['MM/DD/YY', 'MM/DD/YYYY'], true);
            var toDate = moment($scope.toDate, ['MM/DD/YY', 'MM/DD/YYYY'], true);

            // Bump up the options to date so that its an inclusive filter
            toDate.add(1, 'd');

            // Check validity
            this.validate($scope, fromDate, toDate);
            
            $scope.filter = {
                fromDate: fromDate,
                toDate: toDate,
                fromAttr: $scope.from,
                toAttr: $scope.to
            };
            
            if ($scope.data === $scope.originaData || $scope.hasError) {
                $scope.showRangeMessage = false;
            } else {
                $scope.showRangeMessage = true;
            }
            
            // We are constructing this here because we want to not use 2-way 
            // data binding in this case.  We want the message to only ever
            // update when the user clicks the update button
            $scope.rangeMessage = 'Results shown are based on start date being on ';
            $scope.rangeMessage += 'or after {{ fromDate }} and end date being on ';
            $scope.rangeMessage += 'or before {{ toDate }}';
            $scope.rangeMessage = $interpolate($scope.rangeMessage);
            $scope.rangeMessage = $scope.rangeMessage({
                fromDate: $scope.fromDate,
                toDate: $scope.toDate
            });
        }
    };
})
/* @ngdoc directive
 * @name rxDateRange:rxDateRange
 * @requires ngModel
 * @requires form
 * @requires rxDateRange:rxDateRangeActions
 * @restrict E
 * @description
 *  
 *  A directive that will filter a data object based on a date range provided.
 *  It uses from and to scope attributes to define the instance attribute to compare
 *  against in the data object.
 *
 *  It will then compare the input that the user provides with the attributes from 
 *  the data object and filter accordingly.
 *
 *  @example
 *  `<rx-date-range data='someObject' from='fromAttr' to='toAttr'></rx-date-range>
 */
.directive('rxDateRange', function (rxDateRangeActions) {
    return {
        restrict: 'E',
        require: ['^?ngModel', '^?form'],
        templateUrl: 'views/templates/rx-dateRange.html',
        scope: {
            data: '=',
            from: '=',
            to: '=',
            filter: '='
        },
        controller: function ($scope) {
            $scope.showRangeMessage = false;
            // All the controller is doing is wiring up the scope to the actions
            $scope.actions = {
                updateData: function () {
                    return rxDateRangeActions.updateData($scope);
                }
            };
        }
    };
});

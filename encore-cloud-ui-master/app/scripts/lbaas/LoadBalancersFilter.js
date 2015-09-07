/**
* @ngdoc filter
* @name loadbalancers.LoadBalancersFilter
* @description
* Filter which refines the collection of rows based on the criteria provided. If no criteria are selected,
* the filter will return the entire collection of rows.  The filter leverages an 'AND' search so as more
* criteria are selected more results will be filtered out.
*
* This code is based off of Freddy's filter used on billing-ui:
* https://github.com/rackerlabs/billing-ui/blob/master/app/scripts/billing/billingFilters.js 
*
* rows - collection of rows to be filtered.
* filter - Object which includes the criteria for filtering the list of rows.
*     - **reference** {String} - Reference id for the row.
*/
angular.module('loadbalancers')
    .filter('LoadBalancersFilter', ['$filter', function ($filter) {
        var tFilter = {
                isRefMatch: function (row, filter) {
                    var keyword = angular.lowercase(filter.keyword);

                    return keyword ?
                        _.contains(angular.lowercase($filter('date')(row.created.time, 'short')), keyword) ||
                        _.contains(angular.lowercase($filter('date')(row.updated.time, 'short')), keyword)
                        : true;
                }
            };
            
        return function (rows, filter) {
            filter = filter ? filter : {};

            var originalFilter = $filter('filter')(rows, filter.keyword),
                additionalFilters = _.filter(rows, function (row) {
                    return tFilter.isRefMatch(row, filter);
                });

            return _.union(originalFilter, additionalFilters);
        };
    }])
     /**
    * @ngdoc filter
    * @name LoadBalancersFilterModal
    * @description
    * this filter finds the matching pattern in name and address column of object in array.
    * rows - collection of row to be filtered.
    * filter - Object with keyword property using which pattern to search in rows.
    */
    .filter('LoadBalancersFilterModal', function () {

        var isMatch = function (row, keyword, property) {
            return _.contains(angular.lowercase(row[property]), keyword);
        };
            
        return function (rows, filter) {

            if (!filter || _.isEmpty(filter.searchKey)) {
                return rows;
            }

            var keyword = angular.lowercase(filter.searchKey);

            var addressFilterResults = _.filter(rows, function (row) {
                return isMatch(row, keyword, 'ipAddress');
            });

            var nameFilterResults = _.filter(rows, function (row) {
                return isMatch(row, keyword, 'name');
            });

            return _.union(nameFilterResults, addressFilterResults);
        };
    });

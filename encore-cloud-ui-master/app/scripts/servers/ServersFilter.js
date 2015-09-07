angular.module('servers')
    /**
    * @ngdoc filter
    * @name encore.filter:ServersFilter
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
    .filter('ServersFilter', ['$filter', function ($filter) {
        var tFilter = {
                isRefMatch: function (row, keyword) {
                    var formattedDate = angular.lowercase($filter('date')(row.created, 'short'));
                    return _.contains(formattedDate, keyword);
                }
            };

        var isMatch = function (row, keyword, property) {
            return _.contains(angular.lowercase(row[property]), keyword);
        };

        var isDeepMatch = function (row, keyword, parentProperty, childProperty) {
            return _.contains(angular.lowercase(row[parentProperty][childProperty]), keyword);
        };

        var hasIpMatch = function (row, keyword) {
            var ipv4s = (_.pluck(row.getIPV4Addresses(), 'ip_address')).join(' ');
            return _.contains(ipv4s, keyword);
        };

        return function (rows, filter) {

            if (!filter || _.isEmpty(filter.keyword)) {
                return rows;
            }

            var keyword = angular.lowercase(filter.keyword);

            var timeFilter = _.filter(rows, function (row) {
                return tFilter.isRefMatch(row, keyword);
            });

            var nameFilterResults = _.filter(rows, function (row) {
                return isMatch(row, keyword, 'name');
            });

            var genFilterResults = _.filter(rows, function (row) {
                return isMatch(row, keyword, 'gen');
            });

            var uuidFilterResults = _.filter(rows, function (row) {
                return isMatch(row, keyword, 'id');
            });

            var regionFilterResults = _.filter(rows, function (row) {
                return isMatch(row, keyword, 'region');
            });

            var flavorFilterResults = _.filter(rows, function (row) {
                return isDeepMatch(row, keyword, 'flavor', 'name');
            });

            var imageFilterResults = _.filter(rows, function (row) {
                return isDeepMatch(row, keyword, 'image', 'name');
            });

            var ipFilterResults = _.filter(rows, function (row) {
                return hasIpMatch(row, keyword);
            });

            return _.union(timeFilter, nameFilterResults, genFilterResults,
                regionFilterResults, uuidFilterResults, imageFilterResults,
                flavorFilterResults, ipFilterResults);
        };
    }]);

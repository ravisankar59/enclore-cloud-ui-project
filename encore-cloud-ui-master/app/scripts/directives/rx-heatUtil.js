/**
* @ngdoc service
* @name heat:HeatUtil
* @requires encore.ui.rxEnvironment:Environment
* @description
* Collection of utility functions to be used with Heat.
*/
angular.module('heat')
.factory('HeatUtil', function (Environment) {
    var heatUrls = {
        staging: 'https://heat-ui.rs-heat.com/auth/creds/',
        production: 'https://heat.rackspace.com/auth/creds/'
    };
    var utils = {
        getUrl: function () {
            // Matches encore.rackspace.com or preprod.encore.rackspace.com
            if (Environment.isUnifiedProd() || Environment.isPreProd()) {
                return heatUrls.production;
                // Will match staging.encore.rackspace.com
            } else if (Environment.isUnifiedPreProd() || Environment.isLocal()) {
                return heatUrls.staging;
            }
        }
    };
    return {
        url: utils.getUrl
    };
});

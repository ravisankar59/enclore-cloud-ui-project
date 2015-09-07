/**
*	@ngdoc service
*	@name backup.BackupUtil
*	@requires encore.ui.rxEnviroment: Environment
*	@description
*	Collection of utility functions used with backup 
*/
angular.module('backup')

	.factory('BackupUtil', function (Environment) {
		
        var backupUrls = {
			staging: {
                US: 'https://clouddrive.rackspace.com/account/racker-login',
                UK: 'https://clouddrive.rackspace.co.uk/account/racker-login'
            },
            production: {
                US: 'https://clouddrive.rackspace.com/account/racker-login',
                UK: 'http://cp.drivesrvr-staging.co.uk/account/racker-login'
            }
		};

		var utils = {
			getUrl: function (region) {
				if (Environment.isUnifiedProd() || Environment.isPreProd()) {
                    if (region === 'US') {
                        return backupUrls.production.US;
                    } else if (region === 'UK') {
                        return backupUrls.production.UK;
                    }
				} else if (Environment.isUnifiedPreProd() || Environment.isLocal()) {
                    if (region === 'US') {
                        return backupUrls.staging.US;
                    } else if (region === 'UK') {
                        return backupUrls.staging.UK;
                    }
				}
			}
		};
        return utils;
    });

var lbaasOverviewPage = require('../../../pages/lbaas/overview.page');
var tf = require('../../../pages/test-fixtures/ui');
var api = require('../../../api-helper/api').lbaas;

describe('Load Balancers Overview Page - Page Actions', function () {

    before(function () {
        lbaasOverviewPage.go();
    });

    afterEach(function () {
        loginPage.driver.navigate().refresh();
    });

    describe('Midway Tests', function () {

        describe('LB Delete @dev', function () {
            it('should delete test_load_balancer @dev',  function () {
                var lbQuery = { name: 'test_load_balancer' };
                var filter = lbQuery.name;
                var successMsg = 'Load Balancer "test_load_balancer" delete ' +
                    'successfully initiated. It will take a few moments to complete.';
                lbaasOverviewPage.deleteLoadBalancer(lbQuery, filter);
                expect(encore.rxNotify.all.exists(successMsg, 'success')).to.eventually.be.true;
            });

            it('should fail to delete zzz_bad_load_balancer @dev', function () {
                var lbQuery = { name: 'test_bad_del_balancer' };
                var filter = lbQuery.name;
                lbaasOverviewPage.deleteLoadBalancer(lbQuery, filter);
                var errorMsg = 'Error deleting Load Balancer test_bad_del_balancer';
                expect(encore.rxNotify.all.exists(errorMsg, 'error')).to.eventually.be.true;
            });
        });

        // LB Rename not currently enabled on overview page
        describe.skip('LB Rename @dev', function () {
            it.skip('should rename test_rename_load_balancer @dev', function () {
                var lbQuery = { name: 'test_rename_load_balancer' };
                var lnNewName = 'test_rename_load_balancer_target';
                var filter = lbQuery.name;
                lbaasOverviewPage.renameLoadBalancer(lbQuery, filter, lnNewName);
                expect(encore.rxNotify.all.exists('Name changed.', 'success')).to.eventually.be.true;
            });

            it.skip('should fail to rename zzz_bad_rename_load_balancer @dev', function () {
                var lbQuery = { name: 'zzz_bad_rename_load_balancer' };
                var lnNewName = 'zzz_bad_rename_load_balancer_target';
                var filter = lbQuery.name;
                lbaasOverviewPage.renameLoadBalancer(lbQuery, filter, lnNewName);
                expect(encore.rxNotify.all.exists('Error changing name:', 'error')).to.eventually.be.true;
            });
        });

        describe('LB Connection Logging @dev', function () {
            it('should be able to Enable Connection Logging on a load balancer @dev', function () {
                // https://jira.rax.io/browse/DCXAPPS-1106
                var lbQuery = { name: 'test_disabled_lb' };
                var filter = lbQuery.name;
                var enabledMsg = 'Logging enabled for "test_disabled_lb" (#57364)';
                lbaasOverviewPage.enableLogging(lbQuery, filter);
                expect(encore.rxNotify.all.exists(enabledMsg)).to.eventually.be.true;
            });

            it('should be able to Disable Connection Logging on a load balancer @dev', function () {
                // https://jira.rax.io/browse/DCXAPPS-1106
                var lbQuery = { name: 'test_enabled_lb' };
                var filter = lbQuery.name;
                var disabledMsg = 'Logging disabled for "test_enabled_lb" (#57363)';
                lbaasOverviewPage.disableLogging(lbQuery, filter);
                expect(encore.rxNotify.all.exists(disabledMsg)).to.eventually.be.true;
            });
        });

        describe('LB Connection Content Caching @dev', function () {
            it('should be able to Enable Connection Content Caching on a load balancer @dev', function () {
                // https://jira.rax.io/browse/DCXAPPS-1106
                var lbQuery = { name: 'test_disabled_lb' };
                var filter = lbQuery.name;
                var enabledMsg = 'Content Caching enabled for "test_disabled_lb" (#57364)';
                lbaasOverviewPage.enableContentCaching(lbQuery, filter);
                expect(encore.rxNotify.all.exists(enabledMsg)).to.eventually.be.true;
            });

            it('should be able to Disable Connection Content Caching on a load balancer @dev', function () {
                // https://jira.rax.io/browse/DCXAPPS-1106
                var lbQuery = { name: 'test_enabled_lb' };
                var filter = lbQuery.name;
                var disabledMsg = 'Content Caching disabled for "test_enabled_lb" (#57363)';
                lbaasOverviewPage.disableContentCaching(lbQuery, filter);
                expect(encore.rxNotify.all.exists(disabledMsg)).to.eventually.be.true;
            });
        });

        describe('LB Connection Throttling @dev', function () {
            it('should be able to Enable Connection Throttling on a load balancer @dev', function () {
                // https://jira.rax.io/browse/DCXAPPS-1108
                var lbQuery = { name: 'test_disabled_lb' };
                var filter = lbQuery.name;
                var options = { maxConnections: 1 };
                var enabledMsg = 'Enabled Connection Throttle for test_disabled_lb (#57364)';
                lbaasOverviewPage.enableThrottling(lbQuery, filter, options);
                expect(encore.rxNotify.all.exists(enabledMsg)).to.eventually.be.true;
            });

            it('should be able to Disable Connection Throttling on a load balancer @dev', function () {
                // https://jira.rax.io/browse/DCXAPPS-1108
                var lbQuery = { name: 'test_enabled_lb' };
                var filter = lbQuery.name;
                var disabledMsg = 'Disabled Connection Throttle for test_enabled_lb (#57363)';
                lbaasOverviewPage.disableThrottling(lbQuery, filter);
                expect(encore.rxNotify.all.exists(disabledMsg)).to.eventually.be.true;
            });
        });

        describe('LB Health Monitoring @dev', function () {
            it('should be able to Enable Health Monitoring on a load balancer @dev', function () {
                // https://jira.rax.io/browse/DCXAPPS-1111
                var lbQuery = { name: 'test_disabled_lb' };
                var filter = lbQuery.name;
                var enabledMsg = 'Health monitoring updated';
                lbaasOverviewPage.enableHealthMonitoring(lbQuery, filter, 'CONNECT', 10, 5, 2);
                expect(encore.rxNotify.all.exists(enabledMsg)).to.eventually.be.true;
            });

            it('should be able to Disable Health Monitoring on a load balancer @dev', function () {
                // https://jira.rax.io/browse/DCXAPPS-1111
                var lbQuery = { name: 'test_enabled_lb' };
                var filter = lbQuery.name;
                var disabledMsg = 'Disabled Health Monitoring for test_enabled_lb';
                lbaasOverviewPage.disableHealthMonitoring(lbQuery, filter);
                expect(encore.rxNotify.all.exists(disabledMsg)).to.eventually.be.true;
            });
        });
    });

    describe('Regression Tests', function () {

        describe('LB Delete  #regression', function () {
            it('should be able to Delete a load balancer #regression',  function () {
                var lb = tf.lbDelete;
                lbaasOverviewPage.deleteLoadBalancer(lb, lb.name);
                var successMsg = 'Load Balancer "' + lb.name + '" delete ' +
                    'successfully initiated. It will take a few moments to complete.';

                expect(encore.rxNotify.all.exists(successMsg, 'success')).to.eventually.be.true;
            });
        });

        // LB Rename not currently enabled on overview page
        describe.skip('LB Rename  #regression', function () {
            it.skip('should be able to Rename a load balancer #regression', function () {
                var lb = tf.lbDelete;
                var lbNew = tf.lbChangeNameSuccess;

                lbaasOverviewPage.renameLoadBalancer(lb, lb.name, lbNew.name);
                expect(encore.rxNotify.all.exists('Name changed.', 'success')).to.eventually.be.true;
            });
        });

        describe('LB Connection Logging  #regression', function () {
            it('should be able to Enable Connection Logging on a load balancer #regression', function () {
                // https://jira.rax.io/browse/DCXAPPS-1106
                var lb = tf.lbOverviewLogging;
                var enabledMsg = 'Logging enabled for "' + lb.name + '"';

                api.setConnectionLogging(lb.name, false);
                lbaasOverviewPage.go();
                lbaasOverviewPage.enableLogging(lb, lb.name);

                expect(encore.rxNotify.all.exists(enabledMsg)).to.eventually.be.true;
            });

            it('should be able to Disable Connection Logging on a load balancer #regression', function () {
                // https://jira.rax.io/browse/DCXAPPS-1106
                var lb = tf.lbOverviewLogging;
                var disabledMsg = 'Logging disabled for "' + lb.name + '"';

                api.setConnectionLogging(lb.name, true);
                lbaasOverviewPage.go();
                lbaasOverviewPage.disableLogging(lb, lb.name);

                expect(encore.rxNotify.all.exists(disabledMsg)).to.eventually.be.true;
            });
        });

        describe('LB Connection Throttling  #regression', function () {
            it('should be able to Enable Connection Throttling on a load balancer #regression', function () {
                // https://jira.rax.io/browse/DCXAPPS-1108
                var lb = tf.lbOverviewThrottling;
                var options = {
                    maxConnections: 1
                };
                var enabledMsg = 'Enabled Connection Throttle for ' + lb.name;

                api.setConnectionThrottling(lb.name, false);
                lbaasOverviewPage.go();
                lbaasOverviewPage.enableThrottling(lb, lb.name, options);

                expect(encore.rxNotify.all.exists(enabledMsg)).to.eventually.be.true;
            });

            it('should be able to Disable Connection Throttling on a load balancer #regression', function () {
                // https://jira.rax.io/browse/DCXAPPS-1108
                var lb = tf.lbOverviewThrottling;
                var disabledMsg = 'Disabled Connection Throttle for ' + lb.name;
                api.setConnectionThrottling(lb.name, true);
                lbaasOverviewPage.go();
                lbaasOverviewPage.disableThrottling(lb, lb.name);

                expect(encore.rxNotify.all.exists(disabledMsg)).to.eventually.be.true;
            });
        });

        describe('LB Health Monitoring  #regression', function () {
            it('should be able to Enable Health Monitoring on a load balancer #regression', function () {
                // https://jira.rax.io/browse/DCXAPPS-1111
                var lb = tf.lbOverviewHealthMonitoring;
                var enabledMsg = 'Health monitoring updated';

                api.setHealthMonitoring(lb.name, false);
                lbaasOverviewPage.go();
                lbaasOverviewPage.enableHealthMonitoring(lb, lb.name, 'CONNECT', 10, 5, 2);
                expect(encore.rxNotify.all.exists(enabledMsg)).to.eventually.be.true;
            });

            it('should be able to Disable Health Monitoring on a load balancer #regression', function () {
                // https://jira.rax.io/browse/DCXAPPS-1111
                var lb = tf.lbOverviewHealthMonitoring;
                var disabledMsg = 'Disabled Health Monitoring for ' + lb.name;

                api.setHealthMonitoring(lb.name, true);
                lbaasOverviewPage.go();
                lbaasOverviewPage.disableHealthMonitoring(lb, lb.name);

                expect(encore.rxNotify.all.exists(disabledMsg)).to.eventually.be.true;
            });
        });
    });
});

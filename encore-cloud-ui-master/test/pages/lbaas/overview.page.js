var Page = require('astrolabe').Page;
var basePage = require('../base');
var overviewTable = require('./overview/overviewTable');

var lbaasOverviewPage = Page.create({
    url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/loadbalancers';
        }
    },

    title: {
        get: function () { return basePage.pageTitle; }
    },

    subtitle: {
        get: function () { return basePage.pageSubtitle; }
    },

    loadBalancerCreate: {
        get: function () {
            return $('.create-instance');
        }
    },

    loadBalancersPagination: {
        get: function () {
            return $('.loadbalancers-list .pagination');
        }
    },

    loadbalancerFilterTab: {
        get: function () {
            return $('.table-filters header a');
        }
    },

    loadBalancerFilter: {
        get: function () {
            return $('.filter-box');
        }
    },

    deleteLoadBalancer: {
        value: function (lbQuery, filter) {
            var page = this;
            page.table.findLoadBalancer(lbQuery, filter).then(function (lb) {
                lb.actionMenu.action('Delete Load Balancer').openModal();
                page.deleteModal.submit();
            });
        }
    },

    enableLogging: {
        value: function (lbQuery, filter) {
            var page = this;
            page.table.findLoadBalancer(lbQuery, filter).then(function (lb) {
                lb.actionMenu.action('Enable Logging').openModal();
                page.connLoggingModal.submit();
            });
        }
    },

    disableLogging: {
        value: function (lbQuery, filter) {
            var page = this;
            page.table.findLoadBalancer(lbQuery, filter).then(function (lb) {
                lb.actionMenu.action('Disable Logging').openModal();
                page.connLoggingModal.submit();
            });
        }
    },

    enableContentCaching: {
        value: function (lbQuery, filter) {
            var page = this;
            page.table.findLoadBalancer(lbQuery, filter).then(function (lb) {
                lb.actionMenu.action('Enable Content Caching').openModal();
                page.connLoggingModal.submit();
            });
        }
    },

    disableContentCaching: {
        value: function (lbQuery, filter) {
            var page = this;
            page.table.findLoadBalancer(lbQuery, filter).then(function (lb) {
                lb.actionMenu.action('Disable Content Caching').openModal();
                page.connLoggingModal.submit();
            });
        }
    },

    enableThrottling: {
        value: function (lbQuery, filter, opts) {
            var page = this;
            page.table.findLoadBalancer(lbQuery, lbQuery.name).then(function (lb) {
                lb.actionMenu.action('Enable Connection Throttling').openModal();
                page.connThrottlingModal.txtMaxConnections = opts.maxConnections;
                page.connThrottlingModal.submit();
            });
        }
    },

    disableThrottling: {
        value: function (lbQuery, filter) {
            var page = this;
            page.table.findLoadBalancer(lbQuery, filter).then(function (lb) {
                lb.actionMenu.action('Disable Connection Throttling').openModal();
                page.connThrottlingModal.submit();
            });
        }
    },

    enableHealthMonitoring: {
        value: function (lbQuery, filter, type, timeout, delay, attempts) {
            var page = this;
            var data = {
                type: type,
                delay: delay,
                timeout: timeout,
                attempts: attempts
            };
            page.table.findLoadBalancer(lbQuery, lbQuery.name).then(function (lb) {
                lb.actionMenu.action('Enable Health Monitoring').openModal();
                page.healthMonitoringModal.filloutFields(data);
                page.healthMonitoringModal.submit();
            });
        }
    },

    disableHealthMonitoring: {
        value: function (lbQuery, filter) {
            var page = this;
            page.table.findLoadBalancer(lbQuery, filter).then(function (lb) {
                lb.actionMenu.action('Disable Health Monitoring').openModal();
                page.healthMonitoringModal.submit();
            });
        }
    },

    lnkCreateLoadBalancer: {
        get: function () { return $('a.create-instance'); }
    },

    lnkReach: {
        get: function () {
            return element(by.cssContainingText('a', 'Go to Reach Load Balancers'));
        }
    },

    openStatusFilterDropDown:{
        value: function () {
            return $('.status-filter .preview.ng-binding').click();
        }
    },

    toggleStatus: {
        value: function (status, toogleBool) {
            var checkElement = element(by.css('rx-select-option[value="' + status + '"] *[type="checkbox"]'));
            checkElement.isSelected().then(function (selected) {
                if (selected !== toogleBool) {
                    checkElement.click();
                } else {
                    if (status === 'all' && !toogleBool) {
                        browser.actions().doubleClick(checkElement).perform();
                    }
                }
            });
        }
    }
});

// tables
lbaasOverviewPage.table = overviewTable;

// modals
lbaasOverviewPage.deleteModal = require('./modals/delete');
lbaasOverviewPage.healthMonitoringModal = require('./modals/healthMonitoring');
lbaasOverviewPage.connLoggingModal = require('./modals/connectionLogging');
lbaasOverviewPage.connThrottlingModal = require('./modals/connectionThrottling');

module.exports = lbaasOverviewPage;

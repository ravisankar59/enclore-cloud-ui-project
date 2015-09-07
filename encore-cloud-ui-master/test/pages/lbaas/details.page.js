var Page = require('astrolabe').Page;
var basePage = require('../base');
var lbaasOverviewPage = require('./overview.page');

var lbaasDetailsPage = Page.create({

    url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/loadbalancers/STAGING';
        }
    },

    open: {
        value: function (name) {
            // To filter out DELETED status LBaaS
            var query = { name: name, status: 'ACTIVE' };
            var filter = query.name;
            if (basePage.isInMidwayEnvironment()) {
                var midwayLbId = '57361';
                query = (_.isString(query)) ? query : midwayLbId;
                return this.go(query);
            }
            lbaasOverviewPage.go();
            lbaasOverviewPage.table.viewLBDetails(query, filter);
            basePage.disableRxNotifyTimeout();
        }
    },
    btnGoToReach: {
        get: function () { return element(by.cssContainingText('.rx-reach-link-action', 'Go to Reach')); }
    },
    btnSuspendLoadBalancer: {
        get: function () { return element(by.cssContainingText('rx-modal-action a', 'Suspend Load Balancer')); }
    },

    btnAddCloudServers: {
        get: function () { return element(by.cssContainingText('rx-modal-action a', 'Add Cloud Servers')); }
    },

    btnMoveHost: {
        get: function () { return element(by.cssContainingText('rx-modal-action a', 'Move Host')); }
    },

    btnErrorPage: {
        get: function () { return element(by.cssContainingText('rx-modal-action a', 'Edit Error Page')); }
    },

    btnDeleteLoadBalancer: {
        // https://jira.rax.io/browse/DCXAPPS-1113
        get: function () { return element(by.cssContainingText('rx-modal-action a', 'Delete Load Balancer')); }
    },

    btnSyncLoadBalancer: {
        get: function () { return element(by.cssContainingText('.msg-info a', 'Sync Load Balancer')); }
    },

    btnAddVirtualIp: {
        get: function () { return element(by.cssContainingText('rx-modal-action a', 'Add Virtual IP')); }
    },

    btnAddAccessControlRule: {
        get: function () { return element(by.cssContainingText('rx-modal-action a', 'Add Access Control Rule')); }
    },

    btnAddExternalNodes: {
        get: function () { return element(by.cssContainingText('rx-modal-action a', 'Add External Nodes')); }
    },

    btnViewHistoricalUsage: {
        get: function () { return element(by.cssContainingText('.actions-item a', 'View Historical Usage')); }
    },

    btnEditLoadBalancer: {
        get: function () { return element(by.cssContainingText('rx-modal-action a', 'Edit Load Balancer Details')); }
    },
    
    btnUnSuspendLoadBalancer: {
        get: function () { return element(by.cssContainingText('rx-modal-action a', 'Unsuspend Load Balancer')); }
    },

    isClickable: {
        value: function (linkName) {
            return this[linkName].getCssValue('pointer-events').then(function (val) {
                return val !== 'none';
            });
        }
    },

    IsActionsMenuClickable: {
        value: function () {
            return element.all(by.css('.action-menu-container i')).
                getCssValue('pointer-events').then(function (val) {
                return val;
            });
        }
    },

    notification: {
        get: function () {
            return element.all(by.css('rx-notification')).getText().then(function (value) {
                return value;
            });
        }
    }
});

// tables
lbaasDetailsPage.detailsTable = require('./details/detailsTable');
lbaasDetailsPage.settingsTable = require('./details/settingsTable');
lbaasDetailsPage.nodesTable = require('./details/nodesTable');
lbaasDetailsPage.ipsTable = require('./details/ipsTable');
lbaasDetailsPage.accessTable = require('./details/accessTable');

// modals
lbaasDetailsPage.cachingModal = require('./modals/cachingModal');
lbaasDetailsPage.changeNameModal = require('./modals/changeName');
lbaasDetailsPage.connLoggingModal = require('./modals/connectionLogging');
lbaasDetailsPage.connThrottlingModal = require('./modals/connectionThrottling');
lbaasDetailsPage.addConnectionThrottlingModal = require('./modals/addConnectionThrottling');
lbaasDetailsPage.addTemporaryRateLimitModal = require('./modals/addTemporaryRateLimit');
lbaasDetailsPage.addVirtualIpModal = require('./modals/addVirtualIpModal');
lbaasDetailsPage.healthMonitoringModal = require('./modals/healthMonitoring');
lbaasDetailsPage.deleteModal = require('./modals/delete');
lbaasDetailsPage.editNodeModal = require('./modals/editNode');
lbaasDetailsPage.deleteVipModal = require('./modals/deleteVip');
lbaasDetailsPage.errorPageModal = require('./modals/errorPage');
lbaasDetailsPage.addCloudServersModal = require('./modals/addCloudServers');
lbaasDetailsPage.addExternalNodes = require('./modals/addExternalNodes');
lbaasDetailsPage.addAccessControlRule = require('./modals/addAccessControlRule');
lbaasDetailsPage.suspendLoadBalancerModal = require('./modals/suspendLoadBalancer');
lbaasDetailsPage.moveHostModal = require('./modals/moveHost');
lbaasDetailsPage.editLoadBalancerModal = require('./modals/editLoadBalancer');
lbaasDetailsPage.unSuspendLoadBalancerModal = require('./modals/unSuspendLoadBalancer');
lbaasDetailsPage.sessionPersistenceModal = require('./modals/sessionPersistence');
lbaasDetailsPage.sslTerminationModal = require('./modals/sslTermination');

module.exports = lbaasDetailsPage;

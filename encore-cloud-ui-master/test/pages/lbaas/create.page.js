var _ = require('lodash');
var Page = require('astrolabe').Page;
var basePage = require('../../pages/base.js');

var lbaasCreatePage = Page.create({
    url: {
        get: function () {
            var user = this.driver.params.user;
            var accountNumber = this.driver.params.accountNumber;
            return '/cloud/' + accountNumber + '/' + user + '/loadbalancers/create';
        }
    },

    title: {
        get: function () { return basePage.pageTitle; }
    },

    lblName: {
        get: function () { return $('rx-form-item[label="Name"] label.field-label'); }
    },

    txtName: {
        get: function () { return $('#name'); },
        set: function (name) {
            this.txtName.clear();
            this.txtName.sendKeys(name);
        }
    },

    txtNameLength: {
        get: function () {
            return this.txtName.getAttribute('value').then(function (data) {
                return data.length;
            });
        }
    },

    lblRegion: {
        get: function () { return $('rx-form-item[label="Region"] label.field-label'); }
    },

    selRegion: {
        get: function () { return $('#region'); },
        set: function (region) {
            basePage.selectItem(this.selRegion, 'option', region);
        }
    },

    lblVirtualIp: {
        get: function () { return $('rx-form-item[label="Virtual IP"] label.field-label'); }
    },

    selVirtualIp: {
        get: function () { return $('#virtualIp'); },
        set: function (virtualIp) {
            basePage.selectItem(this.selVirtualIp, 'option', virtualIp);
        }
    },

    sharedVirtualIps: {
        get: function () { return $('rx-option-table[field-id="sharedVip"]'); }
    },

    noSharedVirtualIps: {
        get: function () {
            return $('.sharedVip .msg-warn');
        }
    },

    lblProtocol: {
        get: function () { return $('rx-form-item[label="Protocol"] label.field-label'); }
    },

    selProtocol: {
        get: function () { return $('#protocol'); },
        set: function (protocol) {
            basePage.selectItem(this.selProtocol, 'option', protocol);
        }
    },

    numPort: {
        get: function () { return $('#port'); },
        set: function (port) {
            this.numPort.clear();
            this.numPort.sendKeys(port);
        }
    },

    numPortText: {
        get: function () {
            return this.numPort.getAttribute('value').then(function (data) {
                return data;
            });
        }
    },

    lblAlgorithm: {
        get: function () { return $('rx-form-item[label="Algorithm"] label.field-label'); }
    },

    selAlgorithm: {
        get: function () { return $('#algorithm'); },
        set: function (algorithm) {
            basePage.selectItem(this.selAlgorithm, 'option', algorithm);
        }
    },

    lblTimeout: {
        get: function () { return $('rx-form-item[label="Timeout"] label.field-label'); }
    },

    numTimeout: {
        get: function () { return $('#timeout'); }
    },

    lblNodes: {
        get: function () { return $('div.page-content > div > div > form > div > span.title'); }
    },

    btnAddCloudServers: {
        get: function () { return element(by.cssContainingText('a', 'Add Cloud Servers')); }
    },

    btnAddExternalNodes: {
        get: function () { return element(by.cssContainingText('a', 'Add External Nodes')); }
    },

    submit: {
        get: function () { return $('#btnCreateLoadBalancer'); }
    },

    cancel: {
        get: function () { return $('#btnCancelLoadBalancer'); }
    },

    filloutFields: {
        value: function (lb) {
            var page = this;
            var fields = {
                name: 'txtName',
                region: 'selRegion',
                protocol: 'selProtocol',
                port: 'numPort',
                virtualIp: 'selVirtualIp',
                algorithm: 'selAlgorithm',
            };

            _.each(lb, function (val, field) {
                if (_.has(fields, field)) {
                    if (_.isObject(val)) {
                        page[fields[field]] = val.type;
                        page.sharedVipTable.selectSharedVip(val.rowToBeSelected);
                    } else {
                        page[fields[field]] = val;
                    }
                }
            });

            if (!_.isEmpty(lb.cloudServers)) {
                page.btnAddCloudServers.click();
                page.serversModal.addServersIP(lb.cloudServers);

                _.each(lb.cloudServers, function (server) {
                    if (server.port) {
                        page.nodes.changeNodePort(server);
                    }
                });
            }
            if (!_.isEmpty(lb.externalNodes)) {
                _.each(lb.externalNodes, function (node) {
                    page.btnAddExternalNodes.click();
                    page.nodesModal.addExternalNode(node.ip, node.port);
                });
            }
        }
    },

    createLoadBalancer: {
    /**
     * Creates load balancer on create page
     * lb.name: lb name
     * lb.virtualIp: lb virtualIp
     * lb.protocol: lb protocol
     * lb.algorithm: lb algorithm
     * lb.port: lb port number
     */
        value: function (lb) {
            this.filloutFields(lb);
            // Disable troublesome message auto-dismissal
            basePage.disableRxNotifyTimeout();
            return this.submit.click();
        }
    }
});

// tables
lbaasCreatePage.nodes = require('./create/nodesTable');
lbaasCreatePage.sharedVipTable = require('./create/sharedVipTable');

// modals
lbaasCreatePage.nodesModal = require('./modals/externalNodesModal');
lbaasCreatePage.serversModal = require('./modals/cloudServersModal');
module.exports = lbaasCreatePage;

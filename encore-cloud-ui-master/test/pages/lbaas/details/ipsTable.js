var _ = require('lodash');
var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');
var tblCommon = require('../../base/tablesCommon');
var actionCog = require('../../base/actionCog');

var ipsTable = {

    cssIpsTable: {
        get: function () { return '.loadBalancer-virtualIps '; }
    },

    cssIpRows: {
        get: function () { return this.cssIpsTable + 'tbody tr '; }
    },

    cssIpHeaders: {
        get: function () { return this.cssIpsTable + 'thead th '; }
    },

    element: {
        get: function () { return $(this.cssIpsTable); }
    },

    tblIpHeaders: {
        get: function () { return $$(this.cssIpHeaders); }
    },

    tblIpAddressRows: {
        get: function () { return $$(this.cssIpRows); }
    },

    headers: {
        get: function () { return tblUtil.getTableHeaders(this.tblIpHeaders); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    openDeleteVip: {
        value: function (ipAddress) {
            this.openAction(ipAddress, 'Delete VIP');
        }
    },

    length: {
        get: function () {
            return $$(this.cssIpRows).count();
        }
    },

    openAction: {
        value: function (ipAddress, actionName) {
            this.find({ 'IP Address': ipAddress }).then(function (ip) {
                ip.Actions.expand().then(function (actions) {
                    actions[actionName].click();
                });
            });
        }
    },

    data: {
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssIpHeaders, this.cssIpRows).then(function (tableData) {
                return page.tblIpAddressRows.then(function (rows) {
                    return _.map(tableData, function (row, index) {
                        rows[index].$('td:last-of-type').then(function (cogElement) {
                            row.Actions = actionCog(cogElement);
                        });
                        return row;
                    });
                });
            });
        }
    },

    txtFilter: {
        get: function () { return this.element.$('rx-search-box input'); }
    },

};

ipsTable = tblCommon.wrap(ipsTable);
module.exports = Page.create(ipsTable);

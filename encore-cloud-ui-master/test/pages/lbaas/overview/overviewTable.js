var _ = require('lodash');
var Page = require('astrolabe').Page;
var moment = require('moment');
var actionCog = require('../../base/actionCog');
var tblUtil = require('../../base/util/tables');
var tblCommon = require('../../base/tablesCommon');
var basePage = require('../../base');

var lbaasOverviewTable = {

    cssOverviewTable: {
        get: function () { return 'table.loadbalancers-list '; }
    },

    cssOverviewHeaders: {
        get: function () {
            var rxSortableColumns = this.cssOverviewTable + 'thead tr:last-of-type th span.ng-scope,' +
                                    this.cssOverviewTable + 'thead tr:last-of-type th:last-of-type';
            return rxSortableColumns;
        }
    },

    cssOverviewRows: {
        get: function () { return this.cssOverviewTable + 'tbody tr '; }
    },

    element: {
        get: function () { return $(this.cssOverviewTable); }
    },

    tblHeaders: {
        get: function () { return $$(this.cssOverviewHeaders); }
    },

    tblRows: {
        get: function () { return $$(this.cssOverviewRows); }
    },

    ipColumns: {
        value: function (index) {
            return this.tblRows.get(index).$('td:nth-of-type(3)');
        }
    },

    ipTooltips: {
        value: function (index) {
            return this.ipColumns(index).$('.tooltip');
        }
    },

    headers: {
        get: function () { return tblUtil.getTableHeaders(this.tblHeaders); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    rawData: {
        value: function () { return tblUtil.getTableData(this.cssOverviewHeaders, this.cssOverviewRows); }
    },

    data: {
        value: function () {
            var page = this;
            return page.rawData().then(function (tableData) {
                return page.tblRows.then(function (rows) {
                    return _.map(tableData, function (row, index) {
                        row.name = row['Name (ID)'].split('\n')[0].trim();
                        row.id = row['Name (ID)'].split('\n')[1].trim();
                        row.ip = row['IP Address'].split('\n')[0].trim();
                        row.protocol = row['Protocol (Port)'].split(' ')[0];
                        row.port = row['Protocol (Port)'].split(' ')[1];
                        row.createdAt = moment(row['Created Date'], 'M-D-YY hh:mm a');
                        row.updatedAt = moment(row['Updated Date'], 'M-D-YY hh:mm a');

                        rows[index].$('td:first-of-type').getAttribute('tooltip-content').then(function (statusColumn) {
                            row.status = statusColumn;
                        });

                        rows[index].$('td:nth-of-type(2)').then(function (nameColumn) {
                            var viewDetails = nameColumn.$('a').click;
                            row.viewDetails = viewDetails;
                        });

                        rows[index].$('td:last-of-type').then(function (cog) {
                            row.Actions = actionCog(cog);
                            row.actionMenu = encore.rxActionMenu.initialize(cog);
                        });

                        rows[index].$('td:last-of-type rx-action-menu div').then(function (cog) {
                            row.cogVisible = cog.isDisplayed();
                        });

                        return row;
                    });
                });
            });
        }
    },

    getAllStatuses: {
        value: function () {
            return this.tblRows.$$('td:first-of-type').getAttribute('tooltip-content').then(function (status) {
                return _.uniq(status);
            });
        }
    },

    findLoadBalancer: {
        value: function (query, filter) {
            // To filter out DELETED status LBaaS
            query.status = query.status || 'ACTIVE';
            return this.find(query, filter).then(function (lb) {
                if (_.isUndefined(lb)) {
                    throw new Error('Unable to find LB with query: ' + JSON.stringify(query));
                }
                return lb;
            });
        }
    },

    deleteLoadBalancer: {
        value: function (lbQuery, filter) {
            this.findLoadBalancer(lbQuery, filter).then(function (lbaasRow) {
                lbaasRow.Actions.expand().then(function (actions) {
                    actions['Delete Load Balancer'].click();
                    basePage.modal.submit();
                });
            });
        }
    },

    viewLBDetails: {
        value: function (lbQuery, filter) {
            return this.findLoadBalancer(lbQuery, filter).then(function (lbaasRow) {
                if (_.isUndefined(lbaasRow.viewDetails)) {
                    throw new Error('Unable to find load balancer with query: ' + JSON.stringify(lbQuery));
                } else {
                    return lbaasRow.viewDetails();
                }
            });
        }
    }
};

lbaasOverviewTable = tblCommon.wrap(lbaasOverviewTable);
module.exports = Page.create(lbaasOverviewTable);

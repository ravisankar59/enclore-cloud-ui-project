var _ = require('lodash');
var Page = require('astrolabe').Page;
var rxpo = require('rx-page-objects');
var tblUtil = require('../../base/util/tables');
var tblCommon = require('../../base/tablesCommon');
var actionCog = require('../../base/actionCog');

var instancesTable = {

    cssInstancesTable: {
        get: function  () { return 'table.instance-list '; }
    },

    cssInstanceHeaders: {
        get: function () {
            var rxSortableColumns = this.cssInstancesTable + 'th.column-title span.ng-scope ';
            var unsortableColumns = this.cssInstancesTable + 'thead th.column-title:last-of-type';
            return [rxSortableColumns, unsortableColumns].join();
        }
    },

    cssInstanceRows: {
        get: function () { return this.cssInstancesTable + 'tbody tr '; }
    },

    headers: {
        get: function () { return tblUtil.getTableHeaders(this.tblHeaders); }
    },

    element: {
        get: function () { return $(this.cssInstancesTable); }
    },

    tblRows: {
        get: function () { return $$(this.cssInstanceRows); }
    },

    tblHeaders: {
        get: function () { return $$(this.cssInstanceHeaders); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    rawData: {
        value: function () { return tblUtil.getTableData(this.cssInstanceHeaders, this.cssInstanceRows); }
    },

    data: {
        value: function () {
            var page = this;
            return this.rawData().then(function (tableData) {
                return page.tblRows.then(function (rows) {
                    return _.map(tableData, function (row, index) {
                        row.name = row.Name;
                        row.id = row['Instance ID'];
                        row.size = rxpo.rxDiskSize.toGigabytes(row['Volume Size']);
                        rows[index].$('td:nth-of-type(2)').then(function (column) {
                            var viewDetails = column.$('a').click;
                            row.viewDetails = viewDetails;
                        });
                        rows[index].$('td:last-of-type').then(function (column) {
                            row.Actions = actionCog(column);
                        });

                        rows[index].$('td:first-of-type').getAttribute('status').then(function (status) {
                            row.Status = status;
                        });

                        return row;
                    });
                });
            });
        }
    },

    findInstance: {
        value: function (query, filter) {
            return this.find(query, filter).then(function (instance) {
                if (_.isUndefined(instance)) {
                    throw new Error('Unable to find DB with query: ' + JSON.stringify(query));
                }
                return instance;
            });
        }
    },

    viewInstanceDetails: {
        value: function (query) {
            return this.findInstance(query).then(function (instance) {
                return instance.viewDetails();
            });
        }
    },

    openRestartInstance: {
        value: function (query) {
            this.openAction(query, 'Restart Instance');
        }
    },

    openResizeFlavor: {
        value: function (query) {
            this.openAction(query, 'Resize Flavor');
        }
    },

    openResizeVolume: {
        value: function (query) {
            this.openAction(query, 'Resize Volume');
        }
    },

    openDeleteInstance: {
        value: function (query) {
            this.openAction(query, 'Delete Instance');
        }
    },

    openCreateDatabase: {
        value: function (query) {
            this.openAction(query, 'Create Database');
        }
    },

    openCreateUser: {
        value: function (query) {
            this.openAction(query, 'Create User');
        }
    },

    openAction: {
        value: function (query, actionName) {
            this.find(query).then(function (row) {
                row.Actions.expand().then(function (actions) {
                    actions[actionName].click();
                });
            });
        }
    },
};

instancesTable = tblCommon.wrap(instancesTable);
module.exports = Page.create(instancesTable);

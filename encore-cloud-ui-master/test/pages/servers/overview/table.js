var moment = require('moment');
var Page = require('astrolabe').Page;
var _ = require('lodash');
var basePage = require('../../base');
var tblUtil = require('../../base/util/tables');
var tblCommon = require('../../base/tablesCommon');
var wait = require('../../base/wait');
var actionCog = require('../../base/actionCog');

var overviewTable = {

    cssServersTable: {
        get: function () { return 'table.servers-list '; }
    },

    cssServerHeaders: {
        get: function () {
            var rxSortableColumns = this.cssServersTable + 'th.column-title span.ng-scope ';
            var unsortableColumns = this.cssServersTable + 'th.column-title:nth-of-type(2), ' +
                                    this.cssServersTable + 'th.column-title:nth-of-type(5), ' +
                                    this.cssServersTable + 'th.column-title:nth-of-type(6), ' +
                                    this.cssServersTable + 'th.column-title:nth-of-type(10)';

            return [rxSortableColumns, unsortableColumns].join();
        }
    },

    cssServerRows: {
        get: function () { return this.cssServersTable + 'tbody tr'; }
    },

    tblHeaders: {
        get: function () { return $$(this.cssServerHeaders); }
    },

    element: {
        get: function () { return $(this.cssServersTable); }
    },

    tblServerRows: {
        get: function () { return $$(this.cssServerRows); }
    },

    headers: {
        get: function () { return tblUtil.getTableHeaders(this.tblHeaders); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    data: {
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssServerHeaders, this.cssServerRows).then(function (tableData) {
                return page.tblServerRows.then(function (rows) {
                    return _.map(tableData, function (row, index) {
                        var rowNameId = row['Name (UUID)'].split('\n');
                        row.name = _.first(rowNameId).trim();
                        row.id = _.last(rowNameId).trim();
                        row['created_date'] = moment(row['Created'], 'MM-DD-YY hh:mm a');

                        rows[index].$('td:nth-of-type(4) a').then(function (detailsLink) {
                            row.viewDetails = detailsLink.click;
                        });

                        rows[index].$('td:last-of-type').then(function (cog) {
                            row.Actions = actionCog(cog);
                            row.actionMenu = encore.rxActionMenu.initialize(cog);
                        });

                        row['statusElement'] = rows[index].$('td:first-of-type');
                        row['statusElement'].$('span').getAttribute('tooltip').then(function (status) {
                            row['Status'] = status;
                        });
                        rows[index].$('td:nth-of-type(2) input').then(function (checkbox) {
                            row.select = checkbox;
                        });

                        return row;
                    });
                });
            });
        }
    },

    findServer: {
        value: function (query, filter) {
            return this.find(query, filter).then(function (server) {
                if (_.isUndefined(server)) {
                    throw new Error('Unable to find Server with query: ' + JSON.stringify(query));
                }
                return server;
            });
        }
    },

    serverRowByName: {
        value: function (name) {
            return element(by.cssContainingText(this.cssServerRows, name));
        }
    },

    serverCheckbox: {
        value: function (name) {
            return this.serverRowByName(name).$('td:nth-of-type(2) input');
        }
    },

    selectServers: {
        value: function (servers) {
            var page = this;

            _.each(servers, function (server) {
                page.serverCheckbox(server.name).then(function (checkbox) {
                    checkbox.isSelected().then(function (isSelected) {
                        if (!isSelected) {
                            checkbox.click();
                        }
                    });
                });
            });
        }
    },

    unselectServers: {
        value: function (servers) {
            var page = this;

            _.each(servers, function (server) {
                page.serverCheckbox(server.name).then(function (checkbox) {
                    checkbox.isSelected().then(function (isSelected) {
                        if (isSelected) {
                            checkbox.click();
                        }
                    });
                });
            });
        }
    },

    viewServerDetails: {
        value: function (query, filter) {
            return this.findServer(query, filter).then(function (server) {
                if (server.Status === 'ERROR') {
                    throw new Error('Server currently in ERROR status');
                }
                return server.viewDetails();
            });
        }
    },

    deleteServer: {
        value: function (query, filter) {
            return this.findServer(query, filter).then(function (row) {
                return row.Actions.expand().then(function (actions) {
                    actions['Delete Server'].click();
                    return basePage.modalConfirmButton.click();
                });
            });
        }
    },

    getAllGenTypes: {
        get: function () {
            var xpath = '//table[contains(@class, "servers-list")]//tr//td[position()=3]';
            return element.all(by.xpath(xpath));
        }
    },
    cssBulkSelectActions: {
        get: function () {
            return 'tr[rx-bulk-select-message]';
        }
    },

    bulkSelectActions: {
        get: function () {
            return $(this.cssBulkSelectActions);
        }
    },

    txtBulkSelect: {
        get: function () {
            return this.bulkSelectActions.$('span').getText();
        }
    },

    linkSelectAll: {
        get: function () {
            return this.bulkSelectActions.element(by.cssContainingText('button', 'Select all'));
        }
    },

    linkSelectNone: {
        get: function () {
            return this.bulkSelectActions.element(by.cssContainingText('button', 'Clear all'));
        }
    },

    cssSelected: {
        get: function () {
            return this.cssServerRows + ' td:nth-of-type(2) input:checked';
        }
    },

    cssUnselected: {
        get: function () {
            return this.cssServerRows + ' td:nth-of-type(2) input:not(:checked)';
        }
    },

    anySelected: {
        get: function () {
            return $(this.cssSelected);
        }
    },

    anyUnselected: {
        get: function () {
            return $(this.cssUnselected);
        }
    },

    waitForExpectedText: wait
};

overviewTable = tblCommon.wrap(overviewTable);
module.exports = Page.create(overviewTable);

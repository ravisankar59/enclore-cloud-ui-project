var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');
var tblCommon = require('../../base/tablesCommon');
var actionCog = require('../../base/actionCog');

var nodesTable = {

    tableHeader: {
        get: function () { return $('div.node-details > h2'); }
    },

    cssNodesTable: {
        get: function () { return 'table.loadBalancer-nodes '; }
    },

    cssNodeRows: {
        get: function () { return this.cssNodesTable + 'tbody tr '; }
    },

    cssNodeHeaders: {
        get: function () {
            var rxSortableColumns = this.cssNodesTable + 'th.column-title span.ng-scope ';
            var unsortableColumns = this.cssNodesTable + 'th.column-title:last-of-type';
            return [rxSortableColumns, unsortableColumns].join();
        }
    },

    headers: {
        get: function () { return tblUtil.getTableHeaders(this.tblNodeHeaders); }
    },

    element: {
        get: function () { return $(this.cssNodesTable); }
    },

    tblNodeHeaders: {
        get: function () { return $$(this.cssNodeHeaders); }
    },

    tblNodeRows: {
        get: function () { return $$(this.cssNodeRows); }
    },

    tblNodeLinks: {
        value: function (rowNum) { return $$(this.cssNodeRows + ' td:nth-of-type(3) a').get(rowNum); }
    },

    tblNodeLinkHref: {
        value: function (rowNum) { return this.tblNodeLinks(rowNum).getAttribute('href'); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    openEditNode: {
        value: function (ipAddress) {
            this.openAction(ipAddress, 'Edit Node Configuration');
        }
    },

    linkRemoveNode: {
        value: function (ipAddress) {
            this.openAction(ipAddress, 'Remove Node');
        }
    },

    isNodeActionPresent: {
        value: function (ipAddress, actionName) {
            return this.find({ 'IP Address': ipAddress }).then(function (row) {
                return row.Actions.expand().then(function (actions) {
                    if (actions[actionName]){
                        return true;
                    } else {
                        return false;
                    }
                });
            });
        }
    },

    openAction: {
        value: function (ipAddress, actionName) {
            var page = this;
            this.find({ 'IP Address': ipAddress }).then(function (row) {
                row.Actions.expand().then(function (actions) {
                    actions[actionName].click();
                });
                page.clearFilter();
            });
        }
    },

    data: {
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssNodeHeaders, this.cssNodeRows).then(function (tableData) {
                return page.tblNodeRows.then(function (rows) {
                    return _.map(tableData, function (row, index) {
                        if (row['Status'] === 'No items found' || row['Status'] === 'No Nodes have been added.') {
                            return row;
                        } else {
                            if (_.isEmpty(row['Name (ID)'].split('\n')[0])) {
                                row.name = '';
                            } else {
                                row.name = row['Name (ID)'].split('\n')[0].trim();
                            }

                            if (_.isEmpty(row['Name (ID)'].split('\n')[1])) {
                                row.id = '';
                            } else {
                                row.id = row['Name (ID)'].split('\n')[1].trim();
                            }

                            row['statusElement'] = rows[index].$('td:first-of-type');
                            row['statusElement'].$('span').getAttribute('tooltip').then(function (status) {
                                row['Status'] = status;
                            });

                            rows[index].$('td:last-of-type').then(function (cogElement) {
                                row.Actions = actionCog(cogElement);
                            });

                            return row;
                        }
                    });
                });
            });
        }
    },

    txtFilter: {
        get: function () { return this.element.$('rx-search-box input'); }
    },

    btnClearFilter: {
        get: function () { return this.element.element(by.css('.rxSearchBox-clear')); }
    },

    clearFilter: {
        value: function () {
            var page = this;
            page.btnClearFilter.isPresent().then(function (present) {
                    if (present) {
                        page.btnClearFilter.click();
                    }
                });
        }
    },
};

nodesTable = tblCommon.wrap(nodesTable);
module.exports = Page.create(nodesTable);

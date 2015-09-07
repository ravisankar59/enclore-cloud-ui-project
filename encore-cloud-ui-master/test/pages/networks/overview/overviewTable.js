var _ = require('lodash');
var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');
var tblCommon = require('../../base/tablesCommon');
var actionCog = require('../../base/actionCog');
var basePage = require('../../base');
var wait = require('../../base/wait');
var util = require('../../base/util/util');

var networksTable = {

    cssNetworkHeaders: {
        get: function () {
            var rxSortableColumns = this.cssNetworksTable + 'th.column-title span.ng-scope ';
            var unsortableColumns = this.cssNetworksTable + 'thead th.column-title:last-of-type';
            return [rxSortableColumns, unsortableColumns].join();
        }
    },

    cssNetworkRows: {
        get: function () { return this.cssNetworksTable + 'tbody tr '; }
    },

    element: {
        get: function () { return $(this.cssNetworksTable); }
    },

    tblRows: {
        get: function () { return $$(this.cssNetworkRows); }
    },

    tblHeaders: {
        get: function () { return $$(this.cssNetworkHeaders); }
    },

    headers: {
        get: function () { return tblUtil.getTableHeaders(this.tblHeaders); }
    },

    btnClearFilter: {
        get: function () { return $('button[ng-click="clearFilter()"]'); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    rawData: {
        value: function () { return tblUtil.getTableData(this.cssNetworkHeaders, this.cssNetworkRows); }
    },

    // Need to override the default sortBy
    sortBy: {
        value: function (columnName, isAscending) {
            isAscending = (isAscending === undefined) ? true : isAscending;
            var buttonDiv = element(by.cssContainingText(this.cssNetworksTable + 'rx-sortable-column', columnName));
            var linkElement = buttonDiv.$('button.sort-action');
            var arrowElement = buttonDiv.$('i.sort-icon');
            this.getCurrentSortDirection(arrowElement).then(function (sortDirection) {

                var columnDescendingOrNotSorted = (sortDirection === 'unsorted' || sortDirection === 'descending');
                if (isAscending && columnDescendingOrNotSorted) {
                    return linkElement.click();
                }

                if (!isAscending && sortDirection === 'unsorted') {
                    linkElement.click();
                    return linkElement.click();
                }

                if (!isAscending && sortDirection === 'ascending') {
                    return linkElement.click();
                }

            });
        }
    },

    data: {
        value: function () {
            var page = this;
            return this.rawData().then(function (tableData) {
                return page.tblRows.then(function (rows) {
                    return _.map(tableData, function (row, index) {
                        rows[index].$('td:last-of-type').then(function (cog) {
                            row.Actions = actionCog(cog);
                            row.actionMenu = encore.rxActionMenu.initialize(cog);
                        });
                        return row;
                    });
                });
            });
        }
    },

    findNetwork: {
        value: function (query, filter) {
            return this.find(query, filter).then(function (network) {
                if (_.isUndefined(network)) {
                    throw new Error('Unable to find Network with query: ' + JSON.stringify(query));
                }
                return network;
            });
        }
    },

    deleteNetwork: {
        value: function (networkQuery) {
            return this.findNetwork(networkQuery).then(function (row) {
                row.actionMenu.action('Delete Network').openModal();
                return basePage.modalConfirmButton.click();
            });
        }
    },

    waitForExpectedText: wait
};

networksTable = tblCommon.wrap(networksTable);
module.exports = {
    initialize: function (tableSelector) {
        var combined = util.combine(networksTable, {
            cssNetworksTable: {
                get: function () {
                    return 'div.tab-content table.' + tableSelector + ' ';
                }
            }
        });
        return Page.create(combined);
    }
};

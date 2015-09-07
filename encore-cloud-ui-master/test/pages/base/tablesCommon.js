var _ = require('lodash');
var pager = require('rx-page-objects').rxPaginate;
var util = require('./util/util');
var actionCog = require('./actionCog');

var baseTable = {

    txtFilter: {
        get: function () { return $('input.filter-box'); }
    },

    eleBulkSelectMessage: {
        get: function () { return $('tr[rx-bulk-select-message]'); }
    },

    eleBulkSelectBox: {
        get: function () { return this.element.element(by.model('allSelected')); }
    },

    eleBulkSelectAll: {
        get: function () { return this.eleBulkSelectMessage.$('button[ng-click="selectAll()"]'); }
    },

    eleBulkDeselectAll: {
        get: function () { return this.eleBulkSelectMessage.$('button[ng-click="deselectAll()"]'); }
    },

    btnClearFilter: {
        get: function () { return $('button[ng-click="clearFilter()"]'); }
    },

    sortBy: {
        value: function (columnName, isAscending) {
            isAscending = (isAscending === undefined) ? true : isAscending;
            var selector = '//rx-sortable-column//div[button//' +
                           'span[@class=\"ng-scope\" and contains(text(), "' + columnName + '")]]';
            var buttonDiv = element(by.xpath(selector));
            var linkElement = buttonDiv.$('button.sort-action');
            var arrowElement = buttonDiv.$('i.sort-icon');
            this.getCurrentSortDirection(arrowElement).then(function (sortDirection) {

                var columnDescendingOrNotSorted = (sortDirection === 'unsorted' || sortDirection === 'descending');
                if (isAscending && columnDescendingOrNotSorted) {
                    return linkElement.click();
                }

                if (!isAscending && sortDirection === 'unsorted') {
                    return linkElement.click();
                }

                if (!isAscending && sortDirection === 'ascending') {
                    return linkElement.click();
                }

            });
        }
    },

    isAscending: {
        value: function (columnName, empty) {
            var page = this;
            empty = empty || '';
            return page.column(columnName).then(function (columnData) {
                columnData = page.arrayToLowerCase(columnData);
                for (var i = 0; i < columnData.length - 1; i++) {
                    if (columnData[i] > columnData[i + 1] &&
                        columnData[i] !== empty.toLowerCase()) {
                        return false;
                    }
                }
                return true;
            });
        }
    },

    isDescending: {
        value: function (columnName, empty) {
            var page = this;
            empty = empty || '';
            return page.column(columnName).then(function (columnData) {
                columnData = page.arrayToLowerCase(columnData);
                for (var i = 0; i < columnData.length - 1; i++) {
                    if (columnData[i] < columnData[i + 1] &&
                        columnData[i + 1] !== empty.toLowerCase()) {
                        return false;
                    }
                }
                return true;
            });
        }
    },

    row: {
        value: function (rowIndex) {
            return this.data().then(function (rows) {
                return rows[rowIndex - 1];
            });
        }
    },

    column: {
        value: function (columnName) {
            return this.data().then(function (rows) {
                return _.map(rows, function (row) {
                    return row[columnName];
                });
            });
        }
    },

    bulkSelectMessage: {
        get: function () {
            var page = this;
            return page.eleBulkSelectMessage.isPresent().then(function (isPresent) {
                if (isPresent) {
                    return page.eleBulkSelectMessage.getText();
                } else {
                    return 'no message shown';
                }
            });
        }
    },

    eleBatchActions: {
        get: function () { return $$('rx-batch-actions').first(); }
    },

    batchActionsMenu: {
        value: function () {
            var element = this.eleBatchActions;
            var opts = {
                popupSelector: 'div.batch-action-list',
                cogSelector: 'button.header-button',
                optionSelector: 'rx-modal-action span.rx-modal-action a'
            };
            return actionCog(element, opts);
        }
    },

    selectAll: {
        value: function () {
            var page = this;
            return page.eleBulkSelectBox.isSelected().then(function (isSelected) {
                if (!isSelected) {
                    return page.eleBulkSelectBox.click();
                }
            });
        }
    },

    select: {
        // function will select rows in tables that have a 'select' key
        // in the object returned by this.data();
        value: function (queries) {
            this.data().then(function (rows) {
                _.each(queries, function (query) {
                    var row = _.find(rows, query);

                    if (!_.has(row, 'select')) {
                        return;
                    }
                    row.select.isSelected().then(function (isSelected) {
                        if (!isSelected) {
                            row.select.click();
                        }
                    });
                });
            });
        }
    },

    deselect: {
        // function will deselect rows in tables that have a 'select' key
        // in the object returned by this.data();
        value: function (queries) {
            this.data().then(function (rows) {
                _.each(queries, function (query) {
                    var row = _.find(rows, query);

                    if (!_.has(row, 'select')) {
                        return;
                    }
                    row.select.isSelected().then(function (isSelected) {
                        if (isSelected) {
                            row.select.click();
                        }
                    });
                });
            });
        }
    },

    deselectAll: {
        value: function () {
            var page = this;
            return page.eleBulkSelectBox.isSelected().then(function (isSelected) {
                if (isSelected) {
                    return page.eleBulkSelectBox.click();
                }
            });
        }
    },

    filterBy: {
        value: function (filter) {
            var page = this;
            page.txtFilter.isPresent().then(function (isPresent) {
                if (isPresent) {
                    page.txtFilter.clear();
                    page.txtFilter.sendKeys(filter);
                }
            });
        }
    },

    getCurrentSortDirection: {
        value: function (arrowElement) {
            return arrowElement.getAttribute('class').then(function (classAttr) {
                return arrowElement.getAttribute('style').then(function (style) {
                    var unsorted = /visibility: hidden/.test(style);
                    var ascending  = classAttr.indexOf('asc') >= 0;
                    var descending = classAttr.indexOf('desc') >= 0;

                    if (unsorted) {
                        return 'unsorted';
                    }
                    if (ascending) {
                        return 'ascending';
                    }
                    if (descending) {
                        return 'descending';
                    }

                });
            });
        }
    },

    arrayToLowerCase: {
        value: function (columnData) {
            return _.map(columnData, function (data) {
                // Moment.js comparisons work somewhat awkwardly, compare via their
                // unix timestamp for higher precision results.
                if (data.unix !== undefined) {
                    return data.unix;
                }
                if (data.toLowerCase !== undefined) {
                    return data.toLowerCase();
                }
                return data;
            });
        }
    },

    find: {
        value: function (query, filter) {
            filter = filter || query[_.first(_.keys(query))];
            this.filterBy(filter);

            return this.data().then(function (rows) {
                var row = _.find(rows, query);
                return row;
            });
        }
    },

    tblPagination: {
        get: function () { return $('.rx-paginate'); }
    },

    pagination: {
        get: function () { return pager.initialize(this.tblPagination); }
    },

    isTableEmpty: {
        get: function () { return $('span.msg-warn').isDisplayed(); }
    }
};

module.exports = {
    wrap: function (tableObj) {
        return util.combine(baseTable, tableObj);
    }
};

var tblUtil = require('../../base/util/tables');

var addCloudServers = {

    cssServersTable: {
        get: function () { return '.modal table.servers-list '; }
    },

    cssServerHeaders: {
        get: function () {
            var unsortableColumns = this.cssServersTable + 'th.column-title:nth-of-type(1), ' +
                                    this.cssServersTable + 'th.column-title:nth-of-type(2), ' +
                                    this.cssServersTable + 'th.column-title:nth-of-type(3), ' +
                                    this.cssServersTable + 'th.column-title:nth-of-type(4), ' +
                                    this.cssServersTable + 'th.column-title:nth-of-type(5)' ;

            return unsortableColumns;
        }
    },

    tblHeaders: {
        get: function () { return $$(this.cssServerHeaders); }
    },

    headers: {
        get: function () { return tblUtil.getTableHeaders(this.tblHeaders); }
    },

    cssServerRows: {
        get: function () { return this.cssServersTable + 'tbody tr'; }
    },

    tblServerRows: {
        get: function () { return $$(this.cssServerRows); }
    },

    dataCount: {
        value: function () {
            var page = this;
            return page.tblServerRows.then(function (rows) {
                return rows.length;
            });
        }
    },

    weightTxt: {
        value: function (rowNumber) {
            return this.tblServerRows.get(rowNumber).$('td:nth-of-type(5) input');
        }
    },

    portTxt: {
        value: function (rowNumber) {
            return this.tblServerRows.get(rowNumber).$('td:nth-of-type(3) input');
        }
    },

    setWeight: {
        value: function (rowNumber, value) {
            var elem = this.weightTxt(rowNumber);
            elem.clear();
            elem.sendKeys(value);
        }
    },

    setPort: {
        value: function (rowNumber, value) {
            var elem = this.portTxt(rowNumber);
            elem.clear();
            elem.sendKeys(value);
        }
    },

    getEnabledInputsByColumn: {
        value: function (columnIndex) {
            return this.tblServerRows.$$('td:nth-of-type(' + columnIndex + ') input').filter(function (elem) {
                return elem.isEnabled();
            });
        }
    },
    getEnabledSelectByColumn: {
        value: function (columnIndex) {
            return this.tblServerRows.$$('td:nth-of-type(' + columnIndex + ') select').filter(function (elem) {
                return elem.isEnabled();
            });
        }
    },
    data: {
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssServerHeaders, this.cssServerRows).then(function (tableData) {
                return page.tblServerRows.then(function (rows) {
                    return _.map(tableData, function (row, index) {
                        var rowNameId = row['Name (IP)'].split('\n');
                        row.name = _.first(rowNameId).trim();
                        row.id = _.last(rowNameId).trim();

                        var port = rows[index].$('td:nth-of-type(3)').element(by.tagName('input'));

                        port.getAttribute('value').then(function (value) {
                            row.Port = value;
                        });
                        port.isEnabled().then(function (status) {
                            row.portEnabled = status;
                        });

                        var checkBox = rows[index].$('td:nth-of-type(1)').element(by.tagName('input'));
                        checkBox.isSelected().then(function (status) {
                            row.selected = status;
                        });

                        var selectBox = rows[index].$('td:nth-of-type(4)').element(by.tagName('select'));
                        selectBox.$('option:checked').getText().then(function (status) {
                            row.conditionSelected = status;
                        });

                        var weight = rows[index].$('td:nth-of-type(5)').element(by.tagName('input'));

                        weight.getAttribute('value').then(function (value) {
                            row.Weight = value;
                        });

                        return row;
                    });
                });
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
            return this.serverRowByName(name).$('td:nth-of-type(1) input');
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

    selectAll: {
        value: function () {
            var temp = this;
            return this.eleBulkSelectBox.isSelected().then(function (isSelected) {
                if (!isSelected) {
                    return temp.eleBulkSelectBox.click();
                }
            });
        }
    },

    unselectAll: {
        value: function () {
            var temp = this;
            return this.eleBulkSelectBox.isSelected().then(function (isSelected) {
                if (isSelected) {
                    return temp.eleBulkSelectBox.click();
                }
            });
        }
    },

    eleBulkSelectBox: {
        get: function () { return element(by.model('allSelected')); }
    },

    filterBy: {
        value: function (searchValue) {
            this.filterBox.clear();
            this.filterBox.sendKeys(searchValue);
        }
    },

    filterBox: {
        get: function () {
            return element(by.id('searchNode')).element(by.model('searchVal'));
        }
    },

    cssSelected: {
        get: function () {
            return this.cssServerRows + ' td:nth-of-type(1) input:checked';
        }
    },

    cssUnselected: {
        get: function () {
            return this.cssServerRows + ' td:nth-of-type(1) input:not(:checked)';
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

    selectedRowCount: {
        get: function () {
            return element.all(by.css(this.cssSelected));
        }
    },

    unSelectedRowCount: {
        get: function () {
            return element.all(by.css(this.cssUnselected));
        }
    }
};

module.exports = encore.rxModalAction.initialize(addCloudServers);

var _ = require('lodash');
var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');
var tblCommon = require('../../base/tablesCommon');

var nodesTable = {

    cssNodesTable: {
        get: function () { return '.lbaas-servers-list '; }
    },

    cssNodesHeaders: {
        get: function () { return this.cssNodesTable + 'thead th '; }
    },

    cssNodesRows: {
        get: function () { return this.cssNodesTable + 'tbody tr.server-details '; }
    },

    cssNodePort: {
        get: function () { return this.cssNodesTable + 'input.node-port '; }
    },

    tblNodes: {
        get: function () { return $(this.cssNodesTable); }
    },

    tblNodePort: {
        get: function () { return $(this.cssNodePort); }
    },

    isDisplayed: {
        value: function () { return this.tblNodes.isDisplayed(); }
    },

    tblNodesRows: {
        get: function () { return $$(this.cssNodesRows); }
    },

    emptyNodesTableText: {
        value: function () {
            return $('table.lbaas-servers-list > tbody > tr > td').getText();
        }
    },

    data: {
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssNodesHeaders, this.cssNodesRows).then(function (rows) {
                return page.tblNodesRows.then(function (rowElements) {
                    return _.map(rows, function (row, index) {
                        row.name = row['Name'];
                        rowElements[index].$('td:last-of-type a').then(function (checkbox) {
                            row.Action = checkbox;
                        });
                        return row;
                    });
                });
            });
        }
    },

    changeNodePort: {
        value: function (server) {
            var table = this;
            return this.data().then(function (nodeList) {
                var row = _.find(nodeList, { name: server.name });
                row.Action.click();
                return table.tblNodePort.sendKeys(server.port);
            });
        }
    }
};

nodesTable = tblCommon.wrap(nodesTable);
module.exports = Page.create(nodesTable);

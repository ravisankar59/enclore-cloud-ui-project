var _ = require('lodash');
var Page = require('astrolabe').Page;
var tblUtil = require('../../../base/util/tables');
var tblCommon = require('../../../base/tablesCommon');
var actionCog = require('../../../base/actionCog');
var wait = require('../../../base/wait');
var basePage = require('../../../base');
var rxpo = require('rx-page-objects');
var util = require('../../../base/util/util');

var snapshotsTable = {

    cssSnapshotsTable: {
        get: function () { return 'table.snapshots-list '; }
    },

    cssSnapshotRows: {
        get: function () { return this.cssSnapshotsTable + 'tbody tr '; }
    },

    cssSnapshotHeaders: {
        get: function () {
            var rxSortableColumns = this.cssSnapshotsTable + 'th.column-title span.ng-scope ';
            var unsortableColumns = this.cssSnapshotsTable + 'th.column-title:last-of-type';

            return [rxSortableColumns, unsortableColumns].join();
        }
    },

    element: {
        get: function () { return $(this.cssSnapshotsTable); }
    },

    tblSnapshotHeaders: {
        get: function () { return $$(this.cssSnapshotHeaders); }
    },

    tblSnapshotRows: {
        get: function () { return $$(this.cssSnapshotRows); }
    },

    headers: {
        get: function () { return tblUtil.getTableHeaders(this.tblSnapshotHeaders); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    emptySnapshotTableText: {
        value: function () {
            return $('table.snapshots-list > tbody > tr > td').getText();
        }
    },

    data: {
        value: function () {
            // Returns a list of objects that represent the rows in the overview table
            var page = this;
            return tblUtil.getTableData(this.cssSnapshotHeaders, this.cssSnapshotRows).then(function (tableData) {
                return page.tblSnapshotRows.then(function (rows) {
                    return _.map(tableData, function (row, index) {
                        // lowercase keys contain parsed values from the table
                        // uppercase keys contain raw data from the table

                        var nameAgeSplit = row['Name/ID'].split('\n');
                        if (nameAgeSplit.length === 2) {
                            row.name = (nameAgeSplit[0]).trim();
                            row.id = (nameAgeSplit[1]).trim();
                        } else {
                            row.name = '';
                            row.id = (nameAgeSplit[0]).trim();
                        }

                        var createdAgeSplit = row['Created/Age'].split('\n');
                        /* jshint camelcase:false */
                        if (createdAgeSplit.length === 2) {
                            row.created_on = moment(createdAgeSplit[0].trim(), util.dateTimeFormat).valueOf();
                            row.age = rxpo.rxAge.toMoment((createdAgeSplit[1]).trim());
                        } else {
                            row.created_on = '';
                            row.age = '';
                        }

                        row.description = row['Description'].trim();
                        row.size = rxpo.rxDiskSize.toGigabytes(row['Size']);

                        row.statusElement = rows[index].$('td:first-of-type');
                        row.statusElement.$('span').getAttribute('tooltip').then(function (status) {
                            row['Status'] = status;
                        });

                        rows[index].$('td:last-of-type').then(function (cogColumn) {
                            row.Actions = actionCog(cogColumn);
                        });

                        return row;
                    });
                });
            });
        }
    },

    findSnapshot: {
        value: function (query) {
            // Returns row in volumes table that matches the query
            return this.data().then(function (rows) {
                return _.find(rows, query);
            });
        }
    },

    deleteSnapshot: {
        value: function (query) {
            this.findSnapshot(query).then(function (snapshotRow) {
                if (!_.isEmpty(snapshotRow)) {
                    snapshotRow.Actions.expand().then(function (actions) {
                        actions['Delete snapshot'].click();
                        basePage.modalConfirmButton.click();
                    });
                }
            });
        }
    },

    createVolumeFromSnapshot: {
        value: function (query, volume) {
            var page = this;
            this.findSnapshot(query).then(function (snapshotRow) {
                if (!_.isEmpty(snapshotRow)) {
                    snapshotRow.Actions.expand().then(function (actions) {
                        actions['Create Volume'].click();
                        page.createVolumeModal.createVolume(volume);
                    });
                }
            });
        }
    },

    waitForExpectedText: wait
};

snapshotsTable = Page.create(tblCommon.wrap(snapshotsTable));
snapshotsTable.createVolumeModal = require('../../modals/createVolume');
module.exports = snapshotsTable;

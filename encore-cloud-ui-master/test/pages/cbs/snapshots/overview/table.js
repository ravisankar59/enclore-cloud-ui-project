var _ = require('lodash');
var rxpo = require('rx-page-objects');
var moment = require('moment');
var Page = require('astrolabe').Page;
var basePage = require('../../../base');
var tblUtil = require('../../../base/util/tables');
var tblCommon = require('../../../base/tablesCommon');
var actionCog = require('../../../base/actionCog');
var wait = require('../../../base/wait');
var createVolumeModal = require('../../modals/createVolume');
var util = require('../../../base/util/util');

var snapshotOverviewTable = {

    cssSnapshotsTable: {
        get: function () { return 'table.snapshots-list '; }
    },

    cssSnapshotHeaders: {
        get: function () {
            var rxSortableColumns = 'table.snapshots-list th.column-title span.ng-scope ';
            var unsortableColumns = 'table.snapshots-list th.column-title:last-of-type';

            return [rxSortableColumns, unsortableColumns].join();
        }
    },

    cssSnapshotRows: {
        get: function () { return this.cssSnapshotsTable + 'tbody tr '; }
    },

    element: {
        get: function () { return $(this.cssSnapshotsTable); }
    },

    tblSnapshotRows: {
        get: function () { return $$(this.cssSnapshotRows); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    headers: {
        get: function () { return tblUtil.getTableHeaders($$(this.cssSnapshotHeaders)); }
    },

    data: {
        // Returns a list of objects that represent the rows in the overview table.
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssSnapshotHeaders, this.cssSnapshotRows).then(function (tableData) {
                return page.tblSnapshotRows.then(function (rows) {
                    return _.map(tableData, function (row, index) {
                        // Lowercase keys contain parsed values from the table.
                        // Uppercase keys contain raw data from the table.

                        var nameAgeSplit = row['Name/ID'].split('\n');

                        if (nameAgeSplit.length === 2) {
                            row.name = (nameAgeSplit[0]).trim();
                            row.id = (nameAgeSplit[1]).trim();
                        } else {
                            row.name = '';
                            row.id = (nameAgeSplit[0]).trim();
                        }

                        row.size = rxpo.rxDiskSize.toGigabytes(row['Size']);

                        var createdAgeSplit = row['Created/Age'].split('\n');

                        /* jshint camelcase:false */
                        if (createdAgeSplit.length === 2) {
                            row.created_on = moment(createdAgeSplit[0].trim(), util.dateTimeFormat).valueOf();
                            row.age = rxpo.rxAge.toMoment((createdAgeSplit[1]).trim());
                        } else {
                            row.created_on = '';
                            row.age = '';
                        }

                        rows[index].$$('td').then(function (columns) {
                            var cog = columns[columns.length - 1];
                            var viewDetails = columns[1].$('a.view').click;
                            row.Status = columns[0].getAttribute('tooltip');
                            row.Actions = actionCog(cog);
                            row.viewDetails = viewDetails;
                        });

                        return row;
                    });
                });
            });
        }
    },

    findSnapshot: {
        // Returns row in volumes table that matches the query.
        value: function (query, filter) {
            return this.find(query, filter).then(function (snapshot) {
                if (_.isUndefined(snapshot)) {
                    throw new Error('Unable to find snapshot with query: ' + JSON.stringify(query));
                }
                return snapshot;
            });
        }
    },

    createVolumeFromSnapshot: {
        value: function (snapshotQuery, volume) {
            return this.findSnapshot(snapshotQuery).then(function (snapshot) {
                return snapshot.Actions.expand().then(function (actions) {
                    actions['Create Volume'].click();
                    return createVolumeModal.createVolume(volume);
                });
            });
        }
    },

    deleteSnapshot: {
        value: function (snapshotQuery) {
            return this.findSnapshot(snapshotQuery).then(function (snapshot) {
                return snapshot.Actions.expand().then(function (actions) {
                    actions['Delete Snapshot'].click();
                    return basePage.modalConfirmButton.click();
                });
            });
        }
    },

    waitForExpectedText: wait
};

snapshotOverviewTable = tblCommon.wrap(snapshotOverviewTable);
module.exports = Page.create(snapshotOverviewTable);

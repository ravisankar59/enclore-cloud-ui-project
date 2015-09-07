var _ = require('lodash');
var Page = require('astrolabe').Page;
var tblUtil = require('../../../base/util/tables');
var tblCommon = require('../../../base/tablesCommon');
var actionCog = require('../../../base/actionCog');
var detachModal = require('../../modals/detachVolume');
var deleteModal = require('../../modals/deleteVolume');
var rxpo = require('rx-page-objects');
var moment = require('moment');
var util = require('../../../base/util/util');

var volumesOverviewTable = {

    cssOverviewTable: {
        get: function () { return 'table.volumes-list '; }
    },

    cssRowsSelector: {
        get: function () { return this.cssOverviewTable + 'tbody tr '; }
    },

    cssHeadersSelector: {
        get: function () {
            var rxSortableColumns = this.cssOverviewTable + 'th.column-title span.ng-scope ';
            var unsortableColumns = this.cssOverviewTable + 'th.column-title:last-of-type';
            return [rxSortableColumns, unsortableColumns].join();
        }
    },

    element: {
        get: function () { return $(this.cssOverviewTable); }
    },

    tblVolumeRows: {
        get: function () { return $$(this.cssRowsSelector); }
    },

    headers: {
        get: function () { return tblUtil.getTableHeaders($$(this.cssHeadersSelector)); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    errorRowText: {
        get: function () { return $('table.volumes-list > tbody > tr > td').getText(); }
    },

    data: {
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssHeadersSelector, this.cssRowsSelector).then(function (tableData) {
                return page.tblVolumeRows.then(function (rows) {
                    return _.map(tableData, function (row, index) {
                        row.name = row['Name/ID'].split('\n')[0];
                        row.id = (row['Name/ID'].split('\n')[1]).trim();

                        var createdAgeSplit = row['Created/Age'].split('\n');

                        /* jshint camelcase:false */
                        row.created_on = moment(createdAgeSplit[0].trim(), util.dateTimeFormat).valueOf();
                        row.age = rxpo.rxAge.toMoment(createdAgeSplit[1].trim());

                        row.region = row['Region'].split('\n')[0];
                        /* jshint camelcase:false */
                        row.snapshots_count = parseInt(row['Snapshots']);
                        row.size = encore.rxDiskSize.toGigabytes(row['Size']);

                        rows[index].$$('td').then(function (columns) {
                            var cog = columns[columns.length - 1];
                            var viewDetails = columns[1].$('a.view').click;
                            var link = columns[1].$('a.view').getAttribute('href');
                            if (row['Attached To'] !== 'Not Attached') {
                                row.detach = columns[2].$('a').click;
                            } else {
                                row.detach = function () {
                                    throw new Error('Volume not currently attached');
                                };
                            }
                            row['statusElement'] = columns[0];
                            row['statusElement'].$('span').getAttribute('tooltip').then(function (status) {
                                row['Status'] = status;
                            });

                            row.link = link;
                            row.Actions = actionCog(cog);
                            row.viewDetails = viewDetails;
                        });

                        return row;
                    });
                });
            });
        }
    },

    findVolume: {
        value: function (query, filter) {
            return this.find(query, filter).then(function (volume) {
                if (_.isUndefined(volume)) {
                    throw new Error('Unable to find Volume with query: ' + JSON.stringify(query));
                }
                return volume;
            });
        }
    },

    deleteVolume: {
        value: function (volumeQuery, filter) {
            return this.findVolume(volumeQuery, filter).then(function (row) {
                return row.Actions.expand().then(function (actions) {
                    actions['Delete Volume'].click();
                    deleteModal.submit();
                });
            });
        }
    },

    detachVolume: {
        value: function (volumeQuery, filter) {
            return this.findVolume(volumeQuery, filter).then(function (row) {
                row.detach();
                detachModal.submit();
            });
        }
    },

    viewVolumeDetails: {
        value: function (volumeQuery, filter) {
            return this.findVolume(volumeQuery, filter).then(function (row) {
                return row.viewDetails();
            });
        }
    }
};

volumesOverviewTable = tblCommon.wrap(volumesOverviewTable);
module.exports = Page.create(volumesOverviewTable);

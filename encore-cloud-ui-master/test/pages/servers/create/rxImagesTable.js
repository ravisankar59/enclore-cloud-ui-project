var _ = require('lodash');
var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');
var tblCommon = require('../../base/tablesCommon');
var util = require('../../base/util/util');

var rxImagesTable = {
    cssRxImagesTable: {
        get: function () {
            return 'rx-option-table[field-id="serverrackspaceImage"] table.rx-option-table ';
        }
    },

    element: {
        get: function () {
            return $(this.cssRxImagesTable);
        }
    },

    isDisplayed: {
        value: function () {
            return this.element.isDisplayed();
        }
    },

    cssRxImagesHeaders: {
        get: function () { return this.cssRxImagesTable + 'thead th '; }
    },

    cssRxImagesRows: {
        get: function () { return this.cssRxImagesTable + 'tbody tr ';}
    },

    tblHeaders: {
        get: function () { return $$(this.cssRxImagesHeaders); }
    },

    tblRows: {
        get: function () { return $$(this.cssRxImagesRows); }
    },

    rawData: {
        value: function () {
            return tblUtil.getTableData(this.cssRxImagesHeaders, this.cssRxImagesRows).then(function (rows) {
                return _.map(rows, function (row) {
                    row['Created On'] = util.parseTimeInUTC(row['Created On'], 'M/D/YY h:mm A');
                    return row;
                });
            });
        }
    },
    data: {
        value: function () {
            var page = this;
            return page.rawData().then(function (rows) {
                return page.tblRows.then(function (rowElements) {
                    return _.map(rows, function (row, index) {
                        rowElements[index].$('td:first-of-type').then(function (firstElement) {
                            row.radio = firstElement;
                        });
                        return row;
                    });
                });
            });
        }
    },

    containsImage: {
        value: function (imageName) {
            return this.rawData().then(function (imageRows) {
                var image = _.find(imageRows, { Name: imageName });
                return !_.isUndefined(image);
            });
        }
    },

    containsMinRam: {
        value: function (imageName, minRam) {
            return this.rawData().then(function (imageRows) {
                var image = _.find(imageRows, { Name: imageName, 'Min Ram': minRam });
                return !_.isUndefined(image);
            });
        }
    },

    containsMinDisk: {
        value: function (imageName, minDisk) {
            return this.rawData().then(function (imageRows) {
                var image = _.find(imageRows, { Name: imageName, 'Min Disk': minDisk });
                return !_.isUndefined(image);
            });
        }
    },

    containsCreatedOn: {
        value: function (imageName, createdOn) {
            return this.rawData().then(function (imageRows) {
                var image = _.find(imageRows, { Name: imageName, 'Created On': createdOn });
                return !_.isUndefined(image);
            });
        }
    },

    containsStatus: {
        value: function (imageStatus) {
            return this.rawData().then(function (imageRows) {
                var image = _.find(imageRows, { 'Status': imageStatus });
                return !_.isUndefined(image);
            });
        }
    }
};

rxImagesTable = tblCommon.wrap(rxImagesTable);
module.exports = Page.create(rxImagesTable);

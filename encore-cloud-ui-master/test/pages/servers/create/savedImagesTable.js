var _ = require('lodash');
var Page = require('astrolabe').Page;
var tblUtil = require('../../base/util/tables');
var tblCommon = require('../../base/tablesCommon');
var util = require('../../base/util/util');

var savedImagesTable = {
    cssSavedImagesTable: {
        get: function () {
            return 'rx-option-table[field-id="serversavedImage"] table.rx-option-table ';
        }
    },

    element: {
        get: function () {
            return $(this.cssSavedImagesTable);
        }
    },

    isDisplayed: {
        value: function () {
            return this.element.isDisplayed();
        }
    },

    cssSavedImagesHeaders: {
        get: function () { return this.cssSavedImagesTable + 'th '; }
    },

    cssSavedImagesRows: {
        get: function () { return this.cssSavedImagesTable + 'tbody tr ';}
    },

    tblHeaders: {
        get: function () { return $$(this.cssSavedImagesHeaders); }
    },

    tblRows: {
        get: function () { return $$(this.cssSavedImagesRows); }
    },

    rawData: {
        value: function () {
            return tblUtil.getTableData(this.cssSavedImagesHeaders, this.cssSavedImagesRows).then(function (rows) {
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
            return this.rawData().then(function (rows) {
                return page.tblRows.then(function (rowElements) {
                    return _.map(rows, function (row, index) {
                        rowElements[index].getAttribute('class').then(function (classes) {
                            row.selected = (classes.split(' ').indexOf('selected') !== -1);
                        });
                        rowElements[index].$('td:first-of-type').then(function (firstElement) {
                            row.firstElement = firstElement;
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
    },

    selectedImage: {
        get: function () {
            return this.find({ selected: true });
        },
        set: function (query) {
            return this.find(query).then(function (row) {
                return row.firstElement.click();
            });
        }
    }
};

savedImagesTable = tblCommon.wrap(savedImagesTable);
module.exports = Page.create(savedImagesTable);

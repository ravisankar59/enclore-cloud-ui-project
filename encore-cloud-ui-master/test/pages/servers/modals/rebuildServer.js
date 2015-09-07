var _ = require('lodash');
var Page = require('astrolabe').Page;
var baseModal = require('../../base/modal');
var tblUtil = require('../../base/util/tables');

var rebuildServerModal = {
    cssImageTable: {
        get: function () { return '.table-striped.rx-option-table '; }
    },

    cssImageHeaders: {
        get: function () { return this.cssImageTable + 'thead th'; }
    },

    cssImageRows: {
        get: function () { return this.cssImageTable + 'tbody tr'; }
    },

    tblImageRows: {
        get: function () { return $$(this.cssImageTable + 'tbody tr'); }
    },

    imagesTable: {
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssImageHeaders, this.cssImageRows).then(function (tableData) {
                return page.tblImageRows.then(function (rows) {
                    return _.map(tableData, function (row, index) {
                        rows[index].$('td input').then(function (radioButton) {
                            row.select = radioButton.click;
                        });

                        return row;
                    });
                });
            });
        }
    },

    rebuildServer: {
        value: function (imageName) {
            this.imagesTable().then(function (images) {
                var image = _.find(images, function (image) {
                    return _.contains(image['Name'], imageName);
                });
                if (_.isUndefined(image)) {
                    throw new Error('Unable to find image with the name: ' + imageName);
                } else {
                    image.select();
                }
            });
            this.submit();
        }
    },

};

rebuildServerModal = baseModal.wrap(rebuildServerModal);
module.exports = Page.create(rebuildServerModal);

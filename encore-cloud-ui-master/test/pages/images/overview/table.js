var _ = require('lodash');
var Page = require('astrolabe').Page;
var basePage = require('../../base');
var tblUtil = require('../../base/util/tables');
var tblCommon = require('../../base/tablesCommon');
var actionCog = require('../../base/actionCog');
var util = require('../../base/util/util');

var imagesOverviewTable = {

    cssOverviewTable: {
        get: function () { return 'table.images-list '; }
    },

    cssRowsSelector: {
        get: function () { return this.cssOverviewTable + 'tbody tr '; }
    },

    cssHeadersSelector: {
        get: function () {
            var rxSortableColumns = this.cssOverviewTable + 'th.column-title span.ng-scope ';
            var unsortableColumn = this.cssOverviewTable +  'thead th.column-title:last-of-type';
            return [rxSortableColumns, unsortableColumn].join();
        }
    },

    element: {
        get: function () { return $(this.cssOverviewTable); }
    },

    tblImagesRows: {
        get: function () { return $$(this.cssRowsSelector); }
    },

    headers: {
        get: function () { return tblUtil.getTableHeaders($$(this.cssHeadersSelector)); }
    },

    isDisplayed: {
        value: function () { return this.element.isDisplayed(); }
    },

    errorRowText: {
        get: function () { return $('table.images-list > tbody > tr > td').getText(); }
    },

    data: {
        value: function () {
            var page = this;
            return tblUtil.getTableData(this.cssHeadersSelector, this.cssRowsSelector).then(function (tableData) {
                return page.tblImagesRows.then(function (rows) {
                    return _.map(tableData, function (row, index) {
                        var nameAndId = row['Name (UUID)'].split('\n');
                        row.name = _.first(nameAndId).trim();
                        row.id = _.last(nameAndId).trim();
                        row.created = moment(row['Created'], util.dateTimeFormat).valueOf();

                        rows[index].$('td:last-of-type').then(function (cog) {
                            row.Actions = actionCog(cog);
                        });

                        if (_.isEqual(row.Gen, 'Next')) {
                            rows[index].$('td:nth-of-type(3) > a').then(function (link) {
                                row.viewDetails = link.click;
                            });
                        }

                        row['statusElement'] = rows[index].$('td:first-of-type');
                        row['statusElement'].$('span').getAttribute('tooltip').then(function (status) {
                            row['Status'] = status;
                        });

                        /* jshint camelcase: false */
                        if (!_.isNull(row.instance_uuid)) {
                            rows[index].$('td:nth-of-type(4) > a').then(function (link) {
                                row.viewAssociatedServer = link.click;
                            });
                        }

                        return row;
                    });
                });
            });
        }
    },

    findImage: {
        value: function (query, filter) {
            return this.find(query, filter).then(function (image) {
                if (_.isUndefined(image)) {
                    throw new Error('Unable to find image with query: ' + JSON.stringify(query));
                }
                return image;
            });
        }
    },

    viewImageDetails: {
        value: function (query, filter) {
            return this.findImage(query, filter).then(function (image) {
                return image.viewDetails();
            });
        }
    },

    viewAssociatedServer: {
        value: function (query, filter) {
            return this.findImage(query, filter).then(function (image) {
                return image.viewAssociatedServer();
            });
        }
    },

    deleteImage: {
        value: function (imageQuery, filter) {
            return this.findImage(imageQuery, filter).then(function (row) {
                return row.Actions.expand().then(function (actions) {
                    actions['Delete Image'].click();
                    return basePage.modalConfirmButton.click();
                });
            });
        }
    },

    createServer: {
        value: function (imageQuery, filter) {
            return this.findImage(imageQuery, filter).then(function (row) {
                return row.Actions.expand().then(function (actions) {
                    actions['Create Server from Image'].click();
                    return row;
                });
            });
        }
    },

    hasActions: {
        value: function (status) {
            var xpath = '//table[contains(@class, "images-list")]//tr[td[@status="' + status + '"]]//rx-action-menu';
            return element(by.xpath(xpath)).isPresent();
        }
    },

    hasCreateAction: {
        value: function (status) {
            var xpath = '//table[contains(@class, "images-list")]//tr[td[@status="' + status + '"]]' +
                            '//rx-action-menu//*[contains(concat(" ", normalize-space(@class), " "),' +
                            '" create-server ")]';
            return element(by.xpath(xpath)).isPresent();
        }
    },

    hasDeleteAction: {
        value: function (status) {
            var xpath = '//table[contains(@class, "images-list")]//tr[td[@status="' + status + '"]]' +
                              '//rx-action-menu//span[contains(text(), "Delete Image")]';
            return element(by.xpath(xpath)).isPresent();
        }
    },

    hasGenType: {
        value: function (genType) {
            var xpath = '//table[contains(@class, "images-list")]' +
            '//tr[td[position()=2 and contains(text(), "' + genType.gen + '")] and ' +
            'td[position()=8 and contains(text(), "' + genType.type + '")]]';
            return element(by.xpath(xpath)).isPresent();
        }
    },

    getAllTypes: {
        value: function () {
            var genTypes = [
                { gen: 'First', type: 'Private' },
                { gen: 'First', type: 'Public' },
                { gen: 'Next', type: 'Private' },
                { gen: 'Next', type: 'Public' },
                { gen: 'Next', type: 'Shared' },
            ];
            var promises = _.map(genTypes, this.hasGenType);

            return protractor.promise.all(promises).then(function (fulfills) {
                var results = _.reduce(fulfills, function (arr, result, index) {
                    if (!result) {
                        return arr;
                    }
                    if (genTypes[index].gen === 'First') {
                        result = (genTypes[index].type === 'Public') ? 'base' : 'snapshot';
                    } else {
                        result = genTypes[index].type.toLowerCase();
                    }
                    arr.push(result);
                    return arr;
                }, []);
                return results;
            });
        }
    }
};

imagesOverviewTable = tblCommon.wrap(imagesOverviewTable);
module.exports = Page.create(imagesOverviewTable);

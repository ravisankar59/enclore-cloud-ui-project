var tests = {
    url: function (url) {
        it('should be at the correct URL', function () {
            expect(basePage.currentUrl).to.eventually.contain(url);
        });
    },
    breadcrumbs: function (breadcrumbs) {
        it('should have correct breadcrumbs', function () {
            expect(basePage.breadcrumbs.getBreadcrumbNames()).to.eventually.eql(breadcrumbs);
        });
    },
    userDetails: function (isDisplayed) {
        it('should have user details sidebar', function () {
            expect(basePage.userDetails.isDisplayed()).to.eventually.be[isDisplayed];
        });
    },
    userProducts: function (isDisplayed) {
        it('should have user products sidebar', function () {
            expect(basePage.userProducts.isDisplayed()).to.eventually.be[isDisplayed];
        });
    },
    title: function (title) {
        it('should have page title', function () {
            if (!_.isRegExp(title)) {
                title = new RegExp(title);
            }
            expect(basePage.pageTitle).to.eventually.match(title);
        });
    },
    subtitle: function (subtitle) {
        it('should have page subtitle', function () {
            var action = 'match';
            if (!_.isRegExp(subtitle)) {
                action = 'equal';
            }
            expect(basePage.pageSubtitle).to.eventually[action](subtitle);
        });
    },
    table: function (tableOpts) {
        var tblTests = {
            sort: function () {
                tableOpts.sort.table = tableOpts.object;
                if (tableOpts.sort.useRxSortableColumn) {
                    tests.sortableColumn(tableOpts.sort);
                } else {
                    tests.sort(tableOpts.sort);
                }
            },
            hasFloatingHeader: function (isFloating) {
                var testTitle = 'should have floating header on table';
                if (!isFloating) {
                    testTitle = 'should not have floating header on table';
                }

                it(testTitle, function () {
                    var tableElement = tableOpts.root || tableOpts.object.element;
                    tableElement.getAttribute('rx-floating-header').then(function (headerAttr) {
                        if (isFloating) {
                            expect(headerAttr).to.not.be.null;
                        } else {
                            expect(headerAttr).to.be.null;
                        }
                    });
                });
            }
        };

        _.each(tableOpts, function (val, name) {
            if (_.has(tblTests, name)) {
                tblTests[name](val);
            }
        });
    },
    sort: function (sort) {
        _.each(sort.columns, function (sortProperty, column) {
            var empty = '';
            if (sort.empty && sort.empty[column]) {
                empty = sort.empty[column];
            }
            it('should be sortable by "' + column + '" ascending', function () {
                sort.table.sortBy(column);
                expect(sort.table.isAscending(sortProperty, empty)).to.eventually.be.true;
            });

            it('should be sortable by "' + column + '" descending', function () {
                var ascending = false;
                sort.table.sortBy(column, ascending);
                expect(sort.table.isDescending(sortProperty, empty)).to.eventually.be.true;
            });
        });
    },
    sortableColumn: function (sort) {
        _.each(sort.columns, function (column, name) {
            var tblColumn = tests.columnInitialize(name, sort.repeater);

            function getColumnData () {
                var data = null;
                if (column.dataFn) {
                    data = tblColumn.getDataUsing(column.dataFn, column.selector);
                } else {
                    data = tblColumn.data;
                }
                return data;
            }

            if (!column.isPort) {
                it('should be sortable by "' + name + '" ascending', function () {
                    tblColumn.sortAscending();
                    expect(tests.isDataAscending(getColumnData())).to.eventually.be.true;
                });

                it('should be sortable by "' + name + '" descending', function () {
                    tblColumn.sortDescending();
                    expect(tests.isDataDescending(getColumnData())).to.eventually.be.true;
                });
            } else {
                // we currently do not support sorting by Port
                it.skip('should be sortable by Port ascending', function () {
                    tblColumn.sortAscending();
                    expect(tests.isDataAscending(getColumnData())).to.eventually.be.false;
                });

                it.skip('should be sortable by Port descending', function () {
                    tblColumn.sortDescending();
                    expect(tests.isDataAscending(getColumnData())).to.eventually.be.false;
                });
            }
        });
    },
    columnInitialize: function (columnName, repeaterString) {
        var columnElement = element(by.cssContainingText('rx-sortable-column', columnName));

        return encore.rxSortableColumn.initialize(columnElement, repeaterString);
    },
    isDataAscending: function (data) {
        return data.then(function (array) {
            for (var i = 0, len = array.length - 1; i < len; i++) {
                if (array[i] > array[i + 1]) {
                    return false;
                }
            }
            return true;
        });
    },
    isDataDescending: function (data) {
        return data.then(function (array) {
            for (var i = 0, len = array.length - 1; i < len; i++) {
                if (array[i] < array[i + 1]) {
                    return false;
                }
            }
            return true;
        });
    },
    display: function (elements) {
        _.each(elements, function (ele, title) {
            it('should show ' + title, function () {
                expect(ele.isDisplayed()).to.eventually.be.true;
            });
        });
    },
    notDisplay: function (elements) {
        _.each(elements, function (ele, title) {
            it('should not show ' + title, function () {
                try {
                    expect(ele.isPresent()).to.eventually.be.false;
                }
                catch (e) {
                    expect(ele.isDisplayed()).to.eventually.be.false;
                }
            });
        });
    },
    match: function (elements) {
        _.each(elements, function (eleValue, title) {
            title = title.split(' | ');
            var eleName = _.first(title);
            var regex = new RegExp(escape(_.last(title)));
            it('should correctly match ' + eleName, function () {
                expect(eleValue).to.eventually.match(regex);
            });
        });
    },
    equal: function (elements) {
        _.each(elements, function (ele, title) {
            title = title.split(' | ');
            var eleName = _.first(title);
            var expectedValue = _.last(title);
            it('should have ' + expectedValue + ' for ' + eleName, function () {
                expect(ele.getText()).to.eventually.equal(expectedValue);
            });
        });
    },
    paginate: require('./common/rx-paginate')
};

function commonTests(expectedValues) {
    describe('Common Tests', function () {
        before(function  () {
            if (_.has(expectedValues.table, 'sort')) {
                basePage.setItemsPerPage(5);
            }
        });
        _.each(expectedValues, function (expected, key) {
            if (tests[key]) {
                tests[key](expected);
            }
        });
    });
}

commonTests.dataFunctions = {
    status: function (cellElements) {
        return cellElements.map(function (cellElement) {
            return cellElement.getAttribute('tooltip-content');
        });
    },
    name: function (cellElements) {
        return cellElements.map(function (cellElement) {
            return cellElement.$('a').getText();
        });
    },
    protocol: function (cellElements) {
        return cellElements.getText().then(function (textArray) {
            return _.map(textArray, function (text) {
                return text.split(' ')[0];
            });
        });
    },
    nodeCount: function (cellElements) {
        return cellElements.map(function (cellElement) {
            return cellElement.getText().then(function (text) {
                return Number(text);
            });
        });
    },
    port: function (cellElements) {
        return cellElements.map(function (cellElement) {
            return cellElement.getText().then(function (text) {
                return text.split(' ')[1].replace(/[()]/g, '');
            });
        });
    }
};

module.exports = commonTests;

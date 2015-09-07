var imagesOverviewPage = require('../../../pages/images/overview');
var commonTests = require('../../common');
var rxSelectFilter = encore.rxSelectFilter;

describe('Images Overview Page - Page Layout', function () {

    var user = ptor.params.user;

    before(function () {
        imagesOverviewPage.go();
        basePage.setItemsPerPage(10);
    });

    var expected = {
        url: ptor.baseUrl + imagesOverviewPage.url,
        breadcrumbs: ['Home', 'User ' + user, 'Images', 'Overview'],
        title: 'Images',
        subtitle: new RegExp('(\\d+\\s)Images found for\\s' + user),
        table: {
            object: imagesOverviewPage.table,
            hasFloatingHeader: true,
            sort: {
                columns: {
                    'Status': 'Status',
                    'Gen': 'Gen',
                    'Name (UUID)': 'name',
                    'Parent Server': 'Parent Server',
                    'Created': 'created',
                    'Region': 'Region',
                    'OS': 'OS',
                    'Type': 'Type'
                }
            }
        },
        display: {
            'user products sidebar': basePage.userProducts,
            'user details sidebar': basePage.userDetails,
            'images table': imagesOverviewPage.table,
            'images table pagination': imagesOverviewPage.table.tblPagination,
            '"Go to Reach Server Images" Link': imagesOverviewPage.lnkReach,
            'Account Info Banner': basePage.accountInfoBanner
        }
    };

    commonTests(expected);

    describe('Midway Tests', function () {
        var query = { name: 'CoreOS (Beta)', id: '547a46bd-d913-4bf7-ac35-2f24f25f1b7a', Region: 'ORD' };
        var timePattern = /Jun \d{1,2}, 2014 @ \d{1,2}:\d{2} \(UTC[-+]\d{4}\)/;
        var filter = query.name;

        before(function () {
            imagesOverviewPage.go();
            basePage.dismissPageStatus();
        });

        it('should have the expected data for the selected image @dev', function () {

            imagesOverviewPage.table.findImage(query, filter).then(function (image) {
                expect(image).to.have.property('Gen', 'Next');
                expect(image).to.have.property('Status', 'ACTIVE');
                expect(image).to.have.property('name', query.name);
                expect(image).to.have.property('id', query.id);
                expect(image).to.have.property('Parent Server', 'Leonel Server');
                expect(image).to.have.property('Created').to.match(timePattern);
                expect(image).to.have.property('Region', query.region);
                // Currently there is no good way to grab the os, as it just uses a class.
                // expect(image).to.have.property('OS', 'linux');
                expect(image).to.have.property('Type', 'Private');
            });
        });

        describe('Status Actions', function () {
            var imageStatuses = [
                { status: 'KILLED', action: false },
                { status: 'ERROR', action: true },
                { status: 'ACTIVE', action: true },
                { status: 'DELETED', action: false },
                { status: 'UNKNOWN', action: false },
                { status: 'DEACTIVATED', action: false },
                { status: 'SAVING', action: false },
                { status: 'PENDING_DELETE', action: false },
            ];

            before(function () {
                imagesOverviewPage.go();
            });

            it('should only allow actions for images with an "Active" or "Error" status @dev', function () {
                _.forEach(imageStatuses, function (obj) {
                    expect(imagesOverviewPage.table.hasActions(obj.status)).to.eventually.eql(obj.action);
                });
            });

            it('should only allow "Delete" action for images with an "Active" or "Error" status @dev', function () {
                _.forEach(imageStatuses, function (obj) {
                    expect(imagesOverviewPage.table.hasDeleteAction(obj.status)).to.eventually.eql(obj.action);
                });
            });

            it('should only allow "Create" action for images with an "Active" status @dev', function () {
                _.forEach(imageStatuses, function (obj) {
                    expect(imagesOverviewPage.table.hasCreateAction(obj.status))
                    .to.eventually.eql(obj.status === 'ACTIVE');
                });
            });
        });

        describe('Verify Type Filter', function () {
            var expectedTypes = ['public', 'private', 'shared', 'base', 'snapshot'];
            var selectFilter = rxSelectFilter.main;

            before(function () {
                imagesOverviewPage.go();
            });

            it('should show all images when all types are selected @dev', function () {
                selectFilter.apply({
                    'Filter By Type': { All: true }
                });

                var types = imagesOverviewPage.table.getAllTypes();
                expect(types).to.eventually.have.members(expectedTypes);
            });

            it('should not show elements when no types are selected @dev', function () {
                selectFilter.multiSelectByLabel('Filter By Type').openMenu();
                basePage.toggleRxSelectElement('all', false);

                var types = imagesOverviewPage.table.getAllTypes();
                expect(types).to.eventually.be.empty;
            });

            it('should filter types based on selected types @dev', function () {
                selectFilter.multiSelectByLabel('Filter By Type').openMenu();
                _.each(expectedTypes, function (type) {
                    basePage.toggleRxSelectElement('all', false);
                    basePage.toggleRxSelectElement(type, true);
                    var types = imagesOverviewPage.table.getAllTypes();
                    expect(types).to.eventually.eql([type]);
                });
            });
        });
    });

    describe('Smoke Tests', function () {

        it('should have correct columns ', function () {
            imagesOverviewPage.go();
            var expectedHeaders = ['Status', 'Gen', 'Name (UUID)', 'Parent Server',
                                   'Created', 'Region', 'OS', 'Type', ''];
            expect(imagesOverviewPage.table.headers).to.eventually.eql(expectedHeaders);
        });

        it('should show error message if no user found ', function () {
            var tableMsg = 'No Images have been created.';

            ptor.get(ptor.baseUrl + '/cloud/123/bad_wolf/images/');

            expect(imagesOverviewPage.table.errorRowText).to.eventually.contain(tableMsg);
        });

        it('should not show firstgen loading error message if firstgen not in user service catalog', function () {
            var tableMsg = 'Error loading FirstGen Images';

            ptor.get(ptor.baseUrl + '/cloud/123/bad_wolf/images/');

            expect(encore.rxNotify.all.exists(tableMsg)).to.eventually.be.false;
        });
    });
});

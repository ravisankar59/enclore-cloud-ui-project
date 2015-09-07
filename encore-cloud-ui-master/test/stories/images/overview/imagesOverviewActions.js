var imagesOverviewPage = require('../../../pages/images/overview');
var createPage = require('../../../pages/servers/create.js');
var rxSelectFilter = encore.rxSelectFilter;

describe('Images Overview Page - Image Actions', function () {
  //
    // #TODO Complete mocked tests
    var accountNumber, user;
    var selectFilter = rxSelectFilter.main;
    before(function () {
        user = ptor.params.user;
        accountNumber = ptor.params.accountNumber;
    });

    describe('Midway Tests', function () {

        before(function () {
            imagesOverviewPage.go();
            selectFilter.apply({
                'Filter By Type': { All: true }
            });
            basePage.disableRxNotifyTimeout();
        });

        it('should find & delete image that is private & nextgen @dev', function () {
            var query = { id: '32104f95-a005-4165-b147-6ed9a3702642' };
            var filter = 'Windows Server 2008 R2 SP1 + SQL Server 2012 SP1 Web';
            var msg = 'Image: "' + filter + '" has been deleted.' +
                ' Please allow a few minutes for this change to take effect.';

            imagesOverviewPage.table.deleteImage(query, filter).then(function () {
                expect(encore.rxNotify.all.exists(msg)).to.eventually.be.true;
            });
        });

        it('should fail to delete an image that is private & nextgen @dev', function () {
            var query = { id: '64f5a683-1666-404b-9b17-6dd31fa6e0ba' };
            var filter = 'Windows Server 2008 R2 SP1 + SQL Server 2008 R2 SP2 Standard';

            imagesOverviewPage.table.deleteImage(query, filter).then(function () {
                expect(encore.rxNotify.all.exists('Error deleting Image:')).to.eventually.be.true;
            });
        });

        it('should find & delete image that is private & firstgen @dev', function () {
            var query = { id: '67' };
            var filter = 'CentOS 5 - MGC Base';
            var msg = 'Image: "' + filter + '" has been deleted.' +
                ' Please allow a few minutes for this change to take effect.';

            selectFilter.apply({
                'Filter By Type': { All: true }
            });

            imagesOverviewPage.table.deleteImage(query, filter).then(function () {
                expect(encore.rxNotify.all.exists(msg)).to.eventually.be.true;
            });
        });

        it('should fail to delete image that is public & firstgen @dev', function () {
            var query = { id: '200' };
            var filter = 'CentOS 5 - MGC Base - XenServer';

            imagesOverviewPage.table.deleteImage(query, filter).then(function () {
                expect(encore.rxNotify.all.exists('Error deleting Image:')).to.eventually.be.true;
            });
        });

        it('should link to the associated server details page @dev', function () {
            var query = { id: '547a46bd-d913-4bf7-ac35-2f24f25f1b7a' };
            var filter = 'Leonel';
            var expectedURL = ptor.baseUrl + '/cloud/' + accountNumber + '/' +
                user + '/servers/ORD/9ae1032c-b39d-4eeb-b4f8-eb9b97a89d1f';
            imagesOverviewPage.table.viewAssociatedServer(query, filter).then(function () {
                expect(imagesOverviewPage.currentUrl).to.eventually.equal(expectedURL);
            });
        });

        describe('Create Server From Image', function () {
            var query = { name: 'CoreOS (Beta)', id: '547a46bd-d913-4bf7-ac35-2f24f25f1b7a', Region: 'DFW' };
            var filter = query.name;

            before(function () {
                imagesOverviewPage.go();
                basePage.disableRxNotifyTimeout();
                basePage.dismissPageStatus();
            });

            it('should navigate to the server create page @dev', function () {
                var expectedURL = ptor.baseUrl + '/cloud/' + accountNumber + '/' +
                    user + '/servers/create/' + query.Region + '/' + query.id;
                imagesOverviewPage.table.createServer(query, filter).then(function () {
                    expect(imagesOverviewPage.currentUrl).to.eventually.equal(expectedURL);
                });
            });

            it('should display the saved images table @dev', function () {
                expect(createPage.savedImagesTable.isDisplayed()).to.eventually.be.true;
            });

            it('should have the proper image selected @dev', function () {
                /* jshint maxlen:false */
                expect(createPage.savedImagesTable.selectedImage).to.eventually.have.property('Name', query.name);
            });
        });
    });
});

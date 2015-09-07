var imageDetailsPage = require('../../../pages/images/details');
var createPage = require('../../../pages/servers/create.js');

describe('Image Details Page - Page Actions', function () {

    var accountNumber, user;
    before(function () {
        user = ptor.params.user;
        accountNumber = ptor.params.accountNumber;
    });

    describe('Midway Tests', function () {
        before(function () {
            imageDetailsPage.open();
        });

        it('should delete image that is private & nextgen @dev', function () {
            imageDetailsPage.lnkDeleteServer.click();
            imageDetailsPage.deleteImageModal.submit().then(function () {
                var msg = 'Image: "CoreOS (Beta)" has been deleted.' +
                ' Please allow a few minutes for this change to take effect.';

                expect(encore.rxNotify.all.exists(msg)).to.eventually.be.true;
            });
        });

        describe('Metadata', function () {
            before(function () {
                imageDetailsPage.open();
            });

            it('should take you to base image page @dev', function () {
                var expectedURL = ptor.baseUrl + '/cloud/' + accountNumber + '/' +
                    user + '/images/ORD/afb5ee19-4e6e-42c3-841c-9663e99b83ba';
                imageDetailsPage.lnkBaseImage.click();
                expect(imageDetailsPage.currentUrl).to.eventually.equal(expectedURL);
            });
        });

        describe('Create Server From Image', function () {
            var imageName = 'CoreOS (Beta)';

            before(function () {
                imageDetailsPage.open();
                imageDetailsPage.lnkCreateServer.click();
            });

            it('should navigate to the server create page @dev', function () {
                var expectedURL = ptor.baseUrl + '/cloud/' + accountNumber + '/' +
                    user + '/servers/create/ORD/547a46bd-d913-4bf7-ac35-2f24f25f1b7a';
                expect(imageDetailsPage.currentUrl).to.eventually.equal(expectedURL);
            });

            it('should display the saved images table @dev', function () {
                expect(createPage.savedImagesTable.isDisplayed()).to.eventually.be.true;
            });

            it('should have the proper image selected @dev', function () {
                /* jshint maxlen:false */
                expect(createPage.savedImagesTable.selectedImage).to.eventually.have.property('Name', imageName);
            });
        });
    });
});

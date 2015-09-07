var networkCreatePage = require('../../../pages/networks/create');
var commonTests = require('../../common');

describe('Network Create Page - Layout', function () {

    before(function () {
        networkCreatePage.go();
    });

    var expected = {
        url: ptor.baseUrl + networkCreatePage.url,
        breadcrumbs: ['Home', 'User ' + ptor.params.user, 'Networks', 'Create Network'],
        title: 'Create a New Network',
        display: {
            'user products sidebar': basePage.userProducts,
            'user details sidebar': basePage.userDetails,
            'a cancel button': networkCreatePage.btnCancel
        }
    };

    commonTests(expected);

    describe('Smoke Tests', function () {

        it('should auto populate cidr', function () {
            expect(networkCreatePage.txtCidr).to.not.be.empty;
            networkCreatePage.txtCidr.getAttribute('value').then(function (cidr) {
                expect(cidr).to.match(/\d+.\d+.\d+.\d+\/\d+/);
            });
        });
    });
});

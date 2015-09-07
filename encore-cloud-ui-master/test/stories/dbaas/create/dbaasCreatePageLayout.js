var dbaasCreatePage = require('../../../pages/dbaas/create');
var dbaasOverviewPage = require('../../../pages/dbaas/overview');
var commonTests = require('../../common');
var breadcrumbs = basePage.breadcrumbs;

describe('Database Create Page - Page Layout', function () {

    before(function () {
        dbaasCreatePage.go();
    });

    var expected = {
        url: ptor.baseUrl + dbaasCreatePage.url,
        breadcrumbs: ['Home', 'User ' + ptor.params.user, 'Instances', 'Create'],
        title: 'Create a New Instance',
        subtitle: 'for user account (' + ptor.params.user + ')',
        display: {
            'user products sidebar': basePage.userProducts,
            'user details sidebar': basePage.userDetails,
            'instance create cancel button': dbaasCreatePage.btnCancel,
            'instance name field': dbaasCreatePage.txtInstanceName,
            'instance region field': dbaasCreatePage.selRegion,
            'instance volume size field': dbaasCreatePage.numVolumeSize,
            'instance flavor field': dbaasCreatePage.selFlavor
        },
        equal: {
            'label for name field | Name:': dbaasCreatePage.lblInstanceName,
            'label for region field | Region:': dbaasCreatePage.lblRegion,
            'label for volume size field | Volume Size:': dbaasCreatePage.lblVolumeSize,
            'label for flavor field | Flavor:': dbaasCreatePage.lblFlavor
        }
    };

    commonTests(expected);

    describe('Smoke Tests', function () {
        
        it('should take you back to the instances page using the breadcrumbs', function () {
            breadcrumbs.getBreadcrumbs().then(function (breadcrumbs) {
                breadcrumbs['Instances'].visit();
            });
            expect(dbaasCreatePage.currentUrl).to.eventually.equal(ptor.baseUrl + dbaasOverviewPage.url);
            dbaasCreatePage.go();
        });
    });
});

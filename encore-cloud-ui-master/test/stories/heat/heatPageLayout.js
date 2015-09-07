var heatPage = require('../../pages/heat/heatPage');
var commonTests = require('../common');

describe('Heat Page', function () {

    // If not in midway, we must change users before anything else
    if (!basePage.isInMidwayEnvironment()) {
        loginPage.switchToUser('cloudqe2', '708237');
    }

    before(function () {
        heatPage.go();
        /**
        * newWindowUrl was added here to return control to the parent page after each test.
        * Which if not done causes a 'angular sync errors' 
        **/
        heatPage.newWindowURL;
    });

    var expected = {
        breadcrumbs: ['Home', 'User ' + ptor.params.user, 'Cloud Orchestration (Heat)', 'Heat'],
        title: 'Cloud Orchestration'
    };

    commonTests(expected);

    describe('Midway Tests', function () {

        it('should immediately redirect to Heat @dev', function () {
            var heatURL = 'https://heat-ui.rs-heat.com'; // Heat STAGING url
            expect(heatPage.newWindowURL).to.eventually.contain(heatURL);
        });

        it('should display not found error message @dev', function () {
            var errorMsg = 'Could not retrieve impersonation token: Not Found';
            var noHeatURL = ptor.baseUrl + '/cloud/323676/lost_cap/heat';
            ptor.get(noHeatURL).then(function () {
                expect(encore.rxNotify.all.exists(errorMsg)).to.eventually.be.true;
            });
        });

    });

});

var backupPage = require('../../pages/backup/backupPage');
var commonTests = require('../common');

describe('Backup Page', function () {

    if (!basePage.isInMidwayEnvironment()) {
        loginPage.switchToUser('hub_cap', '323676');
    }

    beforeEach(function () {
        backupPage.go();
        /**
        * newWindowUrl was added here to return control to the parent page before each test.
        * Which if not done causes a 'angular sync errors' 
        **/
        backupPage.newWindowURL;
    });

    var expected = {
        breadcrumbs: ['Home', 'User ' + ptor.params.user, 'Cloud Backup', ''],
        title: 'Cloud Backup'
    };

    commonTests(expected);

    describe('Midway Tests', function () {

        it('should redirect to backup @dev', function () {
            expect(backupPage.newWindowURL).to.eventually.contain('https://mycloud.rackspace.com/');
        });
    });
});
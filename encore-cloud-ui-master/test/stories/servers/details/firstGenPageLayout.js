var tf = require('../../../pages/test-fixtures/api');
var firstGenDetails = require('../../../pages/servers/details').firstGen;
var serversOverviewPage = require('../../../pages/servers/overview');
var breadcrumbs = basePage.breadcrumbs;
var commonTests = require('../../common');

describe('Cloud Servers FirstGen Details Page - Page Layout', function () {

    var query, filter;
    var user = ptor.params.user;
    before(function () {
        var servers = {
            'localhost': 'kacieissoawesome',
            'staging': tf.firstGenChangePassword.name,
            'preprod': tf.firstGenChangePassword.name,
        };
        query = { name: servers[ptor.params.env] || servers['staging'] };
        filter = query.name;

        firstGenDetails.open(query, filter);
    });

    var expected = {
        breadcrumbs: ['Home', 'User ' + user, 'Servers', 'Server Details'],
        title: /Server: \w/,
        display: {
            'user products sidebar': basePage.userProducts,
            'user details sidebar': basePage.userDetails,
            'server details table': firstGenDetails.detailsTable,
            'IP addresses table': firstGenDetails.ipTable,
            'device metadata table': firstGenDetails.deviceTable,
            'backups table': firstGenDetails.backupTable,
            'server actions': firstGenDetails.serverActionList,
            '"Go to Reach Server Details" Link': firstGenDetails.lnkReach,
            '"Go to Cloud Control" Link': firstGenDetails.lnkCloudControl,
            'link to Backstage': firstGenDetails.lnkBackstage,
            'submit feedback button': basePage.feedback.btnFeedbackForm,
            'Account Info Banner': basePage.accountInfoBanner
        }
    };

    commonTests(expected);

    describe('Smoke Tests', function () {

        it('should be at the correct URL', function () {
            firstGenDetails.detailsTable.data().then(function () {
                var expectedURL = ptor.baseUrl + firstGenDetails.url + '/' + '110148309';
                expect(firstGenDetails.currentUrl).to.eventually.contain(expectedURL);
            });
        });

        it('should have correct headers on backups table', function () {
            var expectedHeaders = ['Enabled', 'Daily', 'Weekly', 'Actions'];
            expect(firstGenDetails.backupTable.headers).to.eventually.eql(expectedHeaders);
        });

        it('should show error if flavor is not selected when resizing');

        it('should link to Huddle page');

        it('should link to Host page');

        it('should display a spinner after clicking "Open Console"', function () {
            expect(firstGenDetails.eleConsoleSpinnerContainer.isPresent()).to.eventually.be.true;
        });

        it('should take you back to the servers page using the breadcrumbs', function () {
            breadcrumbs.getBreadcrumbs().then(function (breadcrumbs) {
                breadcrumbs['Servers'].visit();
            });
            expect(firstGenDetails.currentUrl).to.eventually.equal(ptor.baseUrl + serversOverviewPage.url);
        });

        it('should show error message if no information found', function () {
            ptor.get(ptor.baseUrl + '/cloud/123/bad_user/servers');
            expect(encore.rxNotify.all.exists('Error')).to.eventually.be.true;
        });
    });

    describe('Midway Tests', function () {
        var timePattern = /Mar \d{1,2}, 2015 @ \d{1,2}:\d{2} \(UTC[-+]\d{4}\)/;
     
        before(function () {
            firstGenDetails.open(query, filter);
        });

        it('should properly display the server details table @dev', function () {
            firstGenDetails.detailsTable.data().then(function (details) {
                expect(details[0]).to.eql('Server ID:\n110148309 (Backstage)');
                expect(details[1]).to.eql('Region:\nORD');
                expect(details[2]).to.eql('Status:\nACTIVE');
                expect(details[3]).to.eql('State:\nN/A');
                expect(details[4]).to.eql('Type:\nN/A');
                expect(details[5]).to.eql('Image:\nimage007');
                expect(details[6]).to.eql('Flavor:\n512MB Standard Instance');
                expect(details[7]).to.eql('Host:\ne78880b6fa7eead9c771d40f344285df');
                expect(details[8]).to.eql('Disk I/O Index:\nN/A');
                expect(details[9]).to.eql('Data Disk:\n0 GB');
                expect(details[10]).to.eql('Bandwidth:\n0 Mbps');
                expect(details[11]).to.eql('Gen:\nFirst');
                expect(details[13]).to.match(timePattern).to.contain('Created:\n');
                expect(details[14]).to.match(timePattern).to.contain('Last Updated:\n');
                // expect(details[12]).to.eql('Age:\n153d 4h');
                // // TODO this is going to fail every time since the date keeps changing
                // // more comments: https://jira.rax.io/browse/EN-934
                // // Additional note: These tests fail outside of the Central Time Zone.
            });
        });

        it('should display a warning on reboot if migration information found @dev', function () {
            var warnTxt = 'Note: Soft rebooting will convert this server to a Next Generation server.';
            var linkUrl = 'http://www.rackspace.com/knowledge_center/article/' +
                'next-generation-cloud-servers-migration-considerations-and-options';
            var linkTxt = 'More info on server conversion and scheduling.';

            firstGenDetails.btnRebootServer.click();

            expect(firstGenDetails.rebootServerModal.lnkMigrationWarningHref).to.eventually.equal(linkUrl);
            expect(firstGenDetails.rebootServerModal.lnkMigrationWarningTxt).to.eventually.equal(linkTxt);
            expect(encore.rxNotify.all.exists(warnTxt)).to.eventually.be.true;
        });

        it('should have UK backstage link @dev', function () {
            ptor.get(ptor.baseUrl + '/cloud/10323676/uk_william/servers/firstgen/5ae2222c-b39d-4eeb-b4f8-eb9b97a89d1f');
            
            var expectedUrl = 'https://uk-backstage.slicehost.com/slices/5ae2222c-b39d-4eeb-b4f8-eb9b97a89d1f';
            var lnkBackstage = firstGenDetails.lnkBackstage.getAttribute('href');

            expect(lnkBackstage).to.eventually.equal(expectedUrl);
        });
    });
});

var tf = require('../../../pages/test-fixtures/api');
var breadcrumbs = basePage.breadcrumbs;
var nextGenDetails = require('../../../pages/servers/details').nextGen;
var serversOverviewPage = require('../../../pages/servers/overview');
var commonTests = require('../../common');

describe('Cloud Servers NextGen Details Page - Page Layout', function () {

    var servers = {
        'localhost': 'Kevin\'s Test Demo',
        'staging': tf.nextGenChangePassword.name,
        'preprod': tf.nextGenChangePassword.name,
    };
    var user = ptor.params.user;
    var accountNumber = ptor.params.accountNumber;
    var query = { name: servers[ptor.params.env] || servers['staging'] };
    var filter = query.name;
    before(function () {
        if (ptor.params.env === 'localhost') {
            loginPage.loginLocalhost();
        }

        nextGenDetails.open(query, filter);
    });

    var expected = {
        url: ptor.baseUrl + '/cloud/' + accountNumber + '/' + user + '/servers/',
        breadcrumbs: ['Home', 'User ' + user, 'Servers', 'Server Details'],
        title: /Server: /,
        display: {
            'user products sidebar': basePage.userProducts,
            'user details sidebar': basePage.userDetails,
            'server details table': nextGenDetails.detailsTable,
            'IP addresses table': nextGenDetails.ipTable,
            'device metadata table': nextGenDetails.deviceTable,
            'attached volumes table': nextGenDetails.volumesTable,
            'submit feedback button': basePage.feedback.btnFeedbackForm,
            'a link to open the console': nextGenDetails.lnkOpenConsole,
            '"Go to Reach Server Details" Link': nextGenDetails.lnkReach,
            '"Go to Cloud Control" Link': nextGenDetails.lnkCloudControl,
            'Account Info Banner': basePage.accountInfoBanner
        }
    };

    commonTests(expected);

    describe('Smoke Tests', function () {

        it('should take you back to the servers page using the breadcrumbs', function () {
            breadcrumbs.getBreadcrumbs().then(function (breadcrumbs) {
                breadcrumbs['Servers'].visit();
            });

            expect(nextGenDetails.currentUrl).to.eventually.equal(ptor.baseUrl + serversOverviewPage.url);
            nextGenDetails.open(query, filter);
        });

        it('should show managed passwords table', function () {
            var managedPasswordsList = nextGenDetails.passwordTable.eleManagedPasswordsList;
            var env = ptor.params.env;
            var serverQuery = { Gen: 'Next' };
            if (_.isEqual(env, 'localhost')) {
                serverQuery = { name: 'Kevin\'s Test Demo' };
            } else if (_.contains(['preprod', 'production'], env)) {
                loginPage.switchToUser('encoreqe2');
            }

            serversOverviewPage.go();
            serversOverviewPage.table.viewServerDetails(serverQuery);

            expect(nextGenDetails.btnShowPasswords.isDisplayed()).to.eventually.be.true;
            expect(managedPasswordsList.isPresent()).to.eventually.be.false;

            nextGenDetails.btnShowPasswords.click();

            expect(managedPasswordsList.isDisplayed()).to.eventually.be.true;
            expect(nextGenDetails.btnShowPasswords.isPresent()).to.eventually.be.false;

            loginPage.switchToUser('hub_cap');
        });

        it('should have correct headers on attached volumes table', function () {
            var expectedHeaders = ['ID', 'Name', 'Device'];
            expect(nextGenDetails.volumesTable.headers).to.eventually.eql(expectedHeaders);
        });

        it('should display a spinner after clicking "Open Console"', function () {
            expect(nextGenDetails.eleConsoleSpinnerContainer.isPresent()).to.eventually.be.true;
        });

        it('should have correct rows on details table', function () {
            var expectedLabels = ['Server ID', 'Nickname', 'Region', 'Status', 'State', 'Type', 'Image', 'Flavor',
                                  'Host', 'Disk', 'Data Disk', 'Bandwidth', 'Gen', 'Age', 'Created', 'Last Updated'];
            var server = $(nextGenDetails.detailsTable.cssDetailsTable).evaluate('server');
            var serverFlavor = server.flavor;

            if (!_.isUndefined(serverFlavor)) {
                if (_.has(serverFlavor, 'data_disk')) {
                    expectedLabels.push('Data Disk');
                }

                if (_.has(serverFlavor, 'extra_specs')) {
                    /*jshint camelcase: false */
                    if (_.has(serverFlavor.extra_specs, 'disk_io_index')) {
                        expectedLabels.push('Disk I/O Index');
                    }
                }
            }

            nextGenDetails.detailsTable.data().then(function (details) {
                var index = 0;
                _.each(expectedLabels, function (label) {
                    expect(details[index]).to.contain(label);
                    index++;
                });
            });
        });

        it('should show error message if no information found', function () {
            ptor.get(ptor.baseUrl + '/cloud/123/bad_user/servers');
            expect(encore.rxNotify.all.exists('Error')).to.eventually.be.true;
            nextGenDetails.open(query, filter);
        });
    });

    describe('Midway Tests', function () {
        var timePattern = /Jul \d{1,2}, 2013 @ \d{1,2}:\d{2} \(UTC[-+]\d{4}\)/;

        before(function () {
            nextGenDetails.open();
        });

        // 'Created:\nJul 23, 2013 @ 22:31 (UTC-0500)',
        // 'Last Updated:\nJul 23, 2013 @ 22:37 (UTC-0500)' ]

        it('should show details table correctly @dev', function () {
            nextGenDetails.detailsTable.data().then(function (details) {
                expect(details[0]).to.eql('Server ID:\n2999ca73-f2d7-4275-ba45-84753332903b (ohthree)');
                expect(details[1]).to.eql('Nickname:');
                expect(details[2]).to.eql('Region:\nORD');
                expect(details[3]).to.eql('Status:\nACTIVE');
                expect(details[4]).to.eql('State:\nN/A');
                expect(details[5]).to.eql('Type:\nN/A');
                expect(details[6]).to.eql('Image:\nimage007');
                expect(details[7]).to.eql('Flavor:\n512MB Standard Instance');
                expect(details[8]).to.eql('Host:\nc9ad727ea68dbfa26c75414168ded823e3cbc53756b0fb884c0dec2d');
                expect(details[9]).to.eql('Disk I/O Index:\n2');
                expect(details[10]).to.eql('Data Disk:\n0 GB');
                expect(details[11]).to.eql('Bandwidth:\n80 Mbps');
                expect(details[12]).to.eql('Gen:\nNext');
                expect(details[14]).to.match(timePattern).to.contain('Created:\n');
                expect(details[15]).to.match(timePattern).to.contain('Last Updated:\n');
                // TODO this is going to fail every time since the date keeps changing
                // more comments: https://jira.rax.io/browse/EN-934
                // expect(details[13]).to.eql('Age:\n749d 18h');
                // Additional note: These tests fail outside of the Central Time Zone.
            });
        });

        it('should show an attached volume @dev', function () {
            nextGenDetails.volumesTable.data().then(function (attachedVolumes) {
                var volume = attachedVolumes[0];

                expect(attachedVolumes.length).to.equal(3);
                expect(volume).to.have.property('ID', 'bcf2fea6-91c1-4a9a-b49d-204543ebfb56');
                expect(volume).to.have.property('Name', '0202630a-d392-4bdb-b3fa-c7b80ec3f7e9');
                expect(volume).to.have.property('Device', '/dev/xvdd');
            });
        });

        it('should show error message if no server found @dev', function () {
            var noServerUrl = ptor.baseUrl + '/cloud/323676/hub_cap/servers/ORD/2801f5f3-1645-4610-b1ad-5db2d412e5d3';
            var error = 'Error loading server details: Not Found';

            ptor.get(noServerUrl);

            expect(encore.rxNotify.all.exists(error)).to.eventually.be.true;
            basePage.dismissPageStatus();
        });

        describe('Empty Next Gen Detail page', function () {

            before(function () {
                nextGenDetails.go('5000');
            });

            it('should show IP address error message @dev', function () {
                expect(nextGenDetails.ipsMessage()).to.eventually.equal('No IP Addresses found.');
            });

            it('should show device metadata error message @dev', function () {
                var error = 'No Device Metadata on this server.';
                expect(nextGenDetails.metadataMessage()).to.eventually.equal(error);
            });

            it('should show volumes error message @dev', function () {
                var error = 'No Volumes have been attached on this server.';
                expect(nextGenDetails.volumesMessage()).to.eventually.equal(error);
            });

        });

        describe('Next Gen Detail page (15 GB I/O v1 Flavor)', function () {

            before(function () {
                nextGenDetails.go('9ae1032c-b39d-4eeb-b4f8-eb9b97a89d1f');
            });

            it('should show details table correctly @dev', function () {
                nextGenDetails.detailsTable.data().then(function (details) {
                    expect(details[0]).to.eql('Server ID:\n9ae1032c-b39d-4eeb-b4f8-eb9b97a89d1f (ohthree)');
                    expect(details[1]).to.eql('Nickname:');
                    expect(details[2]).to.eql('Region:\nORD');
                    expect(details[3]).to.eql('Status:\nACTIVE');
                    expect(details[4]).to.eql('State:\nN/A');
                    expect(details[5]).to.eql('Type:\nN/A');
                    expect(details[6]).to.eql('Image:\nimage007');
                    expect(details[7]).to.eql('Flavor:\n15 GB I/O v1');
                    expect(details[8]).to.eql('Host:\nc9ad727ea68dbfa26c75414168ded823e3cbc53756b0fb884c0dec2d');
                    expect(details[9]).to.eql('Disk I/O Index:\n40');
                    expect(details[10]).to.eql('Data Disk:\n150 GB');
                    expect(details[11]).to.eql('Bandwidth:\n1250 Mbps');
                    expect(details[12]).to.eql('Gen:\nNext');
                    // expect(details[13]).to.eql('Age:\n750d 10h');
                    expect(details[14]).to.match(timePattern).to.contain('Created:\n');
                    expect(details[15]).to.match(timePattern).to.contain('Last Updated:\n');
                });
            });
        });

        describe('Next Gen Detail page (bad flavor)', function () {

            before(function () {
                nextGenDetails.go('1111032c-b39d-4eeb-b4f8-eb9b97a89d1f');
            });

            it('should show flavor error message @dev', function () {
                var error = 'Error loading server flavor: The resource could not be found.';
                expect(encore.rxNotify.all.exists(error)).to.eventually.be.true;
            });

            it('should show details table correctly @dev', function () {
                nextGenDetails.detailsTable.data().then(function (details) {
                    expect(details[0]).to.eql('Server ID:\n1111032c-b39d-4eeb-b4f8-eb9b97a89d1f (ohthree)');
                    expect(details[1]).to.eql('Nickname:\nSome Nickname');
                    expect(details[2]).to.eql('Region:\nORD');
                    expect(details[3]).to.eql('Status:\nACTIVE');
                    expect(details[4]).to.eql('State:\nN/A');
                    expect(details[5]).to.eql('Type:\nN/A');
                    expect(details[6]).to.eql('Image:\nimage007');
                    expect(details[7]).to.eql('Flavor:\n60 GB Performance');
                    expect(details[8]).to.eql('Host:\nc9ad727ea68dbfa26c75414168ded823e3cbc53756b0fb884c0dec2d');
                    expect(details[9]).to.eql('Disk I/O Index:\nN/A');
                    expect(details[10]).to.eql('Data Disk:\n0 GB');
                    expect(details[11]).to.eql('Bandwidth:\nMbps');
                    expect(details[12]).to.eql('Gen:\nNext');
                    // expect(details[13]).to.eql('Age:\n750d 11h');
                    expect(details[14]).to.match(timePattern).to.contain('Created:\n');
                    expect(details[15]).to.match(timePattern).to.contain('Last Updated:\n');
                });
            });
        });

        describe('Next Gen Detail page (IP addresses)', function () {

            before(function () {
                nextGenDetails.go('2999ca73-f2d7-4275-ba45-84753332903b');
            });

            it('should show Standard and RackConnect IP addresses @dev', function () {
                nextGenDetails.ipTable.data().then(function (ipAddresses) {

                    expect(ipAddresses.length).to.equal(5);
                    expect(ipAddresses[0]).to.have.property('Type', 'IPv4');
                    expect(ipAddresses[1]).to.have.property('Type', 'IPv4');
                    expect(ipAddresses[2]).to.have.property('Type', 'IPv6');
                    expect(ipAddresses[3]).to.have.property('Type', 'RackConnect - Public');
                    expect(ipAddresses[4]).to.have.property('Type', 'RackConnect - Access IP');
                });
            });
        });

        describe('Create A Ticket Button Visibility', function () {

            beforeEach(function () {
                nextGenDetails.open();
            });

            it('should show the create a ticket button if encore_ticketing_alpha role @dev', function () {
                loginPage.addRole('encore_ticketing_alpha');
                expect(nextGenDetails.btnCreateTicket.isDisplayed()).to.eventually.be.true;
            });

            it('should not show the create a ticket button if not encore_ticketing_alpha role @dev', function () {
                loginPage.removeRole('encore_ticketing_alpha');
                expect(nextGenDetails.btnCreateTicket.isPresent()).to.eventually.be.false;
            });
        });
    });
});

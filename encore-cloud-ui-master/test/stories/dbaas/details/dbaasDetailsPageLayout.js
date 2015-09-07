var breadcrumbs = basePage.breadcrumbs;
var dbaasDetailsPage = require('../../../pages/dbaas/details');
var dbaasOverviewPage = require('../../../pages/dbaas/overview');
var commonTests = require('../../common');
var instanceId = '547b3c8a-a8d8-40b9-ba92-324afa7b90ef';

describe('Database Instance Details Page - Page Layout', function () {

    var timePattern = /Dec \d{1,2}, 2013 @ \d{1,2}:\d{2} \(UTC[-+]\d{4}\)/;
    var ageWithTimePattern;
    ageWithTimePattern = /\d{1,3}[d,h,m] \d{1,2}[d,h,m] Created \(Dec \d{1,2}, 2013 @ \d{1,2}:\d{2} \(UTC[-+]\d{4}\)\)/;

    before(function () {
        if (basePage.isInMidwayEnvironment()) {
            return dbaasDetailsPage.go(instanceId);
        }
        // TODO: Replace with fixture instead of hard-coded name
        dbaasDetailsPage.open({
            Name: 'auto-dbWithUser'
        });
    });

    var expected = {
        title: 'Instance:',
        breadcrumbs: ['Home', 'User ' + ptor.params.user, 'Instances', 'Instance Details'],
        display: {
            'databases table': dbaasDetailsPage.databaseTable,
            'filter for databases table': dbaasDetailsPage.databaseTable.txtFilter,
            '"Create Database" link above Databases table': dbaasDetailsPage.databaseTable.lnkCreateDatabase,
            '"Create Users" link above Users table': dbaasDetailsPage.usersTable.lnkCreateUser,
            'users table': dbaasDetailsPage.usersTable,
            'filter for users table': dbaasDetailsPage.usersTable.txtFilter,
            'action "Restart Instance"': dbaasDetailsPage.lnkRestartInstance,
            'action "Resize Flavor"': dbaasDetailsPage.lnkResizeFlavor,
            'action "Resize Volume"': dbaasDetailsPage.lnkResizeVolume,
            'action "Delete Instance"': dbaasDetailsPage.lnkDeleteInstance,
            'Account Info Banner': basePage.accountInfoBanner
        },
        equal: {
            'label above databases table | Databases': dbaasDetailsPage.databaseTable.label,
            'label above users table | Users': dbaasDetailsPage.usersTable.label,
        }
    };

    commonTests(expected);

    describe('Midway Tests', function () {

        it('should take you back to the instance list page using the breadcrumbs @dev', function () {
            breadcrumbs.getBreadcrumbs().then(function (breadcrumbs) {
                breadcrumbs['Instances'].visit();
            });

            expect(dbaasDetailsPage.currentUrl).to.eventually.equal(ptor.baseUrl + dbaasOverviewPage.url);
            dbaasDetailsPage.go('/' + instanceId);
        });

        it('should list correct instance details @dev', function () {
            // shortcut to functions to save on reading/space
            dbaasDetailsPage.detailsTable.data().then(function (details) {
                expect(details[0]).to.eql('Hostname:\n8ae6f1e7ac2.staging.rackspaceclouddb.com');
                expect(details[1]).to.eql('UUID:\n547b3c8a-a8d8-40b9-ba92-324afa7b90ef');
                expect(details[2]).to.eql('Status:\nACTIVE');
                expect(details[3]).to.eql('Disk Space:\n9% (0.17GB of 2GB)');
                expect(details[4]).to.eql('RAM:\n512MB Instance');
                expect(details[5]).to.match(ageWithTimePattern).to.contain('Age:\n');
                expect(details[6]).to.match(timePattern).to.contain('Last Updated:\n');
                expect(details[7]).to.eql('Root Enabled:\nNo');
                expect(details[8]).to.eql('Region:\nSTAGING');
            });
        });

        it('should list instance databases @dev', function () {
            dbaasDetailsPage.databaseTable.row(1).then(function (database) {
                expect(database['Name']).to.equal('so_data');
            });
        });

        describe('Database Instance Detail - Midways', function () {

            before(function () {
                dbaasDetailsPage.go('/' + instanceId);
            });

            describe('Instance Databases Table:', function () {

                it('should be filterable by name @dev', function () {
                    dbaasDetailsPage.databaseTable.data().then(function (databases) {
                        expect(databases.length).to.equal(2);
                    });

                    dbaasDetailsPage.databaseTable.filterBy('storage');

                    dbaasDetailsPage.databaseTable.data().then(function (databases) {
                        expect(databases.length).to.equal(1);
                    });
                });
            });

            describe('- Unsuccessful Instance Actions: ', function () {

                it('should throw restart instance error when modal triggered and confirmed @dev', function () {
                    dbaasDetailsPage.restartInstance();

                    expect(encore.rxNotify.all.exists('Error rebooting instance.')).to.eventually.be.true;
                    basePage.dismissPageStatus();
                });

                it('should throw resize flavor error when modal triggered and confirmed @dev', function () {
                    dbaasDetailsPage.resizeFlavor('1GB');

                    expect(encore.rxNotify.all.exists('Error resizing instance.')).to.eventually.be.true;
                    basePage.dismissPageStatus();
                });

                it('should throw resize volume error when modal triggered and confirmed @dev', function () {
                    dbaasDetailsPage.resizeVolume('10');

                    expect(encore.rxNotify.all.exists('Error resizing volume.')).to.eventually.be.true;
                    basePage.dismissPageStatus();
                });

                it('should throw delete instance error when modal triggered and confirmed @dev', function () {
                    dbaasDetailsPage.deleteInstance();

                    expect(encore.rxNotify.all.exists('Error deleting instance.')).to.eventually.be.true;
                    basePage.dismissPageStatus();
                });

                it('should throw create e error when modal triggered and confirmed @dev', function () {
                    var databaseOptions = {
                        name: 'testingdb',
                        characterSet: 'badset',
                        collation: 'badcollate'
                    };

                    dbaasDetailsPage.databaseTable.createDatabase(databaseOptions);

                    expect(encore.rxNotify.all.exists('Error creating database:')).to.eventually.be.true;
                    basePage.dismissPageStatus();
                });

                it('should throw create user error when modal triggered and confirmed @dev', function () {
                    var userOptions = {
                        name: 'dbuser',
                        password: 'badpassword',
                        host: '',
                        databases: ['so_data']
                    };

                    dbaasDetailsPage.usersTable.createUser(userOptions);

                    expect(encore.rxNotify.all.exists('Error creating user:')).to.eventually.be.true;
                    basePage.dismissPageStatus();
                });

            });

            describe('- Successful Instance Actions: ', function () {

                before(function () {
                    // Go to mocked out actions
                    dbaasDetailsPage.go('/432e170c-7cbd-4144-8da0-6d0a4c705ace');
                    basePage.disableRxNotifyTimeout();
                });

                it('should restart instance when modal triggered and confirmed @dev', function () {
                    dbaasDetailsPage.restartInstance();
                    expect(encore.rxNotify.all.exists('Instance rebooting.')).to.eventually.be.true;
                });

                it('should resize instance when modal triggered and confirmed @dev', function () {
                    dbaasDetailsPage.resizeFlavor('8GB');
                    expect(encore.rxNotify.all.exists('Instance is being resized.')).to.eventually.be.true;
                });

                it('should resize volume when modal triggered and confirmed @dev', function () {
                    dbaasDetailsPage.resizeVolume('15');
                    expect(encore.rxNotify.all.exists('Volume is being resized.')).to.eventually.be.true;
                });

                it('should delete instance when modal triggered and confirmed @dev', function () {
                    dbaasDetailsPage.deleteInstance();

                    expect(encore.rxNotify.all.exists('Instance deleted.')).to.eventually.be.true;
                });

            });

            describe('- Modal/User Instance Actions', function () {
                before(function () {
                    dbaasDetailsPage.go('/432e170c-7cbd-4144-8da0-6d0a4c705ace');
                    basePage.disableRxNotifyTimeout();
                });

                it('should create database when modal triggered and confirmed @dev', function () {
                    // Delete instance test goes back to the overview page. Navigate back.
                    var databaseOptions = {
                        name: 'testingdb',
                        characterSet: '',
                        collation: ''
                    };

                    dbaasDetailsPage.databaseTable.createDatabase(databaseOptions);

                    expect(encore.rxNotify.all.exists('Database created.')).to.eventually.be.true;
                });

                it('should create a user when modal is triggered and confirmed @dev', function () {
                    var userOptions = {
                        name: 'dbuser',
                        password: 'password',
                        host: '',
                        databases: ['so_data']
                    };

                    dbaasDetailsPage.usersTable.createUser(userOptions);

                    expect(encore.rxNotify.all.exists('User created.')).to.eventually.be.true;
                });
            });

            describe('- Correct Error messages: ', function () {

                before(function () {
                    // Go to mocked out actions
                    dbaasDetailsPage.go('/emptydbinstance');
                });

                it('should show an error message when creating a User an no databases exist @dev', function () {
                    var errorMsg = 'No Databases have been created for this Instance.';

                    dbaasDetailsPage.usersTable.lnkCreateUser.click();

                    expect(dbaasDetailsPage.createUserModal.noDatabasesErrorMsg).to.eventually.contain(errorMsg);
                    dbaasDetailsPage.createUserModal.close();
                });
            });

            describe('- Database instance that has null values ', function () {
                before(function () {
                    // go to the instance that has null values
                    dbaasDetailsPage.go('/null_db');
                });

                it('should display N/A when the value is null @dev', function () {
                    // Not testing the UUID because if the UUID is not present the user
                    // will not be able to navigate to the details page as it is a URL param.
                    dbaasDetailsPage.detailsTable.data().then(function (details) {
                        expect(details[0]).to.eql('Hostname:\nN/A');
                        expect(details[2]).to.eql('Status:\nN/A');
                        expect(details[3]).to.eql('Disk Space:\nN/A');
                        expect(details[6]).to.eql('Last Updated:\nN/A');
                        expect(details[7]).to.eql('Root Enabled:\nN/A');
                        expect(details[8]).to.eql('Region:\nN/A');
                    });
                });
            });
        });
    });

    describe('Smoke Tests', function () {

        it('should have proper labels on instance table', function () {
            var expectedLabels = ['Hostname', 'UUID', 'Status', 'Disk Space',
                'RAM', 'Age', 'Last Updated', 'Root Enabled', 'Region'];

            dbaasDetailsPage.detailsTable.data().then(function (instanceDetails) {
                _.each(expectedLabels, function (label, index) {
                    expect(instanceDetails[index]).to.contain(label);
                });
            });
        });

        it('should have proper headers on the Database table', function () {
            var expectedHeaders = ['Name', ''];
            expect(dbaasDetailsPage.databaseTable.headers).to.eventually.eql(expectedHeaders);
        });

        it('should have proper headers on the Users table', function () {
            var expectedHeaders = ['Name', 'Databases', ''];
            expect(dbaasDetailsPage.usersTable.headers).to.eventually.eql(expectedHeaders);
        });

        describe('Create Database modal', function () {

            var instanceName;
            before(function () {
                if (basePage.isInMidwayEnvironment()) {
                    dbaasDetailsPage.go(instanceId);
                } else {
                    // TODO: Replace with fixture instead of hard-coded name
                    dbaasDetailsPage.open({
                        Name: 'auto-dbWithUser'
                    });
                }

                dbaasDetailsPage.title.then(function (title) {
                    instanceName = title.substring('Instance: '.length);
                });

                dbaasDetailsPage.databaseTable.lnkCreateDatabase.click();
            });

            after(function () {
                dbaasDetailsPage.createDatabaseModal.close();
            });

            var databaseModal = {
                display: {
                    'the Database Name label': dbaasDetailsPage.createDatabaseModal.lblDatabaseName,
                    'the Character Set label': dbaasDetailsPage.createDatabaseModal.lblCharacterSet,
                    'the Collation label': dbaasDetailsPage.createDatabaseModal.lblCollation,
                    'the Database Name field': dbaasDetailsPage.createDatabaseModal.txtDatabaseName,
                    'the Character Set field': dbaasDetailsPage.createDatabaseModal.txtCharacterSet,
                    'the Collation field': dbaasDetailsPage.createDatabaseModal.txtCollation
                },
                equal: {
                    'modal title | Create Database': dbaasDetailsPage.createDatabaseModal.modalTitle
                }
            };

            it('should have the the name of the instance as a subtitle', function () {
                var modalSubtitle = dbaasDetailsPage.createDatabaseModal.modalSubtitle.getText();
                expect(modalSubtitle).to.eventually.equal(instanceName);
            });

            commonTests(databaseModal);

        });

        describe('Create User modal', function () {

            before(function () {
                if (basePage.isInMidwayEnvironment()) {
                    dbaasDetailsPage.go(instanceId);
                } else {
                    // TODO: Replace with fixture instead of hard-coded name
                    dbaasDetailsPage.open({
                        Name: 'auto-dbWithUser'
                    });
                }

                dbaasDetailsPage.usersTable.lnkCreateUser.click();
            });

            after(function () {
                dbaasDetailsPage.createUserModal.close();
            });

            var userModal = {
                display: {
                    'the Username label': dbaasDetailsPage.createUserModal.lblUsername,
                    'the Password label': dbaasDetailsPage.createUserModal.lblPassword,
                    'the Host label': dbaasDetailsPage.createUserModal.lblHost,
                    'the Database label': dbaasDetailsPage.createUserModal.lblDatabases,
                    'the Username field': dbaasDetailsPage.createUserModal.txtUsername,
                    'the Password field': dbaasDetailsPage.createUserModal.txtPassword,
                    'the Host field': dbaasDetailsPage.createUserModal.txtHost,
                    'the Database table': dbaasDetailsPage.createUserModal.eleDatabaseTable
                },
                equal: {
                    'modal title | Create User': dbaasDetailsPage.createUserModal.modalTitle,
                }
            };

            commonTests(userModal);
        });
    });
});

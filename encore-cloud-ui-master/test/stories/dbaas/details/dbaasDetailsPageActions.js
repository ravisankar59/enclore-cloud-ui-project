var dbaasDetailsPage = require('../../../pages/dbaas/details');
var dbaasOverviewPage = require('../../../pages/dbaas/overview');
var tf = require('../../../pages/test-fixtures/api');

describe('Database Instance Details Page - Right Aligned Actions', function () {

    var dbs = {
        localhost: 'BetaInstance',
        staging: tf.dbDetails.name,
        preprod: tf.dbDetails.name
    };
    var query = { Name:  dbs[ptor.params.env] || dbs['staging'] };

    before(function () {
        dbaasDetailsPage.open(query);
    });

    describe('Midway Tests', function () {

        describe('Instance Databases Table:', function () {

            it('should be filterable by name @dev', function () {
                dbaasDetailsPage.databaseTable.data().then(function (databases) {
                    expect(databases.length).to.equal(2);
                });

                // Enter filter text
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
            });

            it('should throw resize flavor error when modal triggered and confirmed @dev', function () {
                var flavor = '16GB';
                dbaasDetailsPage.resizeFlavor(flavor);
                expect(encore.rxNotify.all.exists('Error resizing instance.')).to.eventually.be.true;
            });

            it('should throw resize volume error when modal triggered and confirmed @dev', function () {
                var size = '10';
                dbaasDetailsPage.resizeVolume(size);
                expect(encore.rxNotify.all.exists('Error resizing volume.')).to.eventually.be.true;
            });

            it('should throw delete instance error when modal triggered and confirmed @dev', function () {
                dbaasDetailsPage.deleteInstance();
                expect(encore.rxNotify.all.exists('Error deleting instance.')).to.eventually.be.true;
            });

            it('should throw create database error when modal triggered and confirmed @dev', function () {
                var database = {
                    name: 'testingdb',
                    characterSet: 'badset',
                    collate: 'badcollate'
                };
                dbaasDetailsPage.databaseTable.createDatabase(database);
                expect(encore.rxNotify.all.exists('Error creating database:')).to.eventually.be.true;
            });

            it('should throw create user error when modal triggered and confirmed @dev', function () {
                var user = {
                    name: 'dbuser',
                    password: 'badpassword',
                    databases: ['so_data']
                };
                dbaasDetailsPage.usersTable.createUser(user);
                expect(encore.rxNotify.all.exists('Error creating user:')).to.eventually.be.true;
            });

        });

        describe('- Successful Instance Actions: ', function () {

            var successMidwayServerId = '432e170c-7cbd-4144-8da0-6d0a4c705ace';
            before(function () {
                // Go to mocked out actions
                dbaasDetailsPage.go(successMidwayServerId);
                basePage.disableRxNotifyTimeout();
            });

            it('should restart instance when modal triggered and confirmed @dev', function () {
                dbaasDetailsPage.restartInstance();
                expect(encore.rxNotify.all.exists('Instance rebooting.')).to.eventually.be.true;
            });

            it('should resize instance when modal triggered and confirmed @dev', function () {
                var flavor = '8GB';
                dbaasDetailsPage.resizeFlavor(flavor);
                expect(encore.rxNotify.all.exists('Instance is being resized.')).to.eventually.be.true;
            });

            it('should resize volume when modal triggered and confirmed @dev', function () {
                var size = '15';
                dbaasDetailsPage.resizeVolume(size);
                expect(encore.rxNotify.all.exists('Volume is being resized.')).to.eventually.be.true;
            });

            it('should delete instance when modal triggered and confirmed @dev', function () {
                var overviewUrl = ptor.baseUrl + dbaasOverviewPage.url;

                dbaasDetailsPage.deleteInstance();

                expect(dbaasDetailsPage.currentUrl).to.eventually.equal(overviewUrl);
                expect(encore.rxNotify.all.exists('Instance deleted.')).to.eventually.be.true;
            });

            it('should create database when modal triggered and confirmed @dev', function () {
                var database = {
                    name: 'testingdb',
                    characterSet: '',
                    collation: ''
                };

                dbaasDetailsPage.go(successMidwayServerId);
                dbaasDetailsPage.databaseTable.createDatabase(database);

                expect(encore.rxNotify.all.exists('Database created.')).to.eventually.be.true;
            });

            it('should create a user when modal is triggered and confirmed @dev', function () {
                var user = {
                    name: 'dbuser',
                    password: 'password',
                    host: '',
                    databases: ['so_data']
                };

                dbaasDetailsPage.usersTable.createUser(user);

                expect(encore.rxNotify.all.exists('User created.')).to.eventually.be.true;
            });

        });

        describe('- Correct Error messages: ', function () {

            before(function () {
                // Go to mocked out actions
                dbaasDetailsPage.go('/emptydbinstance');
            });

            it('should show an error message when creating a User an no databases exist @dev', function () {
                var expectedError = 'No Databases have been created for this Instance.';
                dbaasDetailsPage.usersTable.lnkCreateUser.click();

                var errorMsg = dbaasDetailsPage.createUserModal.noDatabasesErrorMsg.getText();
                expect(errorMsg).to.eventually.contain(expectedError);
            });
        });

    });

    describe('Regression Tests', function () {

        it('should restart DB Instance #regression', function () {
            dbaasDetailsPage.restartInstance();
            expect(encore.rxNotify.all.exists('Restarting Instance.')).to.eventually.be.true;
        });

        it('should resize flavor of DB Instance #regression', function () {
            dbaasDetailsPage.resizeFlavor();
            expect(encore.rxNotify.all.exists('Resizing Flavor.')).to.eventually.be.true;
        });

        it('should resize volume of DB Instance #regression', function () {
            dbaasDetailsPage.resizeVolume();
            expect(encore.rxNotify.all.exists('Resizing Volume.')).to.eventually.be.true;
        });

        it('should delete DB Instance #regression', function () {
            dbaasDetailsPage.deleteInstance();
            expect(encore.rxNotify.all.exists('Deleted Instance.')).to.eventually.be.true;
        });
    });

});

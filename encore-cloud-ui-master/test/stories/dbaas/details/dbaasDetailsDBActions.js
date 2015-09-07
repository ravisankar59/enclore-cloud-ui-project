var dbaasDetailsPage = require('../../../pages/dbaas/details');
var tf = require('../../../pages/test-fixtures/ui');

describe('Database Instance Details Page - Database Table Actions', function () {

    before(function () {
        if (!basePage.isInMidwayEnvironment()) {
            // Capitalization seems to be important here
            dbaasDetailsPage.open({ Name: tf.dbRestart.name });
        }
    });

    describe('Midway Tests', function () {

        var instanceWithDBs = '432e170c-7cbd-4144-8da0-6d0a4c705ace';

        describe('Instance Databases Table:', function () {

            before(function () {
                dbaasDetailsPage.go('/547b3c8a-a8d8-40b9-ba92-324afa7b90ef');
            });

            it('should list instance databases @dev', function () {
                dbaasDetailsPage.databaseTable.row(1).then(function (database) {
                    expect(database['Name']).to.equal('so_data');
                });
            });

            it('should be filterable by name @dev', function () {
                dbaasDetailsPage.databaseTable.data().then(function (databases) {
                    expect(databases.length).to.equal(2);
                });

                // Enter filter text
                dbaasDetailsPage.databaseTable.filterBy('such');

                dbaasDetailsPage.databaseTable.data().then(function (databases) {
                    expect(databases.length).to.equal(1);
                });
            });
        });

        describe('User creation', function () {
            before(function () {
                // This page has databases which can be deleted
                dbaasDetailsPage.go(instanceWithDBs);
            });

            it('should show a list of database tables @dev', function () {
                dbaasDetailsPage.databaseTable.row(1).then(function (database) {
                    database.actionMenu.action('Create User').openModal();
                });

                expect(dbaasDetailsPage.createUserModal.eleDatabaseTable.isDisplayed()).to.eventually.be.true;
            });

            it('should confirm that database has been prefilled @dev', function () {
                dbaasDetailsPage.databaseTable.row(1).then(function (database) {
                    database.actionMenu.action('Create User').openModal();
                });

                dbaasDetailsPage.createUserModal.databaseTable().then(function (databases) {
                    var testDatabase = _.find(databases, { Database: 'so_data' });
                    expect(testDatabase.isChecked()).to.eventually.equal('true');
                });
            });

            it('should throw error when a bad user is created @dev', function () {
                var user = {
                    name: 'dbuser',
                    password: 'badpassword',
                    host: ''
                };

                dbaasDetailsPage.databaseTable.row(1).then(function (database) {
                    database.actionMenu.action('Create User').openModal();
                });
                dbaasDetailsPage.createUserModal.createUser(user);

                expect(encore.rxNotify.all.exists('Error creating user', 'error')).to.eventually.be.true;
                basePage.dismissPageStatus();
            });

            it('should create a user when modal is triggered and confirmed @dev', function () {
                var user = {
                    name: 'dbuser',
                    password: 'password',
                    host: ''
                };

                dbaasDetailsPage.databaseTable.row(1).then(function (database) {
                    database.actionMenu.action('Create User').openModal();
                });
                dbaasDetailsPage.createUserModal.createUser(user);

                expect(encore.rxNotify.all.exists('User created', 'success')).to.eventually.be.true;
                basePage.dismissPageStatus();
            });

        });

        describe('Database deletion', function () {
            before(function () {
                // This page has databases which can be deleted
                dbaasDetailsPage.go(instanceWithDBs);
            });

            it('should delete so_data @dev', function () {
                // opens delete modal for db 'so_data'
                dbaasDetailsPage.databaseTable.row(1).then(function (database) {
                    database.actionMenu.action('Delete Database').openModal();
                });
                dbaasDetailsPage.deleteInstanceModal.submit();

                expect(encore.rxNotify.all.exists('Database deleted', 'success')).to.eventually.be.true;
                basePage.dismissPageStatus();
            });

            it('should fail to delete such_storage @dev', function () {
                var error = 'Error deleting database: Not Found';

                // Opens delete modal for db 'such_storage'
                dbaasDetailsPage.databaseTable.row(2).then(function (database) {
                    database.actionMenu.action('Delete Database').openModal();
                });
                dbaasDetailsPage.deleteInstanceModal.submit();

                expect(encore.rxNotify.all.exists(error, 'error')).to.eventually.be.true;
                basePage.dismissPageStatus();
            });

            it('should show database name in delete modal @dev', function () {
                var expectedText = 'Are you sure you want to delete this database?';

                // Opens delete modal for db 'such_storage'
                dbaasDetailsPage.databaseTable.row(1).then(function (database) {
                    database.actionMenu.action('Delete Database').openModal();
                });
                var warningMsg = dbaasDetailsPage.deleteInstanceModal.notificationText.getText();
                expect(warningMsg).to.eventually.contain(expectedText);

                var modalSubtitle = dbaasDetailsPage.deleteInstanceModal.modalSubtitle.getText();
                expect(modalSubtitle).to.eventually.contain('so_data');
            });
        });

        describe('Empty Users table', function () {
            before(function () {
                dbaasDetailsPage.go('emptydbinstance');
            });

            it('should show an error message when no databases @dev', function () {
                var errorRowMessage = dbaasDetailsPage.databaseTable.getErrorRow();
                expect(errorRowMessage).to.eventually.equal('No Databases have been created for this Instance.');
            });
        });

        describe('Database edit users', function () {
            before(function () {
                // This page has users to manage access
                dbaasDetailsPage.go(instanceWithDBs);
            });

            it('should represent the selected database @dev', function () {
                dbaasDetailsPage.databaseTable.row(2).then(function (database) {
                    database.actionMenu.action('Edit Users').openModal();
                });

                expect(dbaasDetailsPage.editUsersModal.modalSubtitle.getText()).to.eventually.contain('such_storage');
                dbaasDetailsPage.editUsersModal.close();
            });

            it('should allow to revoke all users from a database @dev', function () {
                dbaasDetailsPage.databaseTable.row(1).then(function (database) {
                    database.actionMenu.action('Edit Users').openModal();
                });
                dbaasDetailsPage.editUsersModal.userTable().then(function (users) {
                    _.forEach(users, function (user) {
                        user.check();
                    });
                });
                dbaasDetailsPage.editUsersModal.submit();

                expect(encore.rxNotify.all.exists('User access updated', 'success')).to.eventually.be.true;
                basePage.dismissPageStatus();

            });

            it('should grant testuser access to such_storage @dev', function () {
                dbaasDetailsPage.databaseTable.row(2).then(function (database) {
                    database.actionMenu.action('Edit Users').openModal();
                });
                dbaasDetailsPage.editUsersModal.userTable().then(function (users) {
                    var testuser = _.find(users, { User: 'testuser' });
                    testuser.check();
                });
                dbaasDetailsPage.editUsersModal.submit();

                expect(encore.rxNotify.all.exists('User access updated', 'success')).to.eventually.be.true;
                basePage.dismissPageStatus();
            });

            it('should revoke testuser access to so_data @dev', function () {
                dbaasDetailsPage.databaseTable.row(1).then(function (database) {
                    database.actionMenu.action('Edit Users').openModal();
                });
                dbaasDetailsPage.editUsersModal.userTable().then(function (users) {
                    var testuser = _.find(users, { User: 'testuser' });
                    testuser.check();
                });
                dbaasDetailsPage.editUsersModal.submit();

                expect(encore.rxNotify.all.exists('User access updated', 'success')).to.eventually.be.true;
                basePage.dismissPageStatus();
            });

            it('should have checked database users match the listed databases for the users @dev', function () {
                var userDatabases;

                dbaasDetailsPage.usersTable.row(1).then(function (user) {
                    userDatabases = user.Databases.split(', ');
                });
                dbaasDetailsPage.databaseTable.data().then(function (databases) {
                    _.forEach(databases, function (database) {
                        database.actionMenu.action('Edit Users').openModal();

                        dbaasDetailsPage.editUsersModal.userTable().then(function (users) {
                            var testuser = _.find(users, { User: 'testuser' });
                            if (_.contains(userDatabases, database.Name)) {
                                expect(testuser.isChecked()).to.eventually.equal('true');
                            } else {
                                expect(testuser.isChecked()).to.eventually.equal(null);
                            }
                        });
                        dbaasDetailsPage.editUsersModal.close();
                    });
                });
            });
        });
    });

    describe('Regression Tests', function () {

        it('should create DB Instances #regression', function () {
            var database = {
                name: 'auto-dbname',
                characterSet: '',
                collation: ''
            };

            dbaasDetailsPage.databaseTable.createDatabase(database);

            expect(encore.rxNotify.all.exists('Database created.', 'success')).to.eventually.be.true;
        });

        it('should filter DB Instances in Databases table #regression', function () {
            dbaasDetailsPage.databaseTable.data().then(function (databases) {
                expect(databases.length).to.equal(2);
            });

            // Enter filter text
            dbaasDetailsPage.databaseTable.filterBy('auto-dbname');

            dbaasDetailsPage.databaseTable.data().then(function (databases) {
                expect(databases.length).to.equal(1);
            });
        });

        it('should create DB users #regression', function () {
            var user = {
                name: 'auto-user',
                password: 'password',
                host: ''
            };

            dbaasDetailsPage.databaseTable.row(1).then(function (database) {
                database.actionMenu.action('Create User').openModal();
            });
            dbaasDetailsPage.createUserModal.createUser(user);

            expect(encore.rxNotify.all.exists('User created', 'success')).to.eventually.be.true;
        });

        it('should edit DB users #regression', function () {
            dbaasDetailsPage.databaseTable.row(1).then(function (database) {
                database.actionMenu.action('Edit Users').openModal();
            });
            dbaasDetailsPage.editUsersModal.userTable().then(function (users) {
                _.forEach(users, function (user) {
                    user.check();
                });
            });
            dbaasDetailsPage.editUsersModal.submit();

            expect(encore.rxNotify.all.exists('User access updated', 'success')).to.eventually.be.true;
        });

        it('should delete DB Instances #regression', function () {
            dbaasDetailsPage.databaseTable.row(1).then(function (database) {
                database.actionMenu.action('Delete Database').openModal();
            });
            dbaasDetailsPage.deleteInstanceModal.submit();

            expect(encore.rxNotify.all.exists('Database deleted', 'success')).to.eventually.be.true;
        });
    });
});

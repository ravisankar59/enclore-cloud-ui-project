var dbaasDetailsPage = require('../../../pages/dbaas/details');
var tf = require('../../../pages/test-fixtures/api');

describe('Database Instance Details Page - Users Table Actions', function () {
    // #TODO expect database table to contain filtered results
    var db = tf.dbDetails;
    var successDBID = '432e170c-7cbd-4144-8da0-6d0a4c705ace';
    var multiDBID = '547b3c8a-a8d8-40b9-ba92-324afa7b90ef';

    before(function () {
        var dbs = {
            localhost: 'BetaInstance',
            staging: db.name,
            preprod: db.name
        };
        var query = { Name:  dbs[ptor.params.env] || dbs['staging'] };
        dbaasDetailsPage.open(query);
    });

    describe('Midway Tests', function () {

        describe('Instance Users Table:', function () {
            before(function () {
                // This page has users with multiple databases
                dbaasDetailsPage.go(multiDBID);
            });

            it('should list instance users @dev', function () {
                dbaasDetailsPage.usersTable.row(1).then(function (user) {
                    expect(user['Name']).to.equal('testuser');
                    expect(user['Databases']).to.equal('test_database, test_database2');
                });
            });

            it('should be filterable by name @dev', function () {
                dbaasDetailsPage.usersTable.data().then(function (users) {
                    expect(users.length).to.equal(2);
                });

                // Enter filter text
                dbaasDetailsPage.usersTable.filterBy('foo');

                dbaasDetailsPage.usersTable.data().then(function (users) {
                    expect(users.length).to.equal(1);
                });
            });
        });

        describe('User deletion', function () {
            before(function () {
                // This page has users who can be deleted
                dbaasDetailsPage.go(successDBID);
            });

            it('should delete testuser @dev', function () {
                dbaasDetailsPage.usersTable.openDeleteUser('testuser');
                dbaasDetailsPage.deleteUserModal.submit();

                expect(encore.rxNotify.all.exists('User deleted')).to.eventually.be.true;
                basePage.dismissPageStatus();
            });
            
            it('should fail to delete foouser @dev', function () {
                dbaasDetailsPage.usersTable.openDeleteUser('foouser');
                dbaasDetailsPage.deleteUserModal.submit();
                
                expect(encore.rxNotify.all.exists('Error deleting user:')).to.eventually.be.true;
                basePage.dismissPageStatus();
            });

            it('should show username in delete modal @dev', function () {
                var expectedText = 'Are you sure you want to delete this user?';

                dbaasDetailsPage.usersTable.openDeleteUser('foouser');
                
                expect(dbaasDetailsPage.deleteUserModal.notificationText.getText()).to.eventually.contain(expectedText);
                expect(dbaasDetailsPage.deleteUserModal.modalSubtitle.getText()).to.eventually.contain('foouser');
            });
        });

        describe('User edit', function () {
            before(function () {
                // This page has users who can be edited
                dbaasDetailsPage.go(successDBID);
            });

            it('should edit testuser @dev', function () {
                var user = {
                    name: 'le_test_name'
                };

                dbaasDetailsPage.usersTable.openEditUser('testuser');
                dbaasDetailsPage.editDbUserModal.editUser(user);

                expect(encore.rxNotify.all.exists('User updated')).to.eventually.be.true;
                basePage.dismissPageStatus();
            });

            it('should fail to edit foouser @dev', function () {
                var user = {
                    name: 'le_test_name'
                };

                dbaasDetailsPage.usersTable.openEditUser('foouser');
                dbaasDetailsPage.editDbUserModal.editUser(user);

                expect(encore.rxNotify.all.exists('Error updating user:')).to.eventually.be.true;
                basePage.dismissPageStatus();
            });
        });

        describe('Manage user access @dev', function () {
            before(function () {
                // This page has users to manage access
                dbaasDetailsPage.go(successDBID);
            });

            it('should manage access for testuser @dev', function () {
                var databases = ['so_data'];

                dbaasDetailsPage.usersTable.openManageUser('testuser');
                dbaasDetailsPage.manageUserModal.manageAccess(databases);
                
                expect(encore.rxNotify.all.exists('User access updated')).to.eventually.be.true;
                basePage.dismissPageStatus();
            });

            it('should fail to manage access for foouser @dev', function () {
                var databases = ['so_data'];
                
                dbaasDetailsPage.usersTable.openManageUser('foouser');
                dbaasDetailsPage.manageUserModal.manageAccess(databases);
                
                expect(encore.rxNotify.all.exists('Error updating user access')).to.eventually.be.true;
                basePage.dismissPageStatus();
            });
        });

        describe('Empty Users table', function () {
            before(function () {
                dbaasDetailsPage.go('/emptydbinstance');
            });

            it('should show an error message when no users @dev', function () {
                var error = 'No Users have been created for this Instance.';
                expect(dbaasDetailsPage.usersTable.getErrorRow()).to.eventually.equal(error);
            });
        });
    });

    describe('Regression Tests', function () {
        
        it('should filter DB users #regression', function () {
            var username = db.users[0].name;

            dbaasDetailsPage.usersTable.filterBy(username);
            dbaasDetailsPage.usersTable.row(1).then(function (row) {
                expect(row.Name).to.equal(username);
            });
        });

        it('should create DB users #regression', function () {
            var user = {
                name: 'user_create',
                password: 'password',
                host: '',
                databases: ['db1']
            };
            
            dbaasDetailsPage.usersTable.createUser(user);
            
            expect(encore.rxNotify.all.exists('User created.')).to.eventually.be.true;
        });

        it.skip('should create users without a DB #regression', function () {
            // not available in the UI
            var user = {
                name: 'user_nodb',
                password: 'password',
                host: '',
                databases: []
            };
            
            dbaasDetailsPage.usersTable.createUser(user);
            
            expect(encore.rxNotify.all.exists('Created User.')).to.eventually.be.true;
        });

        it('should edit DB users #regression', function () {
            var user = {
                name: 'user1',
                databases: []
            };

            dbaasDetailsPage.usersTable.openEditUser(user.name);
            user.password = 'newPassword';
            dbaasDetailsPage.editDbUserModal.editUser(user);

            expect(encore.rxNotify.all.exists('User updated.')).to.eventually.be.true;
        });

        it('should manage DB users access #regression', function () {
            // #TODO: does not remove all databases
            var username = 'user2';
            var databases = [];
            
            dbaasDetailsPage.usersTable.openManageUser(username);
            dbaasDetailsPage.manageUserModal.manageAccess(databases);

            expect(encore.rxNotify.all.exists('User access updated.')).to.eventually.be.true;
        });

        it('should delete DB users #regression', function () {
            var username = 'delete_user';

            dbaasDetailsPage.usersTable.openDeleteUser(username);
            dbaasDetailsPage.deleteUserModal.submit();
            
            expect(encore.rxNotify.all.exists('User deleted.')).to.eventually.be.true;
        });
    });
});

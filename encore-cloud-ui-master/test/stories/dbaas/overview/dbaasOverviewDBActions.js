var dbaasOverviewPage = require('../../../pages/dbaas/overview');
var tf = require('../../../pages/test-fixtures/api');

describe('Database Instances Page - Instance Actions', function () {
    // #TODO Complete mocked tests
    before(function () {
        dbaasOverviewPage.go();
        basePage.disableRxNotifyTimeout();
    });

    describe('Midway Tests', function () {

        it('should show correct instance details @dev', function () {
            dbaasOverviewPage.table.filterBy('AlphaInstance');
            dbaasOverviewPage.table.row(1).then(function (database) {
                expect(database['Name']).to.equal('AlphaInstance');
                expect(database['Instance ID']).to.equal('432e170c-7cbd-4144-8da0-6d0a4c705ace');
                expect(database['Volume Size']).to.equal('15 GB');
                expect(database['RAM']).to.equal('512MB Instance');
                expect(database['Status']).to.equal('ACTIVE');
                expect(database['Region']).to.equal('STAGING');
            });
        });

        describe('Midway - Unsuccessful Instance Actions: ', function () {

            var query = { Name: 'BetaInstance' };

            beforeEach(function () {
                dbaasOverviewPage.go();
                basePage.disableRxNotifyTimeout();
            });

            it('should throw a restart instance error when restart instance modal confirmed @dev', function () {
                dbaasOverviewPage.table.openRestartInstance(query);
                dbaasOverviewPage.restartInstanceModal.submit();

                expect(encore.rxNotify.all.exists('Error rebooting instance.')).to.eventually.be.true;
            });

            it('should throw a resize flavor error when modal triggered and confirmed @dev', function () {
                dbaasOverviewPage.table.openResizeFlavor(query);
                dbaasOverviewPage.resizeFlavorModal.resizeFlavor('1GB');

                expect(encore.rxNotify.all.exists('Error resizing instance.')).to.eventually.be.true;
            });

            it('should throw a resize volume error when modal triggered and confirmed @dev', function () {
                dbaasOverviewPage.table.openResizeVolume(query);
                dbaasOverviewPage.resizeVolumeModal.resizeVolume('10');

                expect(encore.rxNotify.all.exists('Error resizing volume.')).to.eventually.be.true;
            });

            it('should throw a delete instance error when modal triggered and confirmed @dev', function () {
                dbaasOverviewPage.table.openDeleteInstance(query);
                dbaasOverviewPage.deleteInstanceModal.submit();

                expect(encore.rxNotify.all.exists('Error deleting instance.')).to.eventually.be.true;
            });

            it('should throw a create database error when modal triggered and confirmed @dev', function () {
                var database = {
                    name: 'testingdb',
                    characterSet: 'badset',
                    collation: 'badcollate'
                };

                dbaasOverviewPage.table.openCreateDatabase(query);
                dbaasOverviewPage.createDatabaseModal.createDatabase(database);

                expect(encore.rxNotify.all.exists('Error creating database:')).to.eventually.be.true;
            });

            it('should throw a create user error when modal triggered and confirmed @dev', function () {
                var user = {
                    name: 'dbuser',
                    password: 'badpassword',
                    host: '',
                    databases: ['so_data']
                };

                dbaasOverviewPage.table.openCreateUser(query);
                dbaasOverviewPage.createUserModal.createUser(user);

                expect(encore.rxNotify.all.exists('Error creating user:')).to.eventually.be.true;
            });
        });

        describe('Midway - Successful Instance Actions: ', function () {

            var query = { Name: 'AlphaInstance' };

            beforeEach(function () {
                dbaasOverviewPage.go();
                basePage.disableRxNotifyTimeout();
            });

            it('should restart instance when modal triggered and confirmed @dev', function () {
                dbaasOverviewPage.table.openRestartInstance(query);
                dbaasOverviewPage.restartInstanceModal.submit();

                expect(encore.rxNotify.all.exists('Instance rebooting.')).to.eventually.be.true;
            });

            it('should resize instance when modal triggered and confirmed @dev', function () {
                dbaasOverviewPage.table.openResizeFlavor(query);
                dbaasOverviewPage.resizeFlavorModal.resizeFlavor('8GB');

                expect(encore.rxNotify.all.exists('Instance is being resized.')).to.eventually.be.true;
            });

            it('should resize volume when modal triggered and confirmed @dev', function () {
                dbaasOverviewPage.table.openResizeVolume(query);
                dbaasOverviewPage.resizeVolumeModal.resizeVolume('15');

                expect(encore.rxNotify.all.exists('Volume is being resized.')).to.eventually.be.true;
            });

            it('should delete instance when modal triggered and confirmed @dev', function () {
                dbaasOverviewPage.table.openDeleteInstance(query);
                dbaasOverviewPage.deleteInstanceModal.submit();

                expect(encore.rxNotify.all.exists('Instance deleted.')).to.eventually.be.true;
            });

            it('should create database when modal triggered and confirmed @dev', function () {
                var database = {
                    name: 'testingdb',
                    characterSet: '',
                    collation: ''
                };

                dbaasOverviewPage.table.openCreateDatabase(query);
                dbaasOverviewPage.createDatabaseModal.createDatabase(database);

                expect(encore.rxNotify.all.exists('Database created.')).to.eventually.be.true;
            });

            it('should create user when modal triggered and confirmed @dev', function () {
                var user = {
                    name: 'dbuser',
                    password: 'password',
                    host: '',
                    databases: ['so_data']
                };

                dbaasOverviewPage.table.openCreateUser(query);
                dbaasOverviewPage.createUserModal.createUser(user);

                expect(encore.rxNotify.all.exists('User created.')).to.eventually.be.true;
            });
        });
    });

    describe('Regression Tests', function () {

        it('should restart instance when modal triggered and confirmed #regression', function () {
            var query = { Name: tf.dbRestart.name };

            dbaasOverviewPage.table.openRestartInstance(query);
            dbaasOverviewPage.restartInstanceModal.submit();

            expect(encore.rxNotify.all.exists('Instance rebooting.')).to.eventually.be.true;
        });

        it('should resize flavor when modal triggered and confirmed #regression', function () {
            var query = { Name: tf.dbChangeFlavor.name };

            dbaasOverviewPage.table.openResizeFlavor(query);
            dbaasOverviewPage.resizeFlavorModal.resizeFlavor('1GB');

            expect(encore.rxNotify.all.exists('Instance is being resized.')).to.eventually.be.true;
        });

        it('should resize volume when modal triggered and confirmed #regression', function () {
            var query = { Name: tf.dbResize.name };

            dbaasOverviewPage.table.openResizeVolume(query);
            dbaasOverviewPage.resizeVolumeModal.resizeVolume('2');

            expect(encore.rxNotify.all.exists('Volume is being resized.')).to.eventually.be.true;
        });

        it('should delete instance when modal triggered and confirmed #regression', function () {
            var query = { Name: tf.dbDelete.name };

            dbaasOverviewPage.table.openDeleteInstance(query);
            dbaasOverviewPage.deleteInstanceModal.submit();

            expect(encore.rxNotify.all.exists('Instance deleted.')).to.eventually.be.true;
        });

        it('should create database when modal triggered and confirmed #regression', function () {
            var query = { Name: tf.dbCreate.name };
            var database = {
                name: 'dbCreate',
                characterSet: '',
                collation: ''
            };

            dbaasOverviewPage.table.openCreateDatabase(query);
            dbaasOverviewPage.createDatabaseModal.createDatabase(database);

            expect(encore.rxNotify.all.exists('Database created.')).to.eventually.be.true;
        });

        it('should create user when modal triggered and confirmed #regression', function () {
            var query = { Name: tf.dbWithUser.name };
            var user = {
                name: 'dbuser',
                password: 'password',
                host: '',
                databases: ['db_name']
            };

            dbaasOverviewPage.table.openCreateUser(query);
            dbaasOverviewPage.createUserModal.createUser(user);

            expect(encore.rxNotify.all.exists('User created.')).to.eventually.be.true;
        });
    });
});

var tf = require('../../../pages/test-fixtures/api');
var firstGenDetails = require('../../../pages/servers/details').firstGen;
var api = require('../../../api-helper/api').servers.firstgen;

describe('Cloud Servers FirstGen Details Page - Backup Actions', function () {

    var user, server;
    before(function () {
        user = ptor.params.user;
        server = { name: tf.firstGenChangePassword.name };
        var filter = server.name;
        if (basePage.isInMidwayEnvironment()) {
            var midwayServerId = '110148309';
            return firstGenDetails.go(midwayServerId);
        }

        firstGenDetails.open(server, filter);
    });

    afterEach(function () {
        basePage.driver.navigate().refresh();
    });

    describe('Midway Tests', function () {
        it('should allow you to update backup schedule @dev', function () {
            var backupSchedule = {
                daily: {
                    start: '0400',
                    end: '0600'
                },
                weekly: 'thursday'
            };

            firstGenDetails.backupTable.enableBackup(backupSchedule);

            expect(encore.rxNotify.all.exists('Updated backup schedule.')).to.eventually.be.true;
        });

        it('should throw error if update backup schedule failed @dev', function () {
            var error = 'Error updating backup schedule:';
            var backupSchedule = {
                daily: 'disabled',
                weekly: 'wednesday'
            };

            firstGenDetails.backupTable.enableBackup(backupSchedule);

            expect(encore.rxNotify.all.exists(error)).to.eventually.be.true;
        });

        it('should allow you to delete backup schedule @dev', function () {
            firstGenDetails.backupTable.disableBackup();
            expect(encore.rxNotify.all.exists('Disabled backup schedule.')).to.eventually.be.true;
        });
    });

    describe('Regression Tests', function () {

        it('should enable only a daily backup schedule of a FirstGen server #regression', function () {
            var backupSchedule = {
                daily: {
                    start: '1400',
                    end: '1600'
                },
                weekly: 'disabled'
            };
            var expectedBackup = {
                Enabled: 'true',
                Daily: 'H_1400_1600',
                Weekly: 'DISABLED'
            };

            firstGenDetails.backupTable.enableBackup(backupSchedule);

            expect(encore.rxNotify.all.exists('Updated backup schedule.')).to.eventually.be.true;
            firstGenDetails.backupTable.backups.then(function (backup) {
                expect(backup).to.contain(expectedBackup);
            });

            api.disableBackup(server.name);
        });

        it('should enable only a weekly backup schedule of a FirstGen server #regression', function () {
            var backupSchedule = {
                daily: 'disabled',
                weekly: 'wednesday'
            };
            var expectedBackup = {
                Enabled: 'true',
                Daily: 'DISABLED',
                Weekly: 'WEDNESDAY'
            };

            firstGenDetails.backupTable.enableBackup(backupSchedule);

            expect(encore.rxNotify.all.exists('Updated backup schedule.')).to.eventually.be.true;
            firstGenDetails.backupTable.backups.then(function (backup) {
                expect(backup).to.contain(expectedBackup);
            });

            api.disableBackup(server.name);
        });

        it('should enable both a daily and weekly backup schedule of a FirstGen server #regression', function () {
            var backupSchedule = {
                daily: {
                    start: '1200',
                    end: '1400'
                },
                weekly: 'thursday'
            };
            var expectedBackup = {
                Enabled: 'true',
                Daily: 'H_1200_1400',
                Weekly: 'THURSDAY'
            };

            firstGenDetails.backupTable.enableBackup(backupSchedule);

            expect(encore.rxNotify.all.exists('Updated backup schedule.')).to.eventually.be.true;
            firstGenDetails.backupTable.backups.then(function (backup) {
                expect(backup).to.contain(expectedBackup);
            });

            api.disableBackup(server.name);
        });

        it('should update a backup schedule of a FirstGen server #regression', function () {
            var opts = {
                body: {
                    daily: 'H_1000_1200',
                    weekly: 'FRIDAY'
                }
            };
            var backupSchedule = {
                daily: {
                    start: '1000',
                    end: '1200'
                },
                weekly: 'monday'
            };
            var expectedBackup = {
                Enabled: 'true',
                Daily: 'H_1000_1200',
                Weekly: 'MONDAY'
            };

            api.enableBackup(server.name, opts);
            basePage.driver.navigate().refresh();

            firstGenDetails.backupTable.enableBackup(backupSchedule);

            expect(encore.rxNotify.all.exists('Updated backup schedule.')).to.eventually.be.true;
            firstGenDetails.backupTable.backups.then(function (backup) {
                expect(backup).to.contain(expectedBackup);
            });

            api.disableBackup(server.name);
        });

        it('should disable a backup schedule of a FirstGen server #regression', function () {
            var opts = {
                body: {
                    daily: 'DISABLED',
                    weekly: 'SUNDAY',
                    enabled: true
                }
            };
            var expectedBackup = {
                Enabled: 'false',
                Daily: 'DISABLED',
                Weekly: 'DISABLED'
            };

            api.enableBackup(server.name, opts);
            basePage.driver.navigate().refresh();

            firstGenDetails.backupTable.disableBackup();

            expect(encore.rxNotify.all.exists('Disabled backup schedule.')).to.eventually.be.true;
            firstGenDetails.backupTable.backups.then(function (backup) {
                expect(backup).to.contain(expectedBackup);
            });
        });
    });
});

var serversOverviewPage = require('../../../pages/servers/overview');

describe('Cloud Overview Page - NextGen Server Actions', function () {

    var nextgen = 'Kevin\'s Test Demo';
    var deleteServer = 'Deleting Server';

    before(function () {
        serversOverviewPage.go();
        serversOverviewPage.table.filterBy(nextgen);
        basePage.disableRxNotifyTimeout();
    });

    describe('Midway Tests', function () {

        it('should create next gen image of next gen server @dev', function () {
            serversOverviewPage.table.row(1).then(function (server) {
                server.actionMenu.action('Create Image').openModal();
                serversOverviewPage.createImageModal.createImage('test');
                expect(encore.rxNotify.all.exists('Image created successfully', 'success')).to.eventually.be.true;
            });
        });

        it('should fail to create next gen image of next gen server @dev', function () {
            serversOverviewPage.table.filterBy(nextgen);

            serversOverviewPage.table.row(1).then(function (server) {
                server.actionMenu.action('Create Image').openModal();
                serversOverviewPage.createImageModal.createImage('fail');
                expect(encore.rxNotify.all.exists('Error creating image', 'error')).to.eventually.be.true;
            });
        });

        it('should fail to attach volume to next gen server @dev', function () {
            var volumeName = 'new volume';
            var devicePath = '';

            serversOverviewPage.table.row(1).then(function (server) {
                server.actionMenu.action('Attach Volume').openModal();
                serversOverviewPage.attachVolumeModal.attachVolume(volumeName, devicePath);
                expect(encore.rxNotify.all.exists('Error attaching volume', 'error')).to.eventually.be.true;
            });
        });

        it('should attach volume to next gen server @dev', function () {
            var volumeName = 'new volume';
            var devicePath = '/dev/xvdb';

            serversOverviewPage.table.row(1).then(function (server) {
                server.actionMenu.action('Attach Volume').openModal();
                serversOverviewPage.attachVolumeModal.attachVolume(volumeName, devicePath);
                expect(encore.rxNotify.all.exists('Volume Attached.', 'success')).to.eventually.be.true;
            });
        });

        it('should soft reboot next gen server @dev', function () {
            serversOverviewPage.table.filterBy(nextgen);

            serversOverviewPage.table.row(1).then(function (server) {
                server.actionMenu.action('Reboot Server').openModal();
                serversOverviewPage.rebootServerModal.rebootServer('soft');
                expect(encore.rxNotify.all.exists('Server rebooting.', 'success')).to.eventually.be.true;
            });
        });

        it('should hard reboot next gen server @dev', function () {
            serversOverviewPage.table.filterBy(nextgen);

            serversOverviewPage.table.row(1).then(function (server) {
                server.actionMenu.action('Reboot Server').openModal();
                serversOverviewPage.rebootServerModal.rebootServer('hard');
                expect(encore.rxNotify.all.exists('Server rebooting.', 'success')).to.eventually.be.true;
            });
        });

        it('should delete next gen server @dev', function () {
            serversOverviewPage.table.filterBy(nextgen);

            serversOverviewPage.table.row(1).then(function (server) {
                server.actionMenu.action('Delete Server').openModal();
                serversOverviewPage.deleteServerModal.submit();
                expect(encore.rxNotify.all.exists('Deleted server', 'success')).to.eventually.be.true;
            });
        });

        it('should fail to delete next gen server @dev', function () {
            serversOverviewPage.table.filterBy('DFWTestServer');

            serversOverviewPage.table.row(1).then(function (server) {
                server.actionMenu.action('Delete Server').openModal();
                serversOverviewPage.deleteServerModal.submit();
                expect(encore.rxNotify.all.exists('Error deleting server', 'error')).to.eventually.be.true;
            });
        });

        it('should disable "Create Image" on deleting server @dev', function () {
            serversOverviewPage.table.filterBy(deleteServer);
            serversOverviewPage.table.row(1).then(function (server) {
                server.actionMenu.action('Create Image').openModal();
                expect(serversOverviewPage.createImageModal.modalTitle.isPresent()).to.eventually.be.false;
            });
        });

        it('should disable "Attach Volume" on deleting server @dev', function () {
            serversOverviewPage.table.filterBy(deleteServer);
            serversOverviewPage.table.row(1).then(function (server) {
                server.actionMenu.action('Attach Volume').openModal();
                expect(serversOverviewPage.attachVolumeModal.modalTitle.isPresent()).to.eventually.be.false;
            });
        });

        it('should disable "Reboot Server" on deleting server @dev', function () {
            serversOverviewPage.table.filterBy(deleteServer);
            serversOverviewPage.table.row(1).then(function (server) {
                server.actionMenu.action('Reboot Server').openModal();
                expect(serversOverviewPage.rebootServerModal.modalTitle.isPresent()).to.eventually.be.false;
            });
        });

        it('should disable "Delete Server" on deleting server @dev', function () {
            serversOverviewPage.table.filterBy(deleteServer);
            serversOverviewPage.table.row(1).then(function (server) {
                server.actionMenu.action('Delete Server').openModal();
                expect(serversOverviewPage.deleteServerModal.modalTitle.isPresent()).to.eventually.be.false;
            });
        });
    });
});

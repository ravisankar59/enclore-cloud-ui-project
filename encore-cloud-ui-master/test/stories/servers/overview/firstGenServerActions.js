var serversOverviewPage = require('../../../pages/servers/overview');
var rxSelectFilter = encore.rxSelectFilter;

describe('Cloud Overview Page - FirstGen Server Actions', function () {

    var firstgen = 'kacieissoawesome';
    var selectFilter = rxSelectFilter.main;

    before(function () {
        serversOverviewPage.go();
        selectFilter.multiSelectByLabel('Filter By Gen').openMenu();
        basePage.toggleRxSelectElement('all', true);

        serversOverviewPage.table.filterBy(firstgen);
        basePage.disableRxNotifyTimeout();
    });

    describe('Midway Tests', function () {

        it('should create next gen image of first gen server @dev', function () {
            serversOverviewPage.table.row(1).then(function (server) {
                server.actionMenu.action('Create NextGen Image').openModal();
                serversOverviewPage.createImageModal.createImage('TestFirstGenNextGenImageHOLLA');

                expect(encore.rxNotify.all.exists('Creating Next Gen Image', 'success')).to.eventually.be.true;
            });
        });

        it('should fail to create next gen image of first gen server @dev', function () {
            serversOverviewPage.table.row(1).then(function (server) {
                server.actionMenu.action('Create NextGen Image').openModal();
                serversOverviewPage.createImageModal.createImage('fail');
                expect(encore.rxNotify.all.exists('Error creating image', 'error')).to.eventually.be.true;
            });
        });

        it('should soft reboot first gen server @dev', function () {
            serversOverviewPage.table.row(1).then(function (server) {
                server.actionMenu.action('Reboot Server').openModal();
                serversOverviewPage.rebootServerModal.rebootServer('soft');
                expect(encore.rxNotify.all.exists('Server rebooting.', 'success')).to.eventually.be.true;
            });
        });

        it('should hard reboot first gen server @dev', function () {
            serversOverviewPage.table.filterBy(firstgen);

            serversOverviewPage.table.row(1).then(function (server) {
                server.actionMenu.action('Reboot Server').openModal();
                serversOverviewPage.rebootServerModal.rebootServer('hard');
                expect(encore.rxNotify.all.exists('Server rebooting.', 'success')).to.eventually.be.true;
            });
        });

        it('should fail to delete first gen server @dev', function () {
            serversOverviewPage.table.filterBy('slice110148310');

            serversOverviewPage.table.row(1).then(function (server) {
                server.actionMenu.action('Delete Server').openModal();
                serversOverviewPage.deleteServerModal.submit();
                expect(encore.rxNotify.all.exists('Error deleting server', 'error')).to.eventually.be.true;
            });
        });

        it('should delete first gen server @dev', function () {
            serversOverviewPage.table.filterBy(firstgen);

            serversOverviewPage.table.row(1).then(function (server) {
                server.actionMenu.action('Delete Server').openModal();
                serversOverviewPage.deleteServerModal.submit();
                expect(encore.rxNotify.all.exists('Deleted server', 'success')).to.eventually.be.true;
            });
        });
    });
});

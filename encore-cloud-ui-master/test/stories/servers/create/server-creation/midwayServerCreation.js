var serversCreatePage = require('../../../../pages/servers/create');
var serversOverviewPage = require('../../../../pages/servers/overview');
var tf = require('../../../../pages/test-fixtures/ui');

describe('Servers Create Page - FirstGen Creation - Midway', function () {

    beforeEach(function () {
        serversCreatePage.go();
    });

    it('should allow you to create a server @dev', function () {
        serversCreatePage.createServer(tf.successMidwayFgServer);
        expect(encore.rxNotify.all.exists('password')).to.eventually.be.true;
    });

    it('should show error if server creation failed @dev', function () {
        serversCreatePage.createServer(tf.failMidwayFgServer);
        expect(encore.rxNotify.all.exists('Error')).to.eventually.be.true;
    });

    it('should allow you to cancel server creation @dev', function () {
        expect(serversCreatePage.btnCancel.isDisplayed()).to.eventually.be.true;

        serversCreatePage.btnCancel.click();
        expect(serversCreatePage.currentUrl).to.eventually.equal(ptor.baseUrl + serversOverviewPage.url);
    });

});

describe('Servers Create Page - NextGen Creation - Midway', function () {

    beforeEach(function  () {
        serversCreatePage.go();
    });

    it('should allow you to create a server @dev', function () {
        serversCreatePage.createServer(tf.successMidwayNgServer);
        ptor.waitForAngular();

        expect(encore.rxNotify.all.exists('Server being set up')).to.eventually.be.true;
        expect(serversCreatePage.currentUrl).to.eventually.equal(ptor.baseUrl + serversOverviewPage.url);
    });

    it('should show error if server creation failed @dev', function () {
        serversCreatePage.createServer(tf.failMidwayNgServer);
        expect(encore.rxNotify.all.exists('Error')).to.eventually.be.true;
    });
});

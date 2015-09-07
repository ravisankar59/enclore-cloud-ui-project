var networksOverviewPage = require('../../../pages/networks/overview');
var networkCreatePage = require('../../../pages/networks/create');

describe('Network Create Page Actions', function () {

    var networkQuery, networkFilter;

    beforeEach(function () {
        networkCreatePage.go();
        basePage.disableRxNotifyTimeout();
    });

    describe('Smoke Tests', function () {

        it('should allow create if name, region and cidr are provided', function () {
            networkCreatePage.txtName.sendKeys('test-network');
            basePage.selectItem(networkCreatePage.selRegion, 'option', 'ORD (Chicago)');

            expect(networkCreatePage.btnSubmit.isEnabled()).to.eventually.be.true;
        });

        it('should allow you to cancel out of Network Create', function () {
            ptor.waitForAngular();
            expect(networkCreatePage.btnCancel.isDisplayed()).to.eventually.be.true;
            networkCreatePage.btnCancel.click();
            expect(networkCreatePage.currentUrl).to.eventually.equal(ptor.baseUrl + networksOverviewPage.url);
        });
    });

    describe('Midway Tests', function () {

        it('should create a new network @dev', function () {
            networkCreatePage.txtName.sendKeys('test-network');
            basePage.selectItem(networkCreatePage.selRegion, 'option', 'DFW (Dallas)');
            networkCreatePage.btnSubmit.click();

            expect(encore.rxNotify.all.exists('Network Created', 'success')).to.eventually.be.true;
        });

        it('should fail to create a new network @dev', function () {
            networkCreatePage.txtName.sendKeys('fail-network');
            basePage.selectItem(networkCreatePage.selRegion, 'option', 'ORD (Chicago)');
            networkCreatePage.btnSubmit.click();

            expect(encore.rxNotify.all.exists('Error creating network', 'error')).to.eventually.be.true;
        });

    });

    describe('Regression Tests', function () {

        it('should create network #regression', function () {
            var networkCreate = {
                name: 'deleteNetwork' + moment().format('MMDDYYHHmmss'),
                region: 'ORD (Chicago)'
            };

            var networkQuery = { Name: networkCreate.name };
            var networkFilter = networkQuery.Name;

            var networkOpts = {
                fn: networksOverviewPage.privateTable.findNetwork,
                fnArgs: [ networkQuery ],
                checkFn: function (data) {
                    return _.isEmpty(data);
                },
                timeout: '15'
            };

            networkCreatePage.createNetwork(networkCreate);
            expect(encore.rxNotify.all.exists('Network Created', 'success')).to.eventually.be.true;
            networksOverviewPage.privateTable.findNetwork(networkQuery, networkFilter).then(function (row) {
                expect(row).to.not.be.empty;
            });

            // Delete resources
            networksOverviewPage.privateTable.deleteNetwork(networkQuery, networkFilter).then(function () {
                networksOverviewPage.privateTable.waitForExpectedText(networkOpts);
            });
        });

        it('should not create new network #regression', function () {
            var networkCreate = {
                name: 'failNet' + moment().format('MMDDYYYmmss'),
                region: 'ORD (Chicago)',
                cidr: 'maoamoamo'
            };

            networkQuery = { Name: networkCreate.name };
            networkFilter = networkQuery.Name;

            networkCreatePage.createNetwork(networkCreate);
            expect(encore.rxNotify.all.exists('Error creating network', 'error')).to.eventually.be.true;

            networksOverviewPage.go();
            networksOverviewPage.privateTable.findNetwork(networkQuery, networkFilter).then(function (row) {
                expect(row).to.be.empty;
            });
        });
    });
});

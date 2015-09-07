var lbaasCreatePage = require('../../../pages/lbaas/create.page');
var commonTests = require('../../common');

describe('Load Balancer Create Page - Page Layout', function () {
    var regions = {
        preprod: 'ORD (Chicago)',
        staging: 'STAGING (Staging)',
        localhost: 'STAGING (Staging)'
    };
    var region = regions[ptor.params.env];

    before(function () {
        lbaasCreatePage.go();
    });

    var expected = {
        url: ptor.baseUrl + lbaasCreatePage.url,
        breadcrumbs: ['Home', 'User hub_cap', 'Load Balancers', 'Create Load Balancer'],
        title: 'Create a New Load Balancer',
        display: {
            'user products sidebar': basePage.userProducts,
            'user details sidebar': basePage.userDetails,
            'load balancer name field': lbaasCreatePage.txtName,
            'region field': lbaasCreatePage.selRegion,
            'virtual IP select field': lbaasCreatePage.selVirtualIp,
            'protocol select field': lbaasCreatePage.selProtocol,
            'link to add cloud servers': lbaasCreatePage.btnAddCloudServers,
            'link to add external nodes': lbaasCreatePage.btnAddExternalNodes,
            'timeout numeric field': lbaasCreatePage.numTimeout,
            'algorithm select field': lbaasCreatePage.selAlgorithm,
            'submit button': lbaasCreatePage.submit,
            'cancel button': lbaasCreatePage.cancel
        },
        equal: {
            'label for name field | Name:': lbaasCreatePage.lblName,
            'label for region field | Region:': lbaasCreatePage.lblRegion,
            'label for virtual IP field | Virtual IP:': lbaasCreatePage.lblVirtualIp,
            'label for protocol field | Protocol:': lbaasCreatePage.lblProtocol,
            'label for algorithm field | Algorithm:': lbaasCreatePage.lblAlgorithm,
            'label for timeout field | Timeout:': lbaasCreatePage.lblTimeout,
            'label for nodes table | Nodes': lbaasCreatePage.lblNodes
        }
    };

    commonTests(expected);

    describe('Midway Tests', function () {

        var lb;
        before(function () {
            lbaasCreatePage.go();

            lb = {
                name: 'auto-lbaasNew',
                region: region,
                port: 53,
                protocol: 'DNS_TCP',
                virtualIp: 'Shared VIP',
                algorithm: 'Random'
            };

            lbaasCreatePage.filloutFields(lb);
        });

        describe('Shared Virtual Ip Table @dev', function () {

            it('should display virtual ip table when shared vip selected @dev', function () {
                expect(lbaasCreatePage.sharedVipTable.isDisplayed()).to.eventually.be.true;
            });

            it('should have matched record count with the virtual ip table @dev', function () {
                lbaasCreatePage.sharedVipTable.data().then(function (sharedVip) {
                    expect(sharedVip.length).to.be.at.least(30);
                });
            });

            it('should display region specific records into virtual ip table @dev', function () {
                lb.region = 'DFW (Dallas)';
                lbaasCreatePage.filloutFields(lb);
                lbaasCreatePage.sharedVipTable.data().then(function (sharedVip) {
                    expect(sharedVip.length).to.be.at.most(10);
                });
            });

            it('should not enable the create button without virtual ip @dev', function () {
                lb.region = 'DFW (Dallas)';
                lb.port = 88;
                lbaasCreatePage.filloutFields(lb);
                expect(lbaasCreatePage.submit.isEnabled()).to.eventually.be.false;
            });

            it('should enable the create button with virtual ip @dev', function () {
                lbaasCreatePage.sharedVipTable.selectSharedVip('174.106.24.22');
                expect(lbaasCreatePage.submit.isEnabled()).to.eventually.be.true;
            });

            it('should display virtual ip that do not have same port @dev', function () {
                lbaasCreatePage.sharedVipTable.data().then(function (sharedVip) {
                    expect(sharedVip.length).to.equal(2);
                    expect(_.uniq(_.map(sharedVip, function (col) { return col.port; }))).to.not.include('88');
                });
            });
        });

        describe('Page Validation', function () {

            it('should be empty port number when region changes @dev', function () {
                lbaasCreatePage.filloutFields({ region: 'STAGING (Staging)' });
                expect(lbaasCreatePage.numPortText).to.eventually.be.empty;
            });
        });
    });
});

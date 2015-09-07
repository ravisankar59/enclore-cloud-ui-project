var serversOverviewPage = require('../../../pages/servers/overview');
var createPage = require('../../../pages/servers/create');
var commonTests = require('../../common');

describe('Cloud Overview Page - Page Layout', function () {

    var user = ptor.params.user;
    var accountNumber = ptor.params.accountNumber;
    var reachUrls = {
        localhost: 'ui.staging.reach.rackspace.com',
        staging: 'ui.staging.reach.rackspace.com',
        preprod: 'mycloud.rackspace.com'
    };
    var reachUrl = reachUrls[ptor.params.env] || reachUrls['staging'];

    before(function () {
        serversOverviewPage.go();
    });

    var expected = {
        url: ptor.baseUrl + '/cloud/' + accountNumber + '/' + user + '/servers',
        breadcrumbs: ['Home', 'User ' + user, 'Servers', 'Overview'],
        title: 'Cloud Servers',
        subtitle: new RegExp('\\d+\\sServers found for\\s' + user),
        display: {
            'user products sidebar': basePage.userProducts,
            'user details sidebar': basePage.userDetails,
            'server table': serversOverviewPage.table,
            'a link to reach': serversOverviewPage.lnkReach,
            'a link to flavors wiki': serversOverviewPage.lnkFlavors,
            'a link to calculator': serversOverviewPage.lnkCalculator,
            'a link to cloud servers overview': serversOverviewPage.lnkCloudServersOverview,
            'server table pagination': serversOverviewPage.table.pagination.rootElement,
            'Account Info Banner': basePage.accountInfoBanner
        }
    };

    commonTests(expected);

    describe('Smoke Tests', function () {

        it('should allow you to open servers in Reach', function () {
            serversOverviewPage.lnkReach.click();
            expect(basePage.newWindowUrl).to.eventually.contain(reachUrl);
        });

        it('should display the server table filter', function () {
            expect(serversOverviewPage.table.txtFilter.isDisplayed()).to.eventually.be.true;
        });

        it('should link to the create new server page', function () {
            serversOverviewPage.lnkCreateServer.click();

            expect(serversOverviewPage.currentUrl).to.eventually.equal(ptor.baseUrl + createPage.url);
            serversOverviewPage.go();
        });

        it('should have correct url for link to Flavors Wiki', function () {
            var flavorsUrl = 'https://one.rackspace.com/x/7JN0Aw';
            expect(serversOverviewPage.lnkFlavorsHref).to.eventually.equal(flavorsUrl);
        });

        it('should have correct url for link to Calculator', function () {
            var calcUrl = 'http://www.rackspace.com/calculator';
            expect(serversOverviewPage.lnkCalculatorHref).to.eventually.equal(calcUrl);
        });

        it('should have correct url for link to Cloud Servers Overview', function () {
            var overviewUrl = 'http://www.rackspace.com/cloud/servers';
            expect(serversOverviewPage.lnkCloudServersOverviewHref).to.eventually.equal(overviewUrl);
        });

        it('should show error message if no information found', function () {
            ptor.get(ptor.baseUrl + '/cloud/123/bad_user/servers');
            expect(encore.rxNotify.all.exists('Error')).to.eventually.be.true;
            serversOverviewPage.go();
        });

        it('should not show FirstGen loading error message if FirstGen not in user service catalog', function () {
            var tableMsg = 'Error loading FirstGen Images';
            ptor.get(ptor.baseUrl + '/cloud/123/bad_wolf/servers');
            expect(encore.rxNotify.all.exists(tableMsg)).to.eventually.be.false;
        });

    });
});

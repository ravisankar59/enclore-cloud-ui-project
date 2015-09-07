var snapshotDetailsPage = require('../../../../pages/cbs/snapshots/details');
var snapshotsOverviewPage = require('../../../../pages/cbs/snapshots/overview');
var tf = require('../../../../pages/test-fixtures/ui');
var breadcrumbs = basePage.breadcrumbs;
var commonTests = require('../../../common');

describe('Block Storage snapshots - Details Layout', function () {
    var user = ptor.params.user;
    var goodSnapshot, badSnapshot, query, filter, emptySnapshot;

    before(function () {
        goodSnapshot = '1a50a111-b5f5-4ac3-b5c3-f99b63f3c77d';
        badSnapshot = '21d811b5-ff93-4d38-b19c-4b913af5fbca';
        emptySnapshot = '3e6b32f5-b626-4a54-a401-41bdc4e60a60';

        query = { name: tf.sataSnapshot.name };
        filter = query.name;

        if (basePage.isInMidwayEnvironment()) {
            return snapshotDetailsPage.go(goodSnapshot);
        }

        snapshotDetailsPage.open(query, filter);
    });

    var commonArgs = {
        url: ptor.baseUrl + snapshotDetailsPage.url,
        breadcrumbs: ['Home', 'User ' + user, 'Cloud Block Storage', 'Snapshot Details'],
        title: /Snapshot: \w/,
        subtitle: /ID:\s(\d|[a-f])+-(\d|[a-f])+-(\d|[a-f])+-(\d|[a-f])+-(\d|[a-f])+/,
        display: {
            'user products sidebar': basePage.userProducts,
            'user details sidebar': basePage.userDetails,
            '"Go to Reach Snapshots" Link': snapshotDetailsPage.lnkReach,
            'Account Info Banner': basePage.accountInfoBanner
        }
    };

    commonTests(commonArgs);

    describe('Smoke Tests', function () {

        it('should take you back to the snapshotss page using the breadcrumbs', function () {
            breadcrumbs.getBreadcrumbs().then(function (breadcrumbs) {
                breadcrumbs['Cloud Block Storage'].visit();

            });
            expect(snapshotDetailsPage.currentUrl).to.eventually.equal(ptor.baseUrl + snapshotsOverviewPage.url);

            if (basePage.isInMidwayEnvironment()) {
                snapshotDetailsPage.go(goodSnapshot);
            } else {
                snapshotDetailsPage.open(query, filter);
            }
        });
    });

    describe('Midway Tests', function () {

        it('should list correct snapshot details @dev', function () {
            var datePattern = /Feb \d{2}, 2015 @ \d{1,2}:\d{2} \(UTC[+-]\d{4}\)/;
            // (TODO): How to test increasing duration
            snapshotDetailsPage.go(goodSnapshot);
            snapshotDetailsPage.snapshotDetails().then(function (details) {
                expect(details[0]).to.eql('Volume ID:\n573511aa-0fa6-4af0-8d43-4d7eac874c5b');
                expect(details[1]).to.eql('Description:\nTesting');
                expect(details[2]).to.eql('Status:\nAvailable');
                expect(details[3]).to.eql('Size:\n75 GB');
                // TODO this is going to fail every time since the date keeps changing
                // more comments: https://jira.rax.io/browse/EN-934
                // expect(details[4]['Age']).to.equal('135D');
                expect(details[5]).that.match(datePattern).to.contain('Created');
            });
        });

        it('should list N/A for empty snapshot details @dev', function () {
            snapshotDetailsPage.go(emptySnapshot);
            snapshotDetailsPage.snapshotDetails().then(function (emptyDetails) {
                expect(emptyDetails[0]).to.eql('Volume ID:\nN/A');
                expect(emptyDetails[1]).to.eql('Description:\nN/A');
                expect(emptyDetails[2]).to.eql('Status:\nN/A');
                expect(emptyDetails[3]).to.eql('Size:\nN/A');
                expect(emptyDetails[4]).to.eql('Age:\nN/A');
                expect(emptyDetails[5]).to.eql('Created:\nN/A');
            });
        });

        it('should show error message if no snapshot found @dev', function () {
            snapshotDetailsPage.go(badSnapshot);
            expect(encore.rxNotify.all.exists('Error loading')).to.eventually.be.true;
        });
    });
});

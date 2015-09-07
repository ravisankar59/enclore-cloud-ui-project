var serversCreatePage = require('../../../../pages/servers/create');
var serversOverviewPage = require('../../../../pages/servers/overview');
var tf = require('../../../../pages/test-fixtures/ui');

describe('Cloud Servers Create Page - NextGen Windows Server Creation', function () {

    it('should create a NextGen windows server #regression', function () {
        var server = { name: tf.nextgenWindows.name };
        var filter = server.name;
        var opts = {
            fn: serversOverviewPage.table.findServer,
            fnArgs: [server, filter],
            checkFn: function (data) {
                return (_.contains(data, opts.expectedText));
            },
            expectedText: 'BUILD',
            timeout: '15'
        };

        serversCreatePage.go();
        serversCreatePage.createServer(tf.nextgenWindows);

        var buildingMessage = 'Server being set up. Admin password will be';
        expect(encore.rxNotify.all.exists(buildingMessage)).to.eventually.be.true;

        serversOverviewPage.table.waitForExpectedText(opts).then(function (server) {
            expect(server.Status).to.eql('BUILD');
        });
    });
});

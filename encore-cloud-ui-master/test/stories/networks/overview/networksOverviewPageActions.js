var networksOverviewPage = require('../../../pages/networks/overview');
var networkCreatePage = require('../../../pages/networks/create');
var serversOverviewPage = require('../../../pages/servers/overview');
var serversCreatePage = require('../../../pages/servers/create').nextGen;

describe('Networks Overview Page - Page Actions', function () {

    before(function () {
        networksOverviewPage.go();
    });

    describe('Midway Tests', function () {

        it('should fail to delete dfw-test-network @dev', function () {
            var networkQuery = { Name: 'dfw-test-network' };

            networksOverviewPage.privateTable.deleteNetwork(networkQuery).then(function () {
                expect(encore.rxNotify.all.exists('Error deleting network dfw-test-network')).to.eventually.be.true;
            });
        });

        it('should delete ord-test-network @dev', function () {
            var networkQuery = { Name: 'ord-test-network' };

            networksOverviewPage.privateTable.deleteNetwork(networkQuery).then(function () {
                expect(encore.rxNotify.all.exists('Network "ord-test-network" deleted')).to.eventually.be.true;
            });
        });

    });

    describe('Regression Tests', function () {

        it('should delete available network #regression', function () {
            var networkCreate = {
                name: 'deleteNetwork' + moment().format('MMDDYYHHmmss'),
                region: 'ORD (Chicago)'
            };

            var networkQuery = { Name: networkCreate.name };

            var networkOpts = {
                fn: networksOverviewPage.privateTable.findNetwork,
                fnArgs: [ networkQuery ],
                checkFn: function (data) {
                    return _.isEmpty(data);
                },
                timeout: '15'
            };

            networkCreatePage.go();

            networkCreatePage.createNetwork(networkCreate);
            expect(encore.rxNotify.all.exists('Network Created')).to.eventually.be.true;

            networksOverviewPage.privateTable.deleteNetwork(networkQuery).then(function () {
                networksOverviewPage.privateTable.waitForExpectedText(networkOpts);
            });
        });

        it('should not delete in-use network #regression', function () {
            // TODO: Have this network and server created and tied together before testing
            var networkCreate = {
                name: 'deleteNetwork' + moment().format('MMDDYYHHmmss'),
                region: 'ORD (Chicago)'
            };
            var networkQuery = { Name: networkCreate.name };
            var serverQuery = { name: 'networkServer' + moment().format('MMDDYYHHmmss') };
            var serverFilter = serverQuery.Name;

            networkCreatePage.go();

            networkCreatePage.createNetwork(networkCreate);
            expect(encore.rxNotify.all.exists('Network Created')).to.eventually.be.true;

            var networkServer = {
                name: serverQuery.name,
                region: {
                    type: 'NextGen',
                    label: 'ORD (Chicago)'
                },
                flavor: {
                    type: 'standard',
                    name: '512MB Standard'
                },
                bootSource: {
                    type: 'local'
                },
                image: {
                    type: 'rackspace',
                    name: 'CentOS 6.5'
                },
                networks: [networkQuery.Name]
            };
            serversCreatePage.go();
            serversCreatePage.createServer(networkServer);

            networksOverviewPage.go();
            networksOverviewPage.privateTable.deleteNetwork(networkQuery).then(function () {
                expect(encore.rxNotify.all.exists('Error deleting network')).to.eventually.be.true;
            });

            //Delete resources
            var serverOpts = {
                fn: serversOverviewPage.privateTable.findServer,
                fnArgs: [ serverQuery ],
                checkFn: function (data) {
                    return _.isEmpty(data);
                },
                timeout: '15'
            };
            var networkOpts = {
                fn: networksOverviewPage.privateTable.findNetwork,
                fnArgs: [ networkQuery ],
                checkFn: function (data) {
                    return _.isEmpty(data);
                },
                timeout: '15'
            };
            serversOverviewPage.go();
            serversOverviewPage.privateTable.deleteServer(serverQuery, serverFilter).then(function () {
                serversOverviewPage.privateTable.waitForExpectedText(serverOpts);
            });
            networksOverviewPage.go();
            networksOverviewPage.privateTable.deleteNetwork(networkQuery).then(function () {
                networksOverviewPage.privateTable.waitForExpectedText(networkOpts);
            });
        });
    });
});

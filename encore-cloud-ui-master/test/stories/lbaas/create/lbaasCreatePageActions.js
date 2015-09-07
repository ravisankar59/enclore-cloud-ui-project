var overviewPage = require('../../../pages/lbaas/overview.page');
var lbaasCreatePage = require('../../../pages/lbaas/create.page');
var tf = require('../../../pages/test-fixtures/api');

// #TODO Tests currently using mock data
describe('Load Balancer Create Page - Actions', function () {

    var regions = {
        preprod: 'ORD (Chicago)',
        staging: 'STAGING (Staging)',
        localhost: 'STAGING (Staging)'
    };
    var region = regions[ptor.params.env];

    before(function () {
        lbaasCreatePage.go();
    });

    describe('Midway Tests', function () {
        var lb;

        beforeEach(function () {
            lb = {
                name: 'test_update_lb',
                region: region,
                protocol: 'DNS_TCP',
                port: '53',
                virtualIp: 'Public',
                algorithm: 'Random'
            };
            lbaasCreatePage.go();
        });

        it('should be empty @dev', function () {
            expect(lbaasCreatePage.nodes.emptyNodesTableText()).to.eventually.equal('No nodes have been selected.');
        });

        it('should allow a mixture of cloud servers and external servers @dev', function () {
            var servers = ['Kevin\'s Test Demo'];

            lbaasCreatePage.btnAddCloudServers.click();
            lbaasCreatePage.serversModal.addServers(servers);

            lbaasCreatePage.btnAddExternalNodes.click();
            lbaasCreatePage.nodesModal.addExternalNode('192.168.2.36', '8080');

            lbaasCreatePage.nodes.data().then(function (rows) {
                expect(rows.length).to.equal(2);
                expect(rows[0].Name).to.contain('Kevin\'s Test Demo');
                expect(rows[1].Type).to.contain('External (192.168.2.36)');
            });
        });

        it('should create a new load balancer @dev', function () {
            lbaasCreatePage.createLoadBalancer(lb);
            expect(encore.rxNotify.all.exists('Load Balancer Created', 'success')).to.eventually.be.true;
        });

        it('should create a new load balancer with cloud servers and external nodes @dev', function () {
            lb.cloudServers = [{ name: 'Kevin\'s Test Demo' }];
            lb.externalNodes = [{ ip: '192.168.2.36', port: '53' }];

            lbaasCreatePage.createLoadBalancer(lb);
            expect(encore.rxNotify.all.exists('Load Balancer Created', 'success')).to.eventually.be.true;
        });

        it('should create a new load balancer with shared vip selected @dev', function () {
            lb.virtualIp = { rowToBeSelected: '151.106.24.22', type: 'Shared VIP' };
            lbaasCreatePage.createLoadBalancer(lb);
            expect(encore.rxNotify.all.exists('Load Balancer Created', 'success')).to.eventually.be.true;
        });
    });

    describe('Smoke Tests', function () {

        beforeEach(function () {
            lbaasCreatePage.go();
        });

        it('should allow you to cancel out', function () {
            ptor.waitForAngular();
            expect(lbaasCreatePage.cancel.isDisplayed()).to.eventually.be.true;

            lbaasCreatePage.cancel.click();
            expect(lbaasCreatePage.currentUrl).to.eventually.equal(ptor.baseUrl + overviewPage.url);
        });

        it('should allow create if required fields are provided', function () {
            var lb = {
                name: 'test_update_lb',
                region: region,
                protocol: 'DNS_TCP',
                virtualIp: 'Public',
                algorithm: 'Random'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.submit.isEnabled()).to.eventually.be.true;
        });

        it('should match port when protocol is dns_tcp', function () {
            var lb = {
                region: region,
                protocol: 'DNS_TCP'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.getAttribute('value')).to.eventually.eql('53');
        });

        it('should match port when protocol is tcp', function () {
            var lb = {
                region: region,
                protocol: 'TCP'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.getAttribute('value')).to.eventually.eql('');
        });

        it('should match port when protocol is dns_udp', function () {
            var lb = {
                region: region,
                protocol: 'DNS_UDP'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.getAttribute('value')).to.eventually.eql('53');
        });

        it('should match port when protocol is ftp', function () {
            var lb = {
                region: region,
                protocol: 'FTP'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.isDisplayed()).to.eventually.be.true;
        });

        it('should match port when protocol is tcp', function () {
            var lb = {
                region: region,
                protocol: 'TCP'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.getAttribute('value')).to.eventually.eql('');
        });

        it('should match port when protocol is http', function () {
            var lb = {
                region: region,
                protocol: 'HTTP'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.getAttribute('value')).to.eventually.eql('80');
        });

        it('should match port when protocol is tcp_client_first', function () {
            var lb = {
                region: region,
                protocol: 'TCP_CLIENT_FIRST'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.getAttribute('value')).to.eventually.eql('');
        });

        it('should match port when protocol is udp', function () {
            var lb = {
                region: region,
                protocol: 'UDP'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.getAttribute('value')).to.eventually.eql('');
        });

        it('should match port when protocol is https', function () {
            var lb = {
                region: region,
                protocol: 'HTTPS'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.getAttribute('value')).to.eventually.eql('443');
        });

        it('should match port when protocol is imaps', function () {
            var lb = {
                region: region,
                protocol: 'IMAPS'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.getAttribute('value')).to.eventually.eql('993');
        });

        it('should match port when protocol is imapsv2', function () {
            var lb = {
                region: region,
                protocol: 'IMAPv2'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.getAttribute('value')).to.eventually.eql('143');
        });

        it('should match port when protocol is imapv3', function () {
            var lb = {
                region: region,
                protocol: 'IMAPv3'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.getAttribute('value')).to.eventually.eql('220');
        });

        it('should match port when protocol is imapsv4', function () {
            var lb = {
                region: region,
                protocol: 'IMAPv4'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.getAttribute('value')).to.eventually.eql('143');
        });

        it('should match port when protocol is ldap', function () {
            var lb = {
                region: region,
                protocol: 'LDAP'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.getAttribute('value')).to.eventually.eql('389');
        });

        it('should match port when protocol is mysql', function () {
            var lb = {
                region: region,
                protocol: 'MYSQL'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.getAttribute('value')).to.eventually.eql('3306');
        });

        it('should match port when protocol is pop3', function () {
            var lb = {
                region: region,
                protocol: 'POP3'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.getAttribute('value')).to.eventually.eql('110');
        });

        it('should match port when protocol is pop3s', function () {
            var lb = {
                region: region,
                protocol: 'POP3S'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.getAttribute('value')).to.eventually.eql('995');
        });

        it('should match port when protocol is sftp', function () {
            var lb = {
                region: region,
                protocol: 'SFTP'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.getAttribute('value')).to.eventually.eql('22');
        });

        it('should match port when protocol is smtp', function () {
            var lb = {
                region: region,
                protocol: 'SMTP'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.getAttribute('value')).to.eventually.eql('25');
        });

        it('should match port when protocol is udp_stream', function () {
            var lb = {
                region: region,
                protocol: 'UDP_STREAM'
            };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.numPort.getAttribute('value')).to.eventually.eql('');
        });

        it('should show available load balancers when virtual ip is shared', function () {
            var lb = { virtualIp: 'Shared VIP' };

            lbaasCreatePage.filloutFields(lb);

            expect(lbaasCreatePage.sharedVirtualIps.isDisplayed()).to.eventually.be.true;
        });

        it('should not show available load balancers with matching protocol', function () {
            var lb = {
                region: region,
                protocol: 'HTTPS',
                virtualIp: 'Shared VIP'
            };

            lbaasCreatePage.filloutFields(lb);

            lbaasCreatePage.sharedVipTable.data().then(function (data) {
                expect(_.contains(data, { protocol: 'HTTPS' })).to.be.false;
            });
        });

        it('should fail to create a new load balancer @dev', function () {
            var lb = {
                name: 'fail',
                region: region,
                port: 53,
                protocol: 'DNS_TCP',
                virtualIp: 'Public',
                algorithm: 'Random'
            };

            lbaasCreatePage.createLoadBalancer(lb);
            expect(encore.rxNotify.all.exists('Error creating load balancer', 'error')).to.eventually.be.true;
        });

        describe('should not be able to', function () {
            var lb;
            beforeEach(function () {
                lb = {
                    name: 'test-lb-negs',
                    region: region,
                    protocol: 'DNS_TCP',
                    port: '53',
                    virtualIp: 'Public',
                    algorithm: 'Random'
                };
            });

            it('click the \'Create New Load Balancer\' button when Name is not populated', function () {
                lb.name = '';
                lbaasCreatePage.filloutFields(lb);
                expect(lbaasCreatePage.submit.isEnabled()).to.eventually.be.false;
            });

            it('click the \'Create New Load Balancer\' button when Protocol is not selected', function () {
                lb.protocol = '';
                lbaasCreatePage.filloutFields(lb);
                expect(lbaasCreatePage.submit.isEnabled()).to.eventually.be.false;
            });

            it('click the \'Create New Load Balancer\' button when Virtual IP is not selected', function () {
                lb.virtualIp = '';
                lbaasCreatePage.filloutFields(lb);
                expect(lbaasCreatePage.submit.isEnabled()).to.eventually.be.false;
            });

            it('click the \'Create New Load Balancer\' button when Algorithm is not selected', function () {
                lb.algorithm = '';
                lbaasCreatePage.filloutFields(lb);
                expect(lbaasCreatePage.submit.isEnabled()).to.eventually.be.false;
            });

            it('click \'Add Servers\' if IP Address is not populated on the Add External Node modal', function () {
                lbaasCreatePage.btnAddExternalNodes.click();
                lbaasCreatePage.nodesModal.txtExternalIp.clear();
                expect(lbaasCreatePage.nodesModal.btnSubmit.isEnabled()).to.eventually.be.false;
                lbaasCreatePage.nodesModal.close();
            });

            it('add an external node with an incorrectly formatted IP address', function () {
                lbaasCreatePage.btnAddExternalNodes.click();
                lbaasCreatePage.nodesModal.txtExternalIp.sendKeys('badIp1.1.1.1.1.11.1.');
                expect(lbaasCreatePage.nodesModal.btnSubmit.isEnabled()).to.eventually.be.false;
                lbaasCreatePage.nodesModal.close();
            });

            it('click the \'Add Servers\' button if no servers selected on the Add Cloud Servers modal', function () {
                lbaasCreatePage.btnAddCloudServers.click();
                expect(lbaasCreatePage.serversModal.btnSubmit.isEnabled()).to.eventually.be.false;
                lbaasCreatePage.serversModal.close();
            });
        });

        describe('should display error if', function () {
            it('a user attempts to create a load balancer with a duplicate External Node', function () {
                var lb = {
                    name: 'dupsFail',
                    region: region,
                    port: 53,
                    protocol: 'DNS_TCP',
                    virtualIp: 'Public',
                    algorithm: 'Random',
                    externalNodes: [{
                        ip: '126.12.32.124',
                        port: 80
                    },
                    {
                        ip: '126.12.32.124',
                        port: 80
                    }]
                };

                lbaasCreatePage.createLoadBalancer(lb);
                expect(encore.rxNotify.all.exists('Error creating load balancer', 'error')).to.eventually.be.true;
            });
        });
    });

    describe('Regression Tests', function () {

        describe('Create Tests #regression', function () {

            var lb = {};

            beforeEach(function () {
                lbaasCreatePage.go();

                lb = {
                    name: 'auto-lbaasNew',
                    region: region,
                    port: 53,
                    protocol: 'DNS_TCP',
                    virtualIp: 'Public',
                    algorithm: 'Random'
                };

            });

            it('should create a load balancer with cloud servers and external nodes #regression', function () {
                lb.name = 'auto-lbaasCloudAndExternal';
                lb.cloudServers = [{ name: tf.nextGenLbaas1.name, ipv: 'IPv4' }];
                lb.externalNodes = [{ ip: '192.168.2.36', port: '53' }];

                lbaasCreatePage.createLoadBalancer(lb);
                expect(encore.rxNotify.all.exists('Load Balancer Created', 'success')).to.eventually.be.true;
            });

            it('should create a load balancer with one IPv4 cloud server #regression', function () {
                lb.name = 'auto-lbaasIPv4';
                lb.cloudServers = [{ name: tf.nextGenLbaas1.name, ipv: 'IPv4' }];

                lbaasCreatePage.createLoadBalancer(lb);
                expect(encore.rxNotify.all.exists('Load Balancer Created', 'success')).to.eventually.be.true;
            });

            it('should create a load balancer with one IPv6 cloud server #regression', function () {
                lb.name = 'auto-lbaasIPv6';
                lb.cloudServers = [{ name: tf.nextGenLbaas1.name, ipv: 'IPv6' }];

                lbaasCreatePage.createLoadBalancer(lb);
                expect(encore.rxNotify.all.exists('Load Balancer Created', 'success')).to.eventually.be.true;
            });

            it('should create a load balancer with one IPv4 and IPv6 cloud servers #regression', function () {
                lb.name = 'auto-lbaasIPv46';
                lb.cloudServers = [
                    { name: tf.nextGenLbaas1.name, ipv: 'IPv4' },
                    { name: tf.nextGenLbaas2.name, ipv: 'IPv6' }
                ];

                lbaasCreatePage.createLoadBalancer(lb);
                expect(encore.rxNotify.all.exists('Load Balancer Created', 'success')).to.eventually.be.true;
            });

            it('should create a load balancer with multiple IPv4 cloud servers #regression', function () {
                lb.name = 'auto-lbaasMultiIPv4';
                lb.cloudServers = [
                    { name: tf.nextGenLbaas1.name, ipv: 'IPv4' },
                    { name: tf.nextGenLbaas2.name, ipv: 'IPv4' }
                ];

                lbaasCreatePage.createLoadBalancer(lb);
                expect(encore.rxNotify.all.exists('Load Balancer Created', 'success')).to.eventually.be.true;
            });

            it('should create a load balancer with multiple IPv6 cloud servers #regression', function () {
                lb.name = 'auto-lbaasMultiIPv6';
                lb.cloudServers = [
                    { name: tf.nextGenLbaas1.name, ipv: 'IPv6' },
                    { name: tf.nextGenLbaas2.name, ipv: 'IPv6' }
                ];

                lbaasCreatePage.createLoadBalancer(lb);
                expect(encore.rxNotify.all.exists('Load Balancer Created', 'success')).to.eventually.be.true;
            });

            it('should create a load balancer with multiple IPv4 and IPv6 cloud servers #regression', function () {
                lb.name = 'auto-lbaasMultiIPv46';
                lb.cloudServers = [
                    { name: tf.nextGenLbaas1.name, ipv: 'IPv4' },
                    { name: tf.nextGenLbaas2.name, ipv: 'IPv4' },
                    { name: tf.nextGenLbaas1.name, ipv: 'IPv6' },
                    { name: tf.nextGenLbaas2.name, ipv: 'IPv6' }
                ];

                lbaasCreatePage.createLoadBalancer(lb);
                expect(encore.rxNotify.all.exists('Load Balancer Created', 'success')).to.eventually.be.true;
            });

            it('should create a load balancer with a cloud server with a custom port #regression', function () {
                lb.name = 'auto-lbaasCustomNodePort';
                lb.cloudServers = [
                    { name: tf.nextGenLbaas1.name, ipv: 'IPv6', port: 12345 },
                ];

                lbaasCreatePage.createLoadBalancer(lb);
                expect(encore.rxNotify.all.exists('Load Balancer Created', 'success')).to.eventually.be.true;
            });

            it('should create a load balancer with one external IPv4 node #regression', function () {
                lb.name = 'auto-lbaasExtIPv4';
                lb.externalNodes = [{ ip: '192.168.2.36', port: '53' }];

                lbaasCreatePage.createLoadBalancer(lb);
                expect(encore.rxNotify.all.exists('Load Balancer Created', 'success')).to.eventually.be.true;
            });

            it('should create a load balancer with one external IPv6 node #regression', function () {
                lb.name = 'auto-lbaasExtIPv6';
                lb.externalNodes = [{ ip: '2001:10:250:ab::a', port: '53' }];

                lbaasCreatePage.createLoadBalancer(lb);
                expect(encore.rxNotify.all.exists('Load Balancer Created', 'success')).to.eventually.be.true;
            });

            it('should create a load balancer with one external IPv4 node and IPv6 node #regression', function () {
                lb.name = 'auto-lbaasExtIPv46';
                lb.externalNodes = [
                    { ip: '192.168.2.36', port: '53' },
                    { ip: '2001:10:250:ab::a', port: '53' }
                ];

                lbaasCreatePage.createLoadBalancer(lb);
                expect(encore.rxNotify.all.exists('Load Balancer Created', 'success')).to.eventually.be.true;
            });

            it('should create a load balancer with multiple external IPv4 nodes #regression', function () {
                lb.name = 'auto-lbaasExtMultiIPv4';
                lb.externalNodes = [
                    { ip: '192.168.2.36', port: '53' },
                    { ip: '192.168.2.37', port: '53' }
                ];

                lbaasCreatePage.createLoadBalancer(lb);
                expect(encore.rxNotify.all.exists('Load Balancer Created', 'success')).to.eventually.be.true;
            });

            it('should create a load balancer with multiple external IPv6 nodes #regression', function () {
                lb.name = 'auto-lbaasExtMultiIPv6';
                lb.externalNodes = [
                    { ip: '2001:10:250:ab::a', port: '53' },
                    { ip: '2001:10:250:ab::b', port: '53' }
                ];

                lbaasCreatePage.createLoadBalancer(lb);
                expect(encore.rxNotify.all.exists('Load Balancer Created', 'success')).to.eventually.be.true;
            });

            it('should create a load balancer with multiple external IPv4 and IPv6 nodes #regression', function () {
                lb.name = 'auto-lbaasExtIPMultiIPv46';
                lb.externalNodes = [
                    { ip: '192.168.2.36', port: '53' },
                    { ip: '192.168.2.37', port: '53' },
                    { ip: '2001:10:250:ab::a', port: '53' },
                    { ip: '2001:10:250:ab::b', port: '53' }
                ];

                lbaasCreatePage.createLoadBalancer(lb);
                expect(encore.rxNotify.all.exists('Load Balancer Created', 'success')).to.eventually.be.true;
            });

            it('should create a load balancer with an external node with a custom port #regression', function () {
                lb.name = 'auto-lbaasExtCustomNodePort';
                lb.externalNodes = [{ ip: '192.168.2.36', port: '12345' }];

                lbaasCreatePage.createLoadBalancer(lb);
                expect(encore.rxNotify.all.exists('Load Balancer Created', 'success')).to.eventually.be.true;
            });

        });

        it('should not allow more than >128 character name #regression', function () {
            var name = 'auto-longBadName';
            for (var i = 0; i < 128; i++) { name += '1'; }
            var lb = {
                region: region,
                port: 53,
                protocol: 'DNS_TCP',
                virtualIp: 'Public',
                algorithm: 'Random'
            };
            lb.name = name;

            lbaasCreatePage.filloutFields(lb);
            expect(lbaasCreatePage.txtNameLength).to.eventually.equal(128);
        });
    });
});

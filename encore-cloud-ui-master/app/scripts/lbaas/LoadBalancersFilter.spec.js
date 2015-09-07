/*
 * Modeled off https://github.com/rackerlabs/billing-ui/blob/master/app/scripts/billing/billingFilters.spec.js
 */
describe('LoadBalancersFilter', function () {
    var loadBalancersFilter, createRows;

    beforeEach(function () {
        module('loadbalancers');

        inject(function ($filter) {
            loadBalancersFilter = $filter('LoadBalancersFilter');
        });
    });

    it('should exist', function () {
        expect(loadBalancersFilter).to.exist;
        expect(loadBalancersFilter).to.not.be.empty;
    });

    it('should return the same number of rows passed when no filter is applied', function () {
        var rows = createRows();
        expect(loadBalancersFilter(rows).length).to.be.eq(rows.length);
    });

    it('should filter results', function () {
        var rows = createRows();

        expect(rows).to.not.be.empty;
        expect(loadBalancersFilter(rows, { keyword: 'CRAPLOUSYGARBAGE' }).length).to.be.eq(0);
        expect(loadBalancersFilter(rows, { keyword: 'zzz_bad_load_balancer' }).length).to.be.eq(1);
        expect(loadBalancersFilter(rows, { keyword: 'ZZZ' }).length).to.be.eq(1);
        expect(loadBalancersFilter(rows, { keyword: '10/18' }).length).to.be.eq(2);

    });

    createRows = function () {
        return [
            {
                'name': 'test_load_balancer',
                'id': 57361,
                'protocol': 'HTTP',
                'port': 80,
                'algorithm': 'RANDOM',
                'status': 'ACTIVE',
                'timeout': 30,
                'created': {
                    'time': '2013-10-18T16:10:11Z'
                },
                'virtualIps': [
                    {
                        'ip_address': '184.106.24.22',
                        'id': 8,
                        'ip_type': 'PUBLIC',
                        'version': 'IPV4'
                    },
                    {
                        'ip_address': '2001:4801:79f1:0000:07b4:0a0b:0000:0001',
                        'id': 9005905,
                        'ip_type': 'PUBLIC',
                        'version': 'IPV6'
                    }
                ],
                'updated': {
                    'time': '2013-11-01T22:41:19Z'
                },
                'nodeCount': 2
            },
            {
                'name': 'test_create_lb',
                'id': 59247,
                'protocol': 'HTTP',
                'port': 80,
                'algorithm': 'RANDOM',
                'status': 'BUILD',
                'timeout': 30,
                'created': {
                    'time': '2013-11-05T17:11:55Z'
                },
                'virtualIps': [
                    {
                        'ip_address': '184.106.24.36',
                        'id': 22,
                        'ip_type': 'PUBLIC',
                        'version': 'IPV4'
                    },
                    {
                        'ip_address': '2001:4801:79f1:0000:07b4:0a0b:0000:0002',
                        'id': 9006447,
                        'ip_type': 'PUBLIC',
                        'version': 'IPV6'
                    }
                ],
                'updated': {
                    'time': '2013-11-05T17:11:55Z'
                },
                'nodeCount': 2
            },
            {
                'name': 'zzz_bad_load_balancer',
                'id': 12345,
                'protocol': 'HTTP',
                'port': 80,
                'algorithm': 'RANDOM',
                'status': 'ACTIVE',
                'timeout': 30,
                'created': {
                    'time': '2013-10-18T16:10:11Z'
                },
                'virtualIps': [
                    {
                        'address': '184.106.24.23',
                        'id': 50,
                        'type': 'PUBLIC',
                        'ipVersion': 'IPV4'
                    },
                    {
                        'address': '1234:4801:79f1:0000:07b4:0a0b:0000:0001',
                        'id': 12345678,
                        'type': 'PUBLIC',
                        'ipVersion': 'IPV6'
                    }
                ],
                'updated': {
                    'time': '2013-11-01T22:41:19Z'
                },
                'nodeCount': 2
            }
        ];
    };

});

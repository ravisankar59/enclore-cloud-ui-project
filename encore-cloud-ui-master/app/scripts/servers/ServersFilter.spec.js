/*
 * Modeled off https://github.com/rackerlabs/billing-ui/blob/master/app/scripts/billing/billingFilters.spec.js
 */
describe('ServersFilter', function () {
    var serverFilter, createRows;

    beforeEach(function () {
        module('servers');

        inject(function ($filter) {
            serverFilter = $filter('ServersFilter');
        });
    });

    it('should exist', function () {
        expect(serverFilter).to.exist;
        expect(serverFilter).to.not.be.empty;
    });

    it('should return the same number of rows passed when no filter is applied', function () {
        var rows = createRows();
        expect(serverFilter(rows).length).to.be.eq(rows.length);
    });

    it('should filter results', function () {
        var rows = createRows();

        expect(rows).to.not.be.empty;
        expect(serverFilter(rows, { keyword: 'CRAPLOUSYGARBAGE' }).length).to.be.eq(0);
        expect(serverFilter(rows, { keyword: 'kacieissoawesome' }).length).to.be.eq(1);
        expect(serverFilter(rows, { keyword: 'KACIE' }).length).to.be.eq(1);
        expect(serverFilter(rows, { keyword: '7/22' }).length).to.be.eq(1);
        expect(serverFilter(rows, { keyword: '512 server' }).length).to.be.eq(3);
        expect(serverFilter(rows, { keyword: '10.179.215.33' }).length).to.be.eq(1);
        expect(serverFilter(rows, { keyword: '10.255.255.55' }).length).to.be.eq(0);
    });

    createRows = function () {
        return [
            {
                'updated': '',
                'task_state': '',
                'image': {
                    'updated': '',
                    'links': [],
                    'metadata': {},
                    'min_ram': null,
                    'progress': 0,
                    'min_disk': null,
                    'created': '',
                    'status': '',
                    'id': 110,
                    'name': null,
                    'disk_config': ''
                },
                'admin_pass': '',
                'links': [],
                'id': 110148309,
                'flavor': {
                    'ram': null,
                    'disk_size': null,
                    'links': [],
                    'id': 2,
                    'vcpus': null,
                    'name': '512 server'
                },
                'tenant_id': '',
                'vm_state': '',
                'user_id': '',
                'disk_config': '',
                'metadata': {},
                'progress': 100,
                'region': 'firstgen',
                'created': '',
                'status': 'ACTIVE',
                'addresses': [
                    {
                        'id': null,
                        'ip_type': 'private',
                        'ip_address': '10.179.215.33',
                        'version': '4'
                    },
                    {
                        'id': null,
                        'ip_type': 'public',
                        'ip_address': '184.106.255.21',
                        'version': '4'
                    }
                ],
                'power_state': null,
                'name': 'kacieissoawesome',
                'host_id': 'e78880b6fa7eead9c771d40f344285df',
                'getIPV4Addresses': function () {
                    return [
                        {
                            'id': null,
                            'ip_type': 'private',
                            'ip_address': '10.179.215.33',
                            'version': '4'
                        },
                        {
                            'id': null,
                            'ip_type': 'public',
                            'ip_address': '184.106.255.21',
                            'version': '4'
                        }
                    ];
                }
            },
            {
                'updated': '',
                'task_state': '',
                'image': {
                    'updated': '',
                    'links': [],
                    'metadata': {},
                    'min_ram': null,
                    'progress': 0,
                    'min_disk': null,
                    'created': '',
                    'status': '',
                    'id': 110,
                    'name': null,
                    'disk_config': ''
                },
                'admin_pass': '',
                'links': [],
                'id': 110148310,
                'flavor': {
                    'ram': null,
                    'disk_size': null,
                    'links': [],
                    'id': 2,
                    'vcpus': null,
                    'name': '512 server'
                },
                'tenant_id': '',
                'vm_state': '',
                'user_id': '',
                'disk_config': '',
                'metadata': {},
                'progress': 100,
                'region': 'firstgen',
                'created': '',
                'status': 'ACTIVE',
                'addresses': [
                    {
                        'id': null,
                        'ip_type': 'private',
                        'ip_address': '10.179.215.34',
                        'version': '4'
                    },
                    {
                        'id': null,
                        'ip_type': 'public',
                        'ip_address': '184.106.255.22',
                        'version': '4'
                    }
                ],
                'power_state': null,
                'name': 'slice110148310',
                'host_id': 'e78880b6fa7eead9c771d40f344285df',
                'getIPV4Addresses': function () {
                    return [
                        {
                            'id': null,
                            'ip_type': 'private',
                            'ip_address': '10.179.215.34',
                            'version': '4'
                        },
                        {
                            'id': null,
                            'ip_type': 'public',
                            'ip_address': '184.106.255.22',
                            'version': '4'
                        }
                    ];
                }
            },
            {
                'updated': '',
                'task_state': '',
                'image': {
                    'updated': '',
                    'links': [],
                    'metadata': {},
                    'min_ram': null,
                    'progress': 0,
                    'min_disk': null,
                    'created': '',
                    'status': '',
                    'id': 110,
                    'name': null,
                    'disk_config': ''
                },
                'admin_pass': '',
                'links': [],
                'id': 110148311,
                'flavor': {
                    'ram': null,
                    'disk_size': null,
                    'links': [],
                    'id': 2,
                    'vcpus': null,
                    'name': '512 server'
                },
                'tenant_id': '',
                'vm_state': '',
                'user_id': '',
                'disk_config': '',
                'metadata': {},
                'progress': 100,
                'region': 'firstgen',
                'created': '2013-07-22T19:44:12Z',
                'status': 'ACTIVE',
                'addresses': [
                    {
                        'id': null,
                        'ip_type': 'private',
                        'ip_address': '10.179.215.36',
                        'version': '4'
                    },
                    {
                        'id': null,
                        'ip_type': 'public',
                        'ip_address': '184.106.255.23',
                        'version': '4'
                    }
                ],
                'power_state': null,
                'name': 'slice110148311',
                'host_id': 'e78880b6fa7eead9c771d40f344285df',
                'getIPV4Addresses': function () {
                    return [
                        {
                            'id': null,
                            'ip_type': 'private',
                            'ip_address': '10.179.215.36',
                            'version': '4'
                        },
                        {
                            'id': null,
                            'ip_type': 'public',
                            'ip_address': '184.106.255.23',
                            'version': '4'
                        }
                    ];
                }
            }
        ];
    };

});

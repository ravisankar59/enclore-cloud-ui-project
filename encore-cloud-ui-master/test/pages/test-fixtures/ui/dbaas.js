var regions = {
    preprod: 'ORD (Chicago)',
    staging: 'STAGING (Staging)',
    localhost: 'STAGING (Staging)'
};
var region = regions[ptor.params.env];

module.exports = {
    dbaasWithoutDb: {
        value: {
            name: 'auto-dbaasWithoutDb',
            region: region,
            volumeSize: '1',
            flavor: '512MB'
        }
    },

    dbaasWithDb: {
        value: {
            name: 'auto-dbaasWithDb',
            region: region,
            volumeSize: '1',
            flavor: '512MB',
            dbName: 'db-test'
        }
    },

    dbaasWithDbAndUser: {
        value: {
            name: 'auto-dbaasWithDbAndUser',
            region: region,
            volumeSize: '1',
            flavor: '512MB',
            dbName: 'db-test-user',
            dbUsername: 'user-db',
            password: 'password',
            confirmPassword: 'password'
        }
    },
};

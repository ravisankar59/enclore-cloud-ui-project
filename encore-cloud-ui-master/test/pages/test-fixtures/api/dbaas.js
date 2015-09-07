var _ = require('lodash');

function buildDbs () {

    var databases = [
        'dbTestActions',
        'dbChangeFlavor',
        'dbCreate',
        'dbDelete',
        'dbResize',
        'dbRestart',
        'dbWithUser'
    ];

    return _.reduce(databases, function (obj, dbName) {
        obj[dbName] = {
            flavorRef: '1',
            name: 'auto-' + dbName,
            volume: {
                size: '1'
            },
            databases: [
                { name: 'db_name' }
            ],
            users: [{
                databases: [{
                    name: 'db_name'
                }],
                name: 'username',
                password: 'password'
            }]
        };
        return obj;
    }, {});
}

module.exports = buildDbs();

module.exports.dbDetails = {
    flavorRef: '1',
    name: 'auto-dbDetails',
    volume: {
        size: '1'
    },
    databases: [
        { name: 'db1' },
        { name: 'db2' },
        { name: 'delete_db' },
    ],
    users: [{
        databases: [
            { name: 'db1' }
        ],
        name: 'user1',
        password: 'password'
    }, {
        databases: [
            { name: 'db2' }
        ],
        name: 'user2',
        password: 'password'
    }, {
        databases: [],
        name: 'delete_user',
        password: 'password'
    }]
};

describe('Controller: ShowInstanceCtrl', function () {
    var ctrl, location, q, dbaasDatabaseResource, dbaasInstanceResource,
        dbaasRootResource, dbaasUserResource, notifySvc, scope;

    var validRouteParams = {
        'user': 'hub_cap',
        'region': 'STAGING',
        'instanceId': '28d645bb-4c2f-459c-b695-50c3ae7b37e2'
    };

    var instance, rootStatus, users, databases;

    var populateScope = function (routeParams) {
        var scope;
        module('encore.ui');
        module('encore.svcs.cloud.config');
        module('databases');
        module('encore.svcs.cloud.dbaas');

        inject(function ($controller, $rootScope, $location, $q, DbaasDatabaseResource,
                DbaasInstanceResource, DbaasRootResource, DbaasUserResource, rxNotify) {
            q = $q;

            scope = $rootScope.$new();

            notifySvc = rxNotify;
            dbaasDatabaseResource = DbaasDatabaseResource;
            dbaasInstanceResource = DbaasInstanceResource;
            dbaasRootResource = DbaasRootResource;
            dbaasUserResource = DbaasUserResource;

            instance = {
                instance: {
                    region: 'STAGING',
                    status: 'ACTIVE',
                    name: 'testInstance',
                    id: '28d645bb-4c2f-459c-b695-50c3ae7b37e2',
                    volume: {
                        used: 7,
                        size: 15
                    }
                }
            };

            rootStatus = {
                root: {
                    rootEnabled: false
                }
            };

            users = {
                users: [{
                    'name': 'testuser',
                    'databases': [{ 'name': 'TestDB1' }, { 'name': 'TestDB2' }]
                }, {
                    'name': 'foouser',
                    'databases': [{ 'name': 'TestDB1' }, { 'name': 'TestDB2' }]
                }, {
                    'name': 'baruser',
                    'databases': [{ 'name': 'TestDB1' }, { 'name': 'TestDB3' }]
                }, {
                    'name': 'bazuser',
                    'databases': [{ 'name': 'TestDB1' }, { 'name': 'TestDB4' }]
                }]
            };

            databases = {
                databases: [{ 'name': 'TestDB1' }, { 'name': 'TestDB2' },
                            { 'name': 'TestDB3' }, { 'name': 'TestDB4' }]
            };

            helpers.resourceStub($q, dbaasInstanceResource, 'get', instance);
            helpers.resourceStub($q, dbaasRootResource, 'get', rootStatus);
            helpers.resourceStub($q, dbaasUserResource, 'get', users);
            helpers.resourceStub($q, dbaasDatabaseResource, 'get', databases);

            location = $location;
            ctrl = $controller('ShowInstanceCtrl', {
                $scope: scope,
                $location: location,
                $routeParams: routeParams,
                DbaasInstanceResource: dbaasInstanceResource,
                DbaasRootResource: dbaasRootResource,
                DbaasUserResource: dbaasUserResource,
                DbaasDatabaseResource: dbaasDatabaseResource
            });
        });
        return scope;
    };

    var isLoading = function (notification, text) {
        expect(notification.type).to.equal('info');
        expect(notification.loading).to.be.true;
        if (text) {
            expect(notification.text).to.contain(text);
        }
        return true;
    };
    var notification = {
        details: function () {
            return _.first(notifySvc.stacks.page);
        },
        root: function () {
            return _.find(notifySvc.stacks.page, { prop: 'loadingRootStatus' });
        },
        users: function () {
            return _.find(notifySvc.stacks.page, { prop: 'loadingUsers' });
        },
        databases: function () {
            return _.find(notifySvc.stacks.page, { prop: 'loadingDatabases' });
        }
    };

    describe('Loading Data', function () {
        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        it('should have an empty object for instance details & should be loading data', function () {
            expect(ctrl).to.exist;
            expect(scope.instance).to.be.empty;

            expect(isLoading(notification.details())).to.be.true;
        });

        it('should display notifications on errors', function () {
            expect(isLoading(notification.details())).to.be.true;

            instance.$deferred.reject({});
            scope.$digest();

            expect(scope.error.message).to.equal('Unknown error');
            expect(notifySvc.stacks.page).to.not.be.empty;
            expect(notification.details().type).to.eq('error');
            expect(notification.details().text).to.contain('Details');
        });

        it('should display warning if database is being provisioned', function () {
            expect(isLoading(notification.details())).to.be.true;
            instance.instance.status = 'BUILD';
            instance.$deferred.resolve(instance);
            scope.$digest();

            expect(notifySvc.stacks.page).to.not.be.empty;
            expect(notification.details().type).to.eq('warning');
            expect(notification.details().text).to.contain('provisioned');
        });

        it('should load other details once the instance details are loaded ', function () {
            expect(isLoading(notification.details())).to.be.true;

            instance.$deferred.resolve(instance);
            scope.$digest();

            expect(notifySvc.stacks.page).to.not.be.empty;

            expect(isLoading(notification.users()), 'Loading Users').to.be.true;
            expect(isLoading(notification.root()), 'Loading Root').to.be.true;
            expect(isLoading(notification.databases()), 'Loading Databases').to.be.true;
        });
    });

    describe('Loading Root Status', function () {
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            instance.$deferred.resolve(instance);
            scope.$digest();
        });

        it('should display notifications on errors', function () {
            expect(isLoading(notification.root())).to.be.true;
            rootStatus.$deferred.reject({
                message: 'No Root Status'
            });
            scope.$digest();

            expect(scope.error.message).to.equal('No Root Status');
            expect(notification.root().type).to.equal('error');
            expect(notification.root().text).to.contain('No Root Status');
        });

        it('should set rootEnabled to "No" if it\'s not enabled', function () {
            rootStatus.$deferred.resolve(rootStatus);
            scope.$digest();

            expect(scope.instance.rootEnabled).to.equal('No');
        });

        it('should set rootEnabled to "Yes" if it\'s not enabled', function () {
            rootStatus.root.rootEnabled = true;
            rootStatus.$deferred.resolve(rootStatus);
            scope.$digest();

            expect(scope.instance.rootEnabled).to.equal('Yes');
        });

        it('should calculate proper disk usage', function () {
            expect(scope.diskSpacePercent).to.equal(47);
        });

        it('should return 0 when calculating invalid disk usage', function () {
            scope.instance =  {
                    volume: {
                        used: undefined,
                        size: 15
                    }
                };
            scope.calcDiskSpace();
            expect(scope.diskSpacePercent).to.equal(0);
        });
    });

    describe('Loading Users', function () {
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            instance.$deferred.resolve(instance);
            scope.$digest();
        });

        it('should display notifications on errors', function () {
            expect(isLoading(notification.users())).to.be.true;
            users.$deferred.reject({
                message: 'No Users'
            });
            scope.$digest();

            expect(scope.error.message).to.equal('No Users');
            expect(notification.users().type).to.equal('error');
            expect(notification.users().text).to.contain('No Users');
        });

        it('should create a list of DBs for each user', function () {
            users.$deferred.resolve(users);
            scope.$digest();

            var user = _.first(users.users);

            expect(user.dbArray).to.not.be.empty;
            expect(user.dbList).to.not.be.empty;
            expect(_.first(user.dbArray)).to.equal('TestDB1');
            expect(user.dbList).to.contain('TestDB2');
        });
    });

    describe('Loading Databases', function () {
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            instance.$deferred.resolve(instance);
            scope.$digest();
        });

        it('should display notifications on errors', function () {
            expect(isLoading(notification.databases())).to.be.true;
            databases.$deferred.reject({
                message: 'No Databases'
            });
            scope.$digest();

            expect(scope.error.message).to.equal('No Databases');
            expect(notification.databases().type).to.equal('error');
            expect(notification.databases().text).to.contain('No Databases');
        });

        it('should load the list of databases', function () {
            databases.$deferred.resolve(databases);
            scope.$digest();

            var database = _.first(scope.instance.databases);

            expect(database).to.not.be.empty;
        });
    });

});

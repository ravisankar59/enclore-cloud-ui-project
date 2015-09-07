/* jshint node: true */
describe('CBS: CreateVolumeCtrl', function () {
    var ctrl, q, deferred, location, status, cloudRegionsUtil, httpBackend;

    var validRouteParams = {
        'user': 'hub_cap',
        'accountNumber': '323676'
    };

    var invalidRouteParams = {
        'user': 'bad_wolf',
        'accountNumber': '123'
    };

    var catalogResponse = {
        'endpoints': [
            {
                'region': 'ORD',
                'name': 'cloudFiles',
                'type': 'object-store',
                'id': 103,
            }, {
                'region': 'ORD',
                'name': 'cloudBlockStorage',
                'type': 'volume',
                'id': 122,
                'tenant_id': '323676'
            }
        ]
    };

    var hubCapRegions = [
        { 'name': 'ORD', 'type': 'volume' }
    ];

    var hubCapConvertedRegions = [{
            'label': 'ORD (Chicago)',
            'value': 'ORD'
        }, {
            'label': 'DFW (Dallas)',
            'value': 'DFW'
        }];

    var badWolfRegions = {
        'error': {
            'message': 'User: \'bad_wolf\' does not exist.'
        }
    };

    var populateScope = function (routeParams) {
        // routeParams = (typeof routeParams === 'undefined') ? validRouteParams : routeParams;
        var scope;

        module('encore');
        module('encore.ui');
        module('cbs');

        inject(function ($controller, $rootScope, $q, $location, Status, CloudRegionsUtil, $httpBackend) {
            scope = $rootScope.$new();
            q = $q;
            location = $location;
            httpBackend = $httpBackend;

            status = Status;
            cloudRegionsUtil = CloudRegionsUtil;

            sinon.spy(status, 'setStatus');
            sinon.spy(cloudRegionsUtil, 'loadDataForEachRegion');

            var regions = {
                getRegions: function (user, type) {
                    deferred = q.defer();

                    if (user === validRouteParams.user && type === 'Volumes') {
                        deferred.resolve(hubCapRegions);
                    } else if (user === invalidRouteParams.user && type === 'Volumes') {
                        deferred.reject(badWolfRegions);
                    } else {
                        deferred.reject();
                    }

                    return deferred.promise;
                },
                convert: function (regions) {
                    if (regions === hubCapRegions) {
                        return hubCapConvertedRegions;
                    }
                }
            };

            var volumeService = {
                create: function () {
                    return function () {
                        var deferred = q.defer();
                        deferred.resolve();
                            
                        return deferred.promise;
                    };
                }
            };

            $httpBackend.when('GET', '/api/cloud/users/hub_cap/service_catalog')
                .respond(catalogResponse, {});

            $httpBackend.when('GET', '/api/cloud/users/bad_wolf/service_catalog')
                .respond(catalogResponse, {});

            ctrl = $controller('CreateVolumeCtrl', {
                $scope: scope,
                $routeParams: routeParams,
                $location: location,
                CloudRegions: regions,
                VolumeService: volumeService,
                Status: status,
                CloudRegionsUtil: cloudRegionsUtil
            });

            scope.$apply();
            location = $location;
            location.path('323676/hub_cap/cbs/volumes/create');
        });

        return scope;
    };

    describe('Valid Username', function () {
        var scope;

        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        it('Ctrl should exist', function () {
            expect(ctrl).to.exist;
        });

        it('Will load regions for valid user on load', function () {
            expect(scope.user).to.be.equal('hub_cap');
            expect(scope.regions).to.deep.equal(hubCapConvertedRegions);
            expect(scope.request.region).to.be.equal('ORD');

            // Loading Message shown, but cleared with no error
            sinon.assert.calledOnce(status.setStatus);
        });

        it('Will call CloudRegionsUtil.loadDataForEachRegion to load snapshots`', function () {
            sinon.assert.called(cloudRegionsUtil.loadDataForEachRegion);
        });

        describe('Create Volume', function () {
            it('Will throw error after unsuccessful creation', function () {
                scope.sendCreateRequest();
                scope.$apply();

                // Add of Loading, Sending Creating, Volume Created Messages performed
                sinon.assert.calledTwice(status.setStatus);
            });
        });
    });

    describe('Invalid Username', function () {
        var scope;

        beforeEach(function () {
            scope = populateScope(invalidRouteParams);
        });

        it('Will throw error for invalid user on load', function () {
            expect(scope.user).to.be.equal('bad_wolf');

            // Loading Message shown, error occurred and displayed
            sinon.assert.calledTwice(status.setStatus);
        });
    });
});

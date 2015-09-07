/* jshint node: true */
describe('Controller: ListSnapshotsCtrl', function () {
    var rootScope, scope, ctrl, snapshotResource, cloudRegionsUtil;

    var validRouteParams = {
        'user': 'hub_cap',
        'accountNumber': 323676
    };

    beforeEach(function () {
        module('encore');
        module('encore.ui');
        module('cbs');
        module('encore.svcs.cloud.config');
        module('encore.svcs.cloud.cbs');

        inject(function ($controller, $rootScope, SnapshotResource, CloudRegionsUtil) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            snapshotResource = SnapshotResource;
            cloudRegionsUtil = CloudRegionsUtil;

            sinon.spy(cloudRegionsUtil, 'loadDataForEachRegion');

            ctrl = $controller('ListSnapshotsCtrl', {
                $scope: scope,
                $routeParams: validRouteParams
            });
        });
    });

    describe('Load snapshots', function () {
        it('should call CloudRegionsUtil.loadDataForEachRegion to load snapshots', function () {
            expect(ctrl).to.exist;
            scope.loadSnapshotDetails();
            sinon.assert.called(cloudRegionsUtil.loadDataForEachRegion);
        });

        it('should call CloudRegionsUtil.loadDataForEachRegion with correct params', function () {
            var params = {
                svc: snapshotResource.get,
                name: 'Snapshots',
                scopeProp: 'snapshots',
                user: 'hub_cap'
            };

            scope.loadSnapshotDetails();
            sinon.assert.calledWith(cloudRegionsUtil.loadDataForEachRegion, params);
        });
    });
});

/* jshint node: true */
describe('Controller: ShowSnapshotCtrl', function () {
    var rootScope, scope, ctrl, snapshotResource, volumeService, status, volumeResource;

    var validRouteParams = {
        'user': 'hub_cap',
        'accountNumber': 323676
    };

    beforeEach(function () {
        module('encore');
        module('encore.ui');
        module('encore.svcs.cloud.config');
        module('encore.svcs.cloud.cbs');
        module('cbs');

        inject(function ($controller, $rootScope, SnapshotResource, VolumeService, Status, VolumeResource) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            snapshotResource = SnapshotResource;
            volumeResource = VolumeResource;

            status = Status;
            volumeService = VolumeService;

            sinon.spy(snapshotResource, 'get');
            sinon.spy(snapshotResource, 'delete');
            sinon.spy(volumeService, 'create');

            ctrl = $controller('ShowSnapshotCtrl', {
                $scope: scope,
                $routeParams: validRouteParams
            });
        });
    });

    describe('SnapshotsResource.get', function () {

        it('should call SnapshotResource', function () {
            expect(ctrl).to.exist;
            scope.loadSnapshotDetails();
            sinon.assert.called(snapshotResource.get);
        });

        it('should make a call to delete snapshot', function () {
            scope.deleteSnapshot(scope, scope.user);
            sinon.assert.called(snapshotResource.delete);
        });

        it('should call VolumeService when creating a volume', function () {
            scope.createVolume(scope, scope.user);
            sinon.assert.calledOnce(volumeService.create);
        });
    });
});

describe('Controller: ListVolumesCtrl', function () {
    var rootScope, scope, ctrl, cloudRegionsUtil, volumeService, cloudRegionStatusUpdate;

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

        inject(function ($controller, $rootScope, CloudRegionsUtil, CloudRegionStatusUpdate, VolumeService) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            cloudRegionsUtil = CloudRegionsUtil;
            cloudRegionStatusUpdate = CloudRegionStatusUpdate;
            volumeService = VolumeService;

            sinon.spy(cloudRegionsUtil, 'loadDataForEachRegion');

            ctrl = $controller('ListVolumesCtrl', {
                $scope: scope,
                $routeParams: validRouteParams
            });
        });
    });

    it('should call CloudRegionsUtil when loading volumes', function () {
        expect(ctrl).to.exist;
        scope.loadVolumeDetails();
        sinon.assert.called(cloudRegionsUtil.loadDataForEachRegion);
    });

});

/* jshint node: true */
describe('Controller: ShowVolumeCtrl', function () {
    var rootScope, scope, params, ctrl;

    beforeEach(function () {
        module('encore');
        module('encore.ui');
        module('encore.svcs.cloud.config');
        module('encore.svcs.cloud.cbs');
        module('servers');
        module('cbs');

        params = {
            VolumeResource: {
                get: sinon.stub()
            },
            SnapshotResource: {
                get: sinon.stub()
            },
        };

        inject(function ($controller, $rootScope, $routeParams) {
            ctrl = $controller;
            rootScope = $rootScope;
            scope = $rootScope.$new();
            params.$scope = scope;
            params.$routeParams = $routeParams;
        });
    });

    describe('VolumeResource.get', function () {
        it('should call volume service', function () {
            ctrl('ShowVolumeCtrl', params);
            sinon.assert.calledOnce(params.VolumeResource.get);
        });

        it('should load attachment variable if they exist on volume', function () {
            var fakeResponse = {
                volume: {
                    id: 1,
                    attachments: [{
                        device: '/dev/xvdb',
                        volumeid: 'be0228c4-ed39-4b37-a7ad-027417cf0e38',
                        id: '1'
                    }]
                }
            };
            params.VolumeResource.get.callsArgWith(1, fakeResponse);

            ctrl('ShowVolumeCtrl', params);
            expect(scope.volume).to.exist;
            expect(scope.attachment).to.not.be.empty;
        });

        it('should load empty attachment variable if they do not exist on volume', function () {
            var fakeResponse = {
                volume: {
                    id: 1,
                    attachments: []
                }
            };
            params.VolumeResource.get.callsArgWith(1, fakeResponse);

            ctrl('ShowVolumeCtrl', params);
            expect(scope.volume).to.exist;
            expect(scope.attachment).to.be.empty;
        });
    });

    describe('SnapshotResource.get', function () {
        it('should call snapshot service', function () {
            ctrl('ShowVolumeCtrl', params);
            sinon.assert.calledOnce(params.SnapshotResource.get);
        });

        it('should set snapshots if they exist', function () {
            var fakeResponse = {
                snapshots: [
                    { id: '22f1ad21-9986-4cbb-bdb2-52ef73bf2024' },
                    { id: '3e6b32f5-b626-4a54-a401-41bdc4e60a60' }
                ]
            };

            params.SnapshotResource.get.callsArgWith(1, fakeResponse);

            ctrl('ShowVolumeCtrl', params);
            expect(scope.snapshots).to.not.be.empty;
        });

        it('should set snapshots if they exist', function () {
            var fakeResponse = {
                snapshots: [
                    { id: '22f1ad21-9986-4cbb-bdb2-52ef73bf2024' },
                    { id: '3e6b32f5-b626-4a54-a401-41bdc4e60a60' }
                ]
            };

            params.SnapshotResource.get.callsArgWith(1, fakeResponse);

            ctrl('ShowVolumeCtrl', params);
            expect(scope.snapshots).to.not.be.empty;
        });

        it('should set empty snapshot var if they do not exist', function () {
            var fakeResponse = {
                snapshots: []
            };

            params.SnapshotResource.get.callsArgWith(1, fakeResponse);

            ctrl('ShowVolumeCtrl', params);
            expect(scope.snapshots).to.be.empty;
        });
    });
});

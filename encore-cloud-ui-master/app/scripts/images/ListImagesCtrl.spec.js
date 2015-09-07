describe('Controller: ListImagesCtrl', function () {
    var ctrl, location, q, httpBackend, imageResource, imageService, firstGenSvc,
        notifySvc, interval, cloudUsersSvc, status;
    var validRouteParams = {
        'user': 'hub_cap',
        'accountNumber': '323676'
    };

    var rxBreadcrumbsSvcMock = {
        set: sinon.spy()
    };

    var nextGenResponse, firstGenResponse, deleteResponse, catalogWithFirstGenResponse, catalogWithoutFirstGenResponse;

    var populateScope = function (routeParams) {
        var scope;
        module('encore.ui');
        module('encore.svcs.cloud.config');
        module('images');

        inject(function ($controller, $rootScope, $location, $q, $httpBackend, $interval,
                ImageResource, ImageService, FirstGenServers, Status, CloudUsers, rxNotify) {
            httpBackend = $httpBackend;
            interval = $interval;
            q = $q;

            nextGenResponse = [{ id: 'image1', gen: 'Next', visibility: 'public' },
                               { id: 'image2', gen: 'Next', visibility: 'public' },
                               { id: 'image3', gen: 'Next', visibility: 'private' }];

            firstGenResponse = {
                images: [{
                    id: 'firstGenImage1',
                    name: 'FirstGImage1',
                    metadata: { 'image_type': 'base' },
                    gen: 'First',
                    visibility: 'public'
                }, {
                    id: 'firstGenImage2',
                    name: 'FirstGImage2',
                    metadata: { 'image_type': 'base' },
                    gen: 'First',
                    visibility: 'public'
                }, {
                    id: 'firstGenImage3',
                    name: 'FirstGImage3',
                    metadata: { 'image_type': 'base' },
                    gen: 'First',
                    visibility: 'private'
                }]
            };

            catalogWithoutFirstGenResponse = {
                endpoints: []
            };

            catalogWithFirstGenResponse = {
                endpoints: [{ id: 'firstGenImage1',
                              name: 'cloudServers',
                              publicUrl: 'https://servers.api.staging.us.ccp.rackspace.net/v1.0/firstGenImage1',
                              region: null,
                              tenantId: '123456',
                              type: 'compute'
                            }]
            };

            deleteResponse = {};

            scope = $rootScope.$new();

            notifySvc = rxNotify;
            imageResource = ImageResource;
            imageService = ImageService;
            firstGenSvc = FirstGenServers;
            cloudUsersSvc = CloudUsers;
            status = Status;
            sinon.spy(status, 'setLoading');

            helpers.resourceStub($q, imageResource, 'delete', deleteResponse);
            helpers.resourceStub($q, firstGenSvc, 'getImages', firstGenResponse);

            imageService.fetchNextGenImages = sinon.stub(ImageService, 'fetchNextGenImages', function () {
                var dataCallback = helpers.resourceAction($q, null, nextGenResponse);
                var data = dataCallback();
                data.$promise.catch(function (errors) {
                    scope.nextGenFailedRequestsContainer.failedRequests = errors;
                });
                return data.$promise;
            });

            location = $location;
            ctrl = $controller('ListImagesCtrl', {
                $scope: scope,
                $location: location,
                $routeParams: routeParams,
                rxBreadcrumbsSvc: rxBreadcrumbsSvcMock,
                ImageResource: imageResource,
                ImageService: imageService,
                FirstGenServers: firstGenSvc
            });
        });
        return scope;

    };

    describe('will load available images for given user', function () {
        var scope;
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            httpBackend.when('GET', '/api/cloud/users/hub_cap/service_catalog')
                .respond(catalogWithFirstGenResponse, {});
        });

        it('should have an empty list of images', function () {
            expect(ctrl).to.exist;
            expect(scope.images.length).to.eq(0);
        });

        it('should append NextGen images as it receives them', function () {
            expect(scope.images.length).to.eq(0);
            expect(scope.visibilityFilter.selected['image_type']).to.eql(['private']);

            nextGenResponse.$deferred.notify(nextGenResponse);
            scope.$digest();

            expect(scope.images.length).to.eq(3);
        });

        it('should append public images if there are no private', function () {
            expect(scope.visibilityFilter.selected['image_type']).to.eql(['private']);

            nextGenResponse.$deferred.resolve([]);
            scope.$digest();

            nextGenResponse.$deferred.resolve(nextGenResponse);
            scope.$digest();

            expect(scope.visibilityFilter.selected['image_type']).to.contain('public');
        });

        it('should set status when loading images', function () {
            scope.visibilityFilter.selected['image_type'].push('base');
            httpBackend.flush();

            firstGenResponse.$deferred.resolve(firstGenResponse);

            scope.$digest();
            sinon.assert.calledWith(status.setLoading, 'Loading FirstGen Images');
        });

        it('should append FirstGen images as it receives them', function () {
            expect(scope.images.length).to.eq(0);

            scope.visibilityFilter.selected['image_type'].push('base');
            httpBackend.flush();

            firstGenResponse.$deferred.resolve(firstGenResponse);
            scope.$digest();
            expect(scope.images.length).to.eq(3);
        });

        it('should display notifications on errors', function () {
            expect(scope.images.length).to.eq(0);

            scope.visibilityFilter.selected['image_type'] = ['public', 'base'];
            httpBackend.flush();

            nextGenResponse.$deferred.reject(['test', 'test3']);
            scope.$digest();
            expect(scope.images.length).to.eq(0);

            firstGenResponse.$deferred.reject({
                message: 'Error Message'
            });
            scope.$digest();

            expect(scope.images.length).to.eq(0);
            expect(notifySvc.stacks.page).to.not.be.empty;
            expect(_.first(notifySvc.stacks.page).type).to.eq('error');
        });
    });

    describe('FirstGen is not in user catalog', function () {
        var scope;
        beforeEach(function () {
            scope = populateScope(validRouteParams);
            httpBackend.when('GET', '/api/cloud/users/hub_cap/service_catalog')
                .respond(catalogWithoutFirstGenResponse, {});
        });

        it('should not load FirstGen images', function () {
            scope.$digest();
            sinon.assert.notCalled(firstGenSvc.getImages);
        });
    });
});

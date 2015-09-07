describe('Controller: ShowNextGenImageCtrl', function () {
    var scope, httpBackend, ctrl, q, location, imageResource, status, tableBoilerplate;

    var populateScope = function (routeParams) {
        var scope;
        module('encore.ui');
        module('encore.svcs.cloud.config');
        module('images');

        inject(function ($httpBackend, $controller, $rootScope, $q, $location,
                    ImageResource, Status, TableBoilerplate) {

            httpBackend = $httpBackend;
            scope = $rootScope.$new();
            q = $q;
            location = $location;
            imageResource = ImageResource;
            status = Status;
            tableBoilerplate = TableBoilerplate;

            httpBackend
                .whenGET('/api/cloud/users/hub_cap/glance/ORD/547a46bd-d913-4bf7-ac35-2f24f25f1b7a')
                .respond(200, {
                    'image': {
                        'size': 178749440,
                        'metadata': {
                            'image_type': 'snapshot',
                            'user_id': '295',
                            'base_image_ref': 'aab63bcf-89aa-440f-b0c7-c7a1c611914b'
                        },
                        'associated_server': null,
                        'region': 'ORD',
                        'name': 'test_image',
                        'id': '547a46bd-d913-4bf7-ac35-2f24f25f1b7a',
                        'status': 'active',
                        'instance_uuid': 'f2bfe0a2-ad18-43b6-8ee4-eba12e0d8281'
                    }
                });

            httpBackend
                .whenGET('/api/cloud/users/hub_cap/glance/ORD/111a46bd-d913-4bf7-ac35-2f24f25f1b7a')
                .respond(200, {
                    'image': {
                        'size': 178749440,
                        'metadata': {
                            'image_type': 'snapshot',
                            'user_id': '295',
                        },
                        'associated_server': null,
                        'region': 'ORD',
                        'name': 'public_test_image',
                        'id': '111a46bd-d913-4bf7-ac35-2f24f25f1b7a',
                        'status': 'active',
                        'instance_uuid': '222e0a2-ad18-43b6-8ee4-eba12e0d8281'
                    }
                });

            ctrl = $controller('ShowNextGenImageCtrl', {
                $scope: scope,
                $location: location,
                $routeParams: routeParams,
                $q: q,
                ImageResource: imageResource,
                Status: status,
                TableBoilerplate: tableBoilerplate
            });

            sinon.spy(imageResource, 'get');

        });
        return scope;
    };

    describe('nextgen image', function () {

        var validRouteParams = {
            'imageid': '547a46bd-d913-4bf7-ac35-2f24f25f1b7a',
            'user': 'hub_cap',
            'region': 'ORD',
            'accountNumber': '323676'
        };

        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        it('should load nextgen image', function () {
            var imageParams = {
                id: validRouteParams.imageid,
                region: validRouteParams.region,
                user: validRouteParams.user
            };

            expect(ctrl).to.exist;
            scope.loadImage();
            sinon.assert.calledWith(imageResource.get, imageParams);
        });

        it('should determine base ref image url', function () {
            httpBackend.flush();
            expect(scope.baseImage.url).to.eq('/cloud/323676/hub_cap/images/ORD/aab63bcf-89aa-440f-b0c7-c7a1c611914b');
        });
    });

    describe('nextgen image negative tests', function () {

        var validRouteParams = {
            'imageid': '111a46bd-d913-4bf7-ac35-2f24f25f1b7a',
            'user': 'hub_cap',
            'region': 'ORD',
            'accountNumber': '323676'
        };

        beforeEach(function () {
            scope = populateScope(validRouteParams);
        });

        it('should not determine base ref image url', function () {
            var imageParams = {
                id: validRouteParams.imageid,
                region: validRouteParams.region,
                user: validRouteParams.user
            };

            scope.loadImage();
            sinon.assert.calledWith(imageResource.get, imageParams);

            httpBackend.flush();
            expect(scope.baseImage).to.be.undefined;
        });

    });

});

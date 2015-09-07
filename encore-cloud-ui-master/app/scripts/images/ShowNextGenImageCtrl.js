/**
* @ngdoc controller
* @name ShowNextGenImageCtrl
* @requires $scope
* @requires $routeParams
* @requires ImageResource
* @requires rxPromiseNotifications
* @requires Status
* @requires TableBoilerplate
* @requires GetCloudURL
*/
angular.module('images')
    .controller('ShowNextGenImageCtrl', function ($scope, $routeParams, ImageResource, rxPromiseNotifications, Status,
        TableBoilerplate, GetCloudURL) {

        Status.setScope($scope);
        $scope.user = $routeParams.user;
        $scope.accountNumber = $routeParams.accountNumber;
        TableBoilerplate.setup($scope, { predicate: 'key', reverse: false });

        var svcParams = {
            id: $routeParams.imageid,
            region: $routeParams.region,
            user: $routeParams.user
        };

        var loadImage = function () {
            $scope.image = ImageResource.get(svcParams);

            $scope.image.$promise.then(function (data) {
                $scope.transformedMetadata = [];
                _.forEach(data.metadata, function (value, key) {
                    switch (key) {
                        case 'base_image_ref':
                            var url = GetCloudURL($routeParams.accountNumber, $routeParams.user).images +
                                '/' + $routeParams.region + '/' + value;
                            $scope.baseImage = {
                                value: value,
                                url: url
                            };
                            break;

                        default:
                            $scope.transformedMetadata.push({ key: key, value: value });
                    }
                });
            });

            rxPromiseNotifications.add($scope.image.$promise, {
                loading: 'Loading Image',
                error: 'Error loading Image: {{data.message || statusText}}'
            });
        };

        $scope.loadImage = loadImage;
        $scope.loadImage();
    });

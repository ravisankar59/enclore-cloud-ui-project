/**
* @ngdoc directive
* @name images.rxImageActions
*/
angular.module('images')
    .directive('rxImageActions', function ($location, $route, ImageResource, Status, rxPromiseNotifications) {
        return {
            restrict: 'E',
            scope: {
                user: '=',
                accountNumber: '=',
                image: '='
            },
            templateUrl: 'views/images/templates/image-actions.html',
            controller: function ($scope) {

                $scope.deleteImage = function (image) {

                    if (image.gen !== 'Next' || image.visibility !== 'private') {
                        Status.setError('Unable to delete Image: "${message}"', {
                            message: 'not Private or Next Gen Image'
                        }, { prop: 'deletingImage' });
                        return false;
                    }

                    var success = function () {
                        Status.setSuccessNext('Image: "' + image.name +
                            '" has been deleted. Please allow a few minutes for this change to take effect.');

                        var imagesPath = '/' + $scope.accountNumber + '/' + $scope.user + '/images';
                        if ($location.path() === imagesPath) {
                            $route.reload();
                        } else {
                            $location.path(imagesPath);
                        }
                    };

                    var deleteImage = ImageResource.delete({
                        id: image.id,
                        user: $scope.user,
                        region: image.region
                    }, success);

                    rxPromiseNotifications.add(deleteImage.$promise, {
                        loading: 'Deleting Image: "' + image.name + '"',
                        error: 'Error deleting Image: {{data.message || statusText}}'
                    });

                };
            }
        };
    });

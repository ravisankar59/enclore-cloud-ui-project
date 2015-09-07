/**
* @ngdoc directive
* @name images.rxFirstGenImageActions
*/
angular.module('images')
    .directive('rxFirstGenImageActions', function ($route, FirstGenServers, rxPromiseNotifications) {
        return {
            restrict: 'E',
            scope: {
                user: '=',
                account: '=',
                image: '=',
                postHook: '&'
            },
            templateUrl: 'views/images/templates/image-actions-firstgen.html',
            controller: function ($scope) {

                $scope.deleteFirstGenImage = function (image) {

                    var deleteImage = FirstGenServers.deleteImage({
                        user: $scope.user,
                        id: image.id
                    }, $scope.postHook);

                    rxPromiseNotifications.add(deleteImage.$promise, {
                        loading: 'Deleting Image: "' + image.name + '"',
                        success: 'Image: "' + image.name +
                            '" has been deleted. Please allow a few minutes for this change to take effect.',
                        error: 'Error deleting Image: {{data.message || statusText}}'
                    });
                };
            }
        };
    });

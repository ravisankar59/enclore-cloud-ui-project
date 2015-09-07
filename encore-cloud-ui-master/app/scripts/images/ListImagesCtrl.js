/**
* @ngdoc controller
* @name ListImagesCtrl
* @requires $scope
* @requires $routeParams
* @requires $q
* @requires Status
* @requires ImageService
* @requires FirstGenServers
* @requires ImageResource
* @requires rxStatusMappings
* @requires TableBoilerplate
* @requires CloudRegionStatusUpdate
* @requires CloudUsers
* @requires SelectFilter
*/
angular.module('images')
    .controller('ListImagesCtrl', function ($scope, $routeParams, $q,
        Status, ImageService, FirstGenServers, ImageResource, rxStatusMappings,
        TableBoilerplate, CloudRegionStatusUpdate, CloudUsers, SelectFilter) {

        Status.setScope($scope);

        $scope.user = $routeParams.user;
        $scope.accountNumber = $routeParams.accountNumber;

        $scope.images = [];
        $scope.nextGenFailedRequestsContainer = { failedRequests: [] };

        TableBoilerplate.setup($scope, { predicate: 'name', reverse: false });

        // Map Image statuses to one of: ACTIVE INFO WARNING ERROR PENDING
        rxStatusMappings.mapToError(['KILLED', 'DELETED', 'UNKNOWN'], 'images');
        rxStatusMappings.mapToPending(['SAVING', 'PENDING_DELETE'], 'images');
        rxStatusMappings.mapToWarning('DEACTIVATED', 'images');
        rxStatusMappings.mapToInfo('QUEUED', 'images');
        
        //Load status of each image type
        var imageLoadedStatus = {
            'public': false,
            'private': false,
            'shared': false,
            'base': false,
            'snapshot': false,
            isFirstGen: function (type) {
                return type === 'base' || type === 'snapshot';
            },
            setTypeLoaded: function (type) {
                this[type] = true;
            },
            setFirstGenLoaded: function () {
                this.base = true;
                this.snapshot = true;
            }
        };

        var appendImages = function (images) {
            $scope.images.push.apply($scope.images, images);
        };

        var loadNextGenImages = function (visibility) {
            var regionsStatus = CloudRegionStatusUpdate();

            imageLoadedStatus.setTypeLoaded(visibility);
            var promise = ImageService.fetchNextGenImages($scope.user,
                            visibility,
                            $scope.nextGenFailedRequestsContainer,
                            regionsStatus.buildRegionsCallback('Loading NextGen Images (${regionName})'))
                .then(
                null,
                null,
                function (imagesUpdate) {
                    appendImages(imagesUpdate);
                    return imagesUpdate;
                })
                .finally(function () {
                    Status.complete();
                    if (!_.isEmpty($scope.nextGenFailedRequestsContainer.failedRequests)) {
                        var badRegions = $scope.nextGenFailedRequestsContainer.failedRequests.join(', ');
                        var errorMsg = 'Error loading images: ' + badRegions;
                        Status.setError(errorMsg);
                    }
                });

            regionsStatus.promiseHandler(promise);

            return promise;
        };

        var loadFirstGenImages =  function () {
            Status.setLoading('Loading FirstGen Images', { prop: 'loadingFirstGenImages' });
            imageLoadedStatus.setFirstGenLoaded();
            var success = function (data) {
                var images = data.images;
                appendImages(images);
                Status.complete({ prop: 'loadingFirstGenImages' });
            };

            var failure = function (error) {
                Status.setError('Error loading FirstGen Images ${message}',
                        error, { prop: 'loadingFirstGenImages' });
            };

            return FirstGenServers.getImages({ user: $scope.user }, success, failure).$promise;

        };

        var loadDefaultImages = function () {
            //Load private images
            loadNextGenImages('private').then(function (images) {
                //If no private images, load public images instead
                if (_.isEmpty(images)) {
                    $scope.notify = Status.setWarning('No Private Images Found; Loading Public Images');
                    $scope.visibilityFilter.selected['image_type'].push('public');
                    loadNextGenImages('public').then(function () {
                        Status.dismiss($scope.notify);
                    });
                }
            });
        };

        $scope.visibilityFilter = SelectFilter.create({
            properties: ['image_type'],
            available: {
                'image_type': ['private', 'public', 'shared', 'base', 'snapshot']
            },
            selected: {
                'image_type': ['private']
            }
        });

        //Watch for any changes in the rxSelectFilter selected object
        $scope.$watchCollection('visibilityFilter.selected', function (newest) {
            //Loop through every selected type
            _.forEach(newest['image_type'], function (type) {
                //return if image type has already been loaded
                if (imageLoadedStatus[type]) {return;}
                //If type is First Gen check catalog and load First Gen images
                if (imageLoadedStatus.isFirstGen(type)) {
                    CloudUsers.catalog({ user: $scope.user }, function (data) {
                        var hasFirstGen = _.some(data.endpoints, { name: 'cloudServers' });
                        if (hasFirstGen) {
                            loadFirstGenImages();
                        }
                    });
                //Load Next Gen Image of type
                } else {
                    loadNextGenImages(type);
                }
            });
        });

        loadDefaultImages();
    });

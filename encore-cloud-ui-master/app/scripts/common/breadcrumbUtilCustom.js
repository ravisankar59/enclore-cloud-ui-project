angular.module('encore.svcs.cloud.common')
    .value('ROUTE_PATHS', {}).value('PRODUCT_VERSIONS')
    .factory('BreadcrumbUtilCustom', function ($route, $location, $routeParams, ROUTE_PATHS, PRODUCT_VERSIONS) {
        /* This function is taken directly from AngularJS, it lives in src/ngRoute/route.js. At this
         * time they don't expose an API to use it ourselves. Replace this if they ever expose it
         */

        // Save the regex so it gets re-used.
        var paramRegex = /(\w+)([^?]*)([?]?)/;
        function _interpolate (string, params) {
            var result = [];
            angular.forEach((string||'').split(':'), function (segment, i) {
                if (i === 0) {
                    result.push(segment);
                } else {
                    var segmentMatch = segment.match(paramRegex);
                    var key = segmentMatch[1];
                    // the third grouping detects whether or not the optional flag is there
                    var optional = segmentMatch[3] === '?';
                    // If optional and the parameter is not there, check the last segment and remove any trailing /
                    if (optional === true && !params.hasOwnProperty(key)) {
                        var lastSegment = result.pop();
                        if (_.last(lastSegment) === '/') {
                            lastSegment = lastSegment.substr(0, lastSegment.length - 1);
                        }
                        result.push(lastSegment);
                    } else { // Proceed as normal
                        result.push(params[key]);
                        result.push(segmentMatch[2] || '');
                    }
                    delete params[key];
                }
            });
            return result.join('');
        }

        var interpolate = function (uri) {
            return _interpolate(uri, _.clone($route.current.pathParams));
        };

        var parentDetails = function (parentName) {
            return ROUTE_PATHS[parentName];
        };

        var getParentStatus = function (parent) {
            return PRODUCT_VERSIONS[parent];
        };

        /**
         * @ngdoc function
         * @name nestedBreadCrumb
         * @param {string} details (of route_path), breadcrumbs (referencing current breadcrumbs),
         * and prefix (for setting up whole url) parameter
         * @description
         * Method is used to create nested breadcrumb, if there are more level of parent and child 
         * relationship betweeen route paths. This has nested method call if it finds the route_path has 
         * its parent, which will then displayed in appropriate order of breadcrumb.
         * @returns {array} breadcrumbs array  
         */
        var nestedBreadCrumb = function (details, breadcrumbs, prefix) {
            var _parentDetails = parentDetails(details.parent);
            var breadcrumb = {
                path: prefix + interpolate(_parentDetails.uri),
                name: (_parentDetails.pathName) ? _parentDetails.pathName : _parentDetails.detailName
            };
            var parentStatus = getParentStatus(_parentDetails.pathName);
            if (parentStatus) {
                breadcrumb.status = parentStatus;
            } else {
                breadcrumb.usePageStatusTag = true;
            }

            // The purpose if to add breadcrumb at 2nd level from bottom.
            if (breadcrumbs.length > 1) {
                breadcrumbs.splice(breadcrumbs.length - 1, 0, breadcrumb);
            } else {
                breadcrumbs.push(breadcrumb);
            }

            if (_.has(_parentDetails, 'parent')) {
                breadcrumbs = nestedBreadCrumb(_parentDetails, breadcrumbs, prefix);
            }
            return breadcrumbs;
        };

        return {
            setup: function (prefix) {
                var breadcrumbs, currentPath = $location.path();
                prefix = (prefix) ? '/' + prefix : '';

                _.forEach(ROUTE_PATHS, function (details) {
                    var path = interpolate(details.uri);
                    if (path === currentPath) {
                        breadcrumbs = [{
                            path: prefix + '/' + $routeParams.accountNumber + '/' + $routeParams.user,
                            name: 'User ' + $routeParams.user
                        }];

                        if (_.has(details, 'pathName')) {
                            breadcrumbs.push({ path: prefix + path, name: details.pathName, usePageStatusTag: true });
                        } else if (_.has(details, 'parent')) {
                            breadcrumbs = nestedBreadCrumb(details, breadcrumbs, prefix);
                        }

                        breadcrumbs.push({ name: details.detailName });
                        return false;
                    }
                });

                return breadcrumbs;
            }
        };

    });
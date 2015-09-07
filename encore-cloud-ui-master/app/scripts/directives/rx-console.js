/** 
* @ngdoc directive
* @name encore.rxConsole
* @requires $interpolate
*/
angular.module('rxConsole', [])
    .directive('rxConsole', function ($interpolate) {
        var appletTpl = '<applet archive="views/templates/VncViewer.jar" code="VncViewer.class">' +
                        '    <param value="{{ url }}" name="URL"></param>' +
                        '</applet>';

        return {
            restrict: 'E',
            templateUrl: 'views/templates/rx-console.html',
            scope: false,
            compile: function compile (el, attr) {
                return {
                    pre: function () {
                        // Let's compile the URL into the parameter before being added to the DOM
                        var applet = $interpolate(appletTpl)(attr);
                        // Let's convert it to an angular(jQLite) element to set attributes
                        applet = angular
                                    .element(applet)
                                    .attr('width', attr.width)
                                    .attr('height', attr.height);
                        // Append!
                        el.append(applet);
                    }
                };
            }
        };
    });


/*jshint camelcase: false*/
// camelcase needs to be ignored in this file because the API returns an object that
// has a property with an _ in it
angular.module('console', ['ngRoute', 'rxConsole'])
    .config(function ($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/servers/ShowServerConsole.html',
            controller: 'ShowNextGenConsoleCtrl'
        });
    })
    .controller('ShowNextGenConsoleCtrl', function ($scope, $location) {
        $scope.url = $location.search().url;
    });

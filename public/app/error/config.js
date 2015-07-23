var component = angular.module('error.config', ['ngRoute']);

component.config(function ($routeProvider) {
    $routeProvider
        .when('/error', {
            templateUrl: 'app/error/template.html'
        })
});

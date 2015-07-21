var component = angular.module('baseline.config', ['ngRoute']);

component.config(function ($routeProvider) {
    $routeProvider
        .when('/baseline', {
            templateUrl: 'app/baseline/template.html',
            controller: 'BaselineController',
            resolve: {}
        })
});
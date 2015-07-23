var component = angular.module('snapshot.config', ['ngRoute']);

component.config(function ($routeProvider) {
    $routeProvider
        .when('/snapshot/:name', {
            templateUrl: 'app/snapshot/template.html',
            controller: 'SnapshotController',
            resolve: {}
        })
});

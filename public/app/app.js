var app = angular.module('Scholar', [
    'baseline',
    'snapshot',
    'error'
]);

app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $routeProvider
        .when('/', {
            redirectTo: '/baseline'
        })
        .otherwise({
            redirectTo: '/error'
        });

    $locationProvider.html5Mode(false);
}]);

app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
}]);

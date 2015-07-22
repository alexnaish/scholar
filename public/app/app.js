var app = angular.module('Scholar', [
  'baseline'
]);

app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $routeProvider
        .when('/', {
            redirectTo: '/baseline'
        })

    $locationProvider.html5Mode(false);
}]);

app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
}]);

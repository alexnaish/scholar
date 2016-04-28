(function(app){

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


})(angular.module('Scholar', [
    'baseline',
    'snapshot',
    'user',
    'loader',
    'error',
    'ngAnimate'
]));

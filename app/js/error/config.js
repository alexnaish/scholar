(function(component) {
  component.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/error', {
        templateUrl: 'app/error/template.html'
      });
  }]);
})(angular.module('error.config', ['ngRoute']));

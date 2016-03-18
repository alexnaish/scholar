(function(component) {

  component.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/baseline', {
        templateUrl: 'app/baseline/template.html',
        controller: 'BaselineController',
        resolve: {}
      });
  }]);

})(angular.module('baseline.config', ['ngRoute']));

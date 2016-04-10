(function(component) {

  component.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/baseline', {
        templateUrl: 'app/baseline/list.html',
        controller: 'BaselineController as list',
        resolve: {}
      });
  }]);

})(angular.module('baseline.config', ['ngRoute']));

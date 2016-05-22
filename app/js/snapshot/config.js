(function(component) {

  component.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/snapshot/:name', {
        templateUrl: 'app/snapshot/template.html',
        controller: 'SnapshotController',
        authenticate: true,
        resolve: {}
      });
  }]);

})(angular.module('snapshot.config', ['ngRoute', 'toastr']));

(function (component) {

	component.config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/login', {
          templateUrl: 'app/authentication/auth.html',
          controller: 'AuthController as auth',
          resolve: {}
        });
    }]);

	component.run(['$rootScope', 'Authentication', '$location', function ($rootScope, Authentication, $location) {
		$rootScope.$on('$routeChangeStart', function (event, next, current) {
			var route = next.$$route;

			if(route.originalPath === '/login' && Authentication.isLoggedIn()) {
				event.preventDefault();
				return $location.path('/')
			}

			if(route.authenticate && !Authentication.isLoggedIn()) {
				event.preventDefault();
				var current = $location.path();
				$location.path('/login').search({returnTo: current});
			}
        });
	}]);

})(angular.module('authentication.config', ['ngRoute']));

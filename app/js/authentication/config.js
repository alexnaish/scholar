(function (component) {

	component.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
			.when('/login', {
				templateUrl: 'app/authentication/auth.html',
				controller: 'AuthController as auth',
				resolve: {}
			})
			.when('/logout', {
				resolve: {
					logout: ['Authentication', '$location', function (Authentication, $location) {
						Authentication.logout();
						$location.path('/login');
					}]
				}
			});
	}]);

	component.factory('authenticationInterceptor', ['$q', '$location', '$injector', function ($q, $location, $injector) {
		return {
			responseError: function (rejection) {
				if (rejection.status === 401) {
					$injector.get('Authentication').logout(rejection.data.error);
					$location.path("/login");
				}
				return $q.reject(rejection);
			}
		};
	}]);

	component.config(['$httpProvider', 'jwtInterceptorProvider', function ($httpProvider, jwtInterceptorProvider) {

		jwtInterceptorProvider.tokenGetter = ['config', 'Authentication', function (config, Authentication) {
			if (config.url.substr(0, 4) == '/api') {
				return Authentication.getRawToken();
			}
			return null
		}];

		$httpProvider.interceptors.push('authenticationInterceptor');
		$httpProvider.interceptors.push('jwtInterceptor');
	}]);

	component.run(['$rootScope', 'Authentication', '$location', function ($rootScope, Authentication, $location) {
		$rootScope.$on('$routeChangeStart', function (event, next, current) {
			var route = next.$$route;

			if (route.originalPath === '/login' && Authentication.isLoggedIn()) {
				event.preventDefault();
				return $location.path('/')
			}

			if (route.authenticate && !Authentication.isLoggedIn()) {
				event.preventDefault();
				var current = $location.path();
				$location.path('/login').search({
					returnTo: current
				});
			}
		});

	}]);

})(angular.module('authentication.config', ['ngRoute', 'angular-jwt']));

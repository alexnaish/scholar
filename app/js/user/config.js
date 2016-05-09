(function (component) {

	component.config(['$routeProvider', function ($routeProvider) {
		$routeProvider
			.when('/user', {
				templateUrl: 'app/user/list.html',
				controller: 'UserListController as list',
				bindToController: true,
				authenticate: true,
				resolve: {
					users: ['UserService', function (UserService) {
						return UserService.listUsers();
					}]
				}
			})
			.when('/user/:id', {
				templateUrl: 'app/user/manage.html',
				controller: 'UserController as ctrl',
				bindToController: true,
				authenticate: true,
				resolve: {
                    user: ['UserService', '$route', function (UserService, $route) {
						return UserService.fetchUser($route.current.params.id);
					}]
                }
			});
	}]);

})(angular.module('user.config', ['ngRoute']));

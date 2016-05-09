(function (component) {

	component.directive('requireLogin', ['Authentication', function (Authentication) {
		return {
			restrict: 'A',
			link: function ($scope, element, attrs) {
				element.addClass('hidden');

				$scope.$watch(
					Authentication.isLoggedIn,
					function (loggedIn) {
						element.toggleClass('hidden', !loggedIn);
					}
				);
			}
		}
	}]);

})(angular.module('authentication.directive', ['authentication.service']));

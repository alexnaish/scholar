(function (component) {

	component.controller('AuthController', ['Authentication', '$location', function (Authentication, $location) {
		var _activeForm = 'login';
		var vm = this;
		var query = $location.search();
		this.loginData = {};
		this.registerData = {};
		this.authReason = Authentication.reason;

		this.isActive = function (value) {
			return value === _activeForm;
		};

		this.checkPasswords = function () {
			vm.passwordError = vm.registerData.password !== vm.registerData.password2;
		}

		this.switchTo = function (value) {
			delete vm.error;
			vm.submissionDisabled = false;
			_activeForm = value;
		};

		this.submitLogin = function () {
			vm.submissionDisabled = true;
			clearReason();
			Authentication.login(this.loginData)
				.then(function (resp) {
					handleRedirect();
				})
				.catch(function (resp) {
					vm.error = resp.data.error;
				})
				.finally(function () {
					vm.submissionDisabled = false;
				});

		};

		this.submitRegistration = function () {
			vm.submissionDisabled = true;
			Authentication.register(this.registerData)
				.then(function (resp) {
					handleRedirect();
				})
				.catch(function (resp) {
					vm.error = resp.data.error;
				})
				.finally(function () {
					vm.submissionDisabled = false;
				});
		};

		function handleRedirect() {
			$location.search({});
			if (query.returnTo) {
				$location.path(query.returnTo);
			} else {
				$location.path('/');
			}
		}

		function clearReason () {
			Authentication.clearReason();
			delete vm.authReason;
		}

	}]);

})(angular.module('authentication.controller', ['authentication.service']));

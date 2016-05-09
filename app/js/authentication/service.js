(function (component) {

	component.service("Authentication", ['jwtHelper', '$window', '$http', function (jwtHelper, $window, $http) {
		var service = this;
		var tokenName = 'scholar-token';

		function getRawToken() {
			return $window.localStorage.getItem(tokenName);
		}

		var decodeToken = _.memoize(function (encodedToken) {
            var decodedToken;
            try {
                decodedToken = jwtHelper.decodeToken(encodedToken);
            } catch (e) {
                decodedToken = null;
            }
            return decodedToken;
        });

		this.login = function (credentials) {
            return $http.post('/api/user/token', credentials)
				.then(function(response){
					service.setToken(response.data.token);
					return response.data;
				});
        };

		this.register = function (userData) {
            return $http.post('/api/user', userData)
				.then(function(resp) {
					return service.login(userData);
				});
        };

		this.getToken = function () {
            var encodedToken = getRawToken();
            var decodedToken = decodeToken(encodedToken);

            if (encodedToken && !decodedToken) {
                service.logout();
            }

            return decodedToken;
        };

		this.isLoggedIn = function () {
			var localToken = getRawToken();
			var isExpired;
			try {
				isExpired = jwtHelper.isTokenExpired(localToken);
			} catch (e) {
				isExpired = true;
			}
			if (isExpired) {
				service.logout();
			}
			return !!localToken && !isExpired;
		};

		this.logout = function() {
			$window.localStorage.removeItem(tokenName);
		}

		this.getToken = function () {
            var encodedToken = getRawToken();
            var decodedToken = decodeToken(encodedToken);

            if (encodedToken && !decodedToken) {
                service.logout();
            }

            return decodedToken;
        }

		this.setToken = function(tokenValue) {
            $window.localStorage.setItem(tokenName, tokenValue);
        };
	}]);

})(angular.module('authentication.service', ['angular-jwt']));

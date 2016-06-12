(function (component) {

	component.service("Authentication", ['jwtHelper', '$window', '$http', function (jwtHelper, $window, $http) {
		var service = this;
		var tokenName = 'scholar-token';

		function generateCredentialsToken (credentialsObject) {
			function _generateMetadata(){
				//Set 15 second expiration time for token
				var metaData = {
					iss: document.location.hostname,
					exp: Date.now() + (15 * 1000)
				}
				return btoa(JSON.stringify(metaData));
			}

			var tokenComponents = [];
			tokenComponents.push(btoa(JSON.stringify(credentialsObject)));
			tokenComponents.push(_generateMetadata());
			tokenComponents.push(btoa(tokenComponents[0] + tokenComponents[1]));

			return tokenComponents.join('.');
		}

		this.getRawToken = function () {
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
			return $http.post('/api/user/token', {credentials: generateCredentialsToken(credentials)})
				.then(function (response) {
					service.setToken(response.data.token);
					return response.data;
				});
		};

		this.register = function (userData) {
			return $http.post('/api/user', userData)
				.then(function (resp) {
					return service.login(userData);
				});
		};

		this.getToken = function () {
			var encodedToken = service.getRawToken();
			var decodedToken = decodeToken(encodedToken);

			if (encodedToken && !decodedToken) {
				service.logout();
			}

			return decodedToken;
		};

		this.isLoggedIn = function () {
			var localToken = service.getRawToken();
			var isExpired;
			if (localToken) {
				try {
					isExpired = jwtHelper.isTokenExpired(localToken);
				} catch (e) {
					isExpired = true;
				}
				if (isExpired) {
					service.logout();
				}
			}

			return !!localToken && !isExpired;
		};

		this.logout = function (reasonMessage) {
			this.reason = reasonMessage;
			$window.localStorage.removeItem(tokenName);
		}

		this.setToken = function (tokenValue) {
			$window.localStorage.setItem(tokenName, tokenValue);
		}

		this.clearReason = function () {
			delete this.reason;
		}
	}]);

})(angular.module('authentication.service', []));

(function(component) {

  component.service("UserService", ['$http', function($http) {

    var service = {
      listUsers: function() {
        return $http.get('/api/user')
          .then(
            function(response) {
              return response.data;
            },
            function(httpError) {
              throw httpError.status + " : " + httpError.data.error;
            });
      },
      fetchUser: function(userId) {
        return $http.get('/api/user/' + userId)
          .then(
            function(response) {
              return response.data;
            },
            function(httpError) {
              throw httpError.status + " : " + httpError.data.error;
            });
      }
    };

    return service;

  }]);

})(angular.module('user.service', []));

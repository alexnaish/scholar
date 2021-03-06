(function(component) {

  component.service("SnapshotService", ['$http', function($http) {

    var service = {
      listDiffs: function(name) {
        return $http.get('/api/diff/' + name)
          .then(
            function(response) {
              return response.data;
            },
            function(httpError) {
              throw httpError.status + " : " + httpError.data;
            });
      },
      deleteSnapshot: function(name, diffId) {
        return $http.delete('/api/screenshot/' + name + '/diff/' + diffId)
          .then(
            function(response) {
              return response.data;
            },
            function(httpError) {
              throw httpError.status + " : " + httpError.data;
            });
      },
      promoteCandidate: function(name, candidateId) {
        return $http.put('/api/screenshot/' + name + '/promote/' + candidateId)
          .then(
            function(response) {
              return response.data;
            },
            function(httpError) {
              throw httpError.status + " : " + httpError.data;
            });
      }
    };

    return service;

  }]);


})(angular.module('snapshot.service', []));

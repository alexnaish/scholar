var component = angular.module('snapshot.service', []);

component.service("SnapshotService", ['$http', function ($http) {

    var service = {
        listDiffs: function (name) {
            return $http.get('/api/diff/' + name)
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (httpError) {
                        throw httpError.status + " : " + httpError.data;
                    });
        }
    };

    return service;

}]);

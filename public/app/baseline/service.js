var component = angular.module('baseline.service', []);

component.service("BaselineService", ['$http', function ($http) {

    var service = {
        listAllBaselines: function () {
            return $http.get('/api/baseline')
                .then(
                    function (response) {
                        return response.data;
                    },
                    function (httpError) {
                        throw httpError.status + " : " + httpError.data;
                    });
        },
        getOutstandingCandidates: function () {
            return $http.get('/api/candidate')
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
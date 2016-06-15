(function (component) {

    component.service("BaselineService", ['$http', function ($http) {

        return {
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

            fetchBaseline: function (name) {
                return $http.get('/api/baseline/' + name)
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

    }]);

})(angular.module('baseline.service', []));

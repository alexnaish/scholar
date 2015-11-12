var component = angular.module('baseline.controller', []);

component.controller("BaselineController", ['$scope', 'BaselineService', '$routeParams', function ($scope, BaselineService, $routeParams) {

    $scope.images = {};

    BaselineService.listAllBaselines().then(function (data) {
        $scope.baselines = data;
        data.forEach(function (item) {
            if ($routeParams.refresh === item.name) {
                $scope.images[item.name] = item.raw + '?' + new Date().getTime();
            } else {
                $scope.images[item.name] = item.raw;
            }
        });

    });

    $scope.filterByOutstanding = function (){
        BaselineService.getOutstandingCandidates().then(function(data){
            console.log('These are outstanding: ', data);
        });
    };

}]);

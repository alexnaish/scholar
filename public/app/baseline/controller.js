var component = angular.module('baseline.controller', []);

component.controller("BaselineController", ['$scope', 'BaselineService', '$routeParams', function ($scope, BaselineService, $routeParams) {

    $scope.images = {};
    var filteredByOutstanding = false;
    var outstandingCandidates = [];

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

    $scope.showOutstanding = function () {
        BaselineService.getOutstandingCandidates().then(function(data){
            filteredByOutstanding = true;
            outstandingCandidates = data;
        });
    };
    
    $scope.showAll = function () {
        filteredByOutstanding = false;
    };
    
    $scope.filterByOutstanding = function (baseline) {
        if(!filteredByOutstanding) return true;
        return outstandingCandidates.indexOf(baseline.name) !== -1;
    };

}]);

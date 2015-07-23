var component = angular.module('baseline.controller', []);

component.controller("BaselineController", ['$scope', 'BaselineService', function ($scope, BaselineService) {

    BaselineService.listAllBaselines().then(function (data) {
        $scope.baselines = data;
    });
}]);

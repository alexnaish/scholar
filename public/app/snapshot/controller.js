var component = angular.module('snapshot.controller', []);

component.controller("SnapshotController", ['$scope', 'SnapshotService', '$routeParams', function ($scope, SnapshotService, $routeParams) {
    $scope.emptyResult = true;
    $scope.name = $routeParams.name;
    SnapshotService.listDiffs($scope.name).then(function (data) {
        $scope.snapshots = data;
        if (data && data.length > 0) {
            $scope.emptyResult = false;
        }
    });

}]);

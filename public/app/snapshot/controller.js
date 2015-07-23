var component = angular.module('snapshot.controller', []);

component.controller("SnapshotController", ['$scope', 'SnapshotService', '$routeParams', function ($scope, SnapshotService, $routeParams) {

    $scope.name = $routeParams.name;
    SnapshotService.listDiffs($scope.name).then(function (data) {
        console.log('data', data);
        $scope.snapshots = data;
    });

}]);

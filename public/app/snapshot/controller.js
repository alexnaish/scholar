var component = angular.module('snapshot.controller', []);

component.controller("SnapshotController", ['$scope', 'SnapshotService', '$routeParams', '$location', '$timeout', function ($scope, SnapshotService, $routeParams, $location, $timeout) {
    $scope.name = $routeParams.name;
    $scope.baselined = false;
    SnapshotService.listDiffs($scope.name).then(function (data) {
        $scope.snapshots = data;
    });

    $scope.promoteCandidate = function (candidateId) {
        $scope.baselined = true;
        $scope.baselinedCandidate = candidateId;
        $timeout(function () {
            $location.path("/baseline");
        }, 1000);
    };

    $scope.baselinedCandidate = function (candidateId) {

        console.log('$scope.baselined', $scope.baselined);
        console.log('$scope.baselinedCandidate', $scope.baselinedCandidate);
        console.log($scope.baselined && $scope.baselinedCandidate === candidateId);
        return $scope.baselined && $scope.baselinedCandidate === candidateId;
    };

}]);

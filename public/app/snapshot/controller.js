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

        SnapshotService.promoteCandidate($scope.name, candidateId).then(function (data) {
            $timeout(function () {
                $location.url("/baseline?refresh=" + $scope.name);
            }, 1000);
        });

    };

    $scope.isHidden = function (candidateId) {
        return $scope.baselined && $scope.baselinedCandidate !== candidateId;
    };

}]);

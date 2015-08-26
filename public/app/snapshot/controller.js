var component = angular.module('snapshot.controller', []);

component.controller("SnapshotController", ['$scope', 'SnapshotService', '$routeParams', '$location', '$timeout', 'toastr',
    function ($scope, SnapshotService, $routeParams, $location, $timeout, toastr) {

    $scope.name = $routeParams.name;
    $scope.baselined = false;

    SnapshotService.listDiffs($scope.name).then(function (data) {
        $scope.snapshots = data;
    });

    $scope.promoteCandidate = function (candidateId) {
        $scope.baselined = true;
        $scope.baselinedCandidate = candidateId;

        SnapshotService.promoteCandidate($scope.name, candidateId).then(function () {
            $timeout(function () {
                $location.url("/baseline?refresh=" + $scope.name);
            }, 1000);
        });

    };

    $scope.removeSnapshot = function (diffId) {
        console.log('should send a del request which will clear down the candidate too', diffId);
        SnapshotService.deleteSnapshot($scope.name, diffId).then(function(){
            _.remove($scope.snapshots, '_id', diffId);
            toastr.info('Successfully removed candidate.', {
                timeOut: 5 * 1000,
                progressBar: true
            });
        });
    };

    $scope.isHidden = function (candidateId) {
        return $scope.baselined && $scope.baselinedCandidate !== candidateId;
    };

}]);

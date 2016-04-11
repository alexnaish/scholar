(function(component) {
  component.controller("SnapshotController", ['$scope', 'SnapshotService', '$routeParams', '$location', '$timeout', 'toastr',
    function($scope, SnapshotService, $routeParams, $location, $timeout, toastr) {

      $scope.name = $routeParams.name;
      $scope.baselined = false;

      SnapshotService.listDiffs($scope.name).then(function(data) {
        $scope.snapshots = data;
      });

      $scope.promoteCandidate = function(candidateId) {
        $scope.baselined = true;
        $scope.baselinedCandidate = candidateId;

        SnapshotService.promoteCandidate($scope.name, candidateId).then(function() {
          $timeout(function() {
            $location.url("/baseline?refresh=" + $scope.name);
          }, 1000);
        });

      };

      $scope.removeSnapshot = function(diffId) {
        SnapshotService.deleteSnapshot($scope.name, diffId).then(function() {
          _.remove($scope.snapshots, {
            _id: diffId
          });
          toastr.info('Successfully removed candidate.', {
            timeOut: 5 * 1000,
            progressBar: true
          });
        });
      };

      $scope.isHidden = function(candidateId) {
        return $scope.baselined && $scope.baselinedCandidate !== candidateId;
      };

    }
  ]);

})(angular.module('snapshot.controller', []));
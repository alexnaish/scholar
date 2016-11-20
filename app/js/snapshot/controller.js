(function (component) {
	component.controller("SnapshotController", ['$scope', 'SnapshotService', '$routeParams', '$location', '$timeout', 'toastr',
		function ($scope, SnapshotService, $routeParams, $location, $timeout, toastr) {

			$scope.name = $routeParams.name;
			$scope.baselined = false;

			SnapshotService.listDiffs($scope.name).then(function (data) {
				$scope.snapshots = data;
			});

			$scope.promoteCandidate = function (snapshot) {
                var browser = snapshot.meta.browser;
                SnapshotService.promoteCandidate($scope.name, snapshot.candidate).then(function () {
                    toastr.info('Baselining: ' + browser, {
                      timeOut: 5 * 1000,
                      progressBar: false
                    });
                    $scope.snapshots = $scope.snapshots.filter(function(snapshot){
						return snapshot.meta.browser !== browser;
					});
                    if($scope.snapshots.length === 0) {
                        toastr.info('Returning to Baselines list.', {
                          timeOut: 2 * 1000,
                          progressBar: true
                        });
                        $timeout(function () {
                            $location.url("/baseline?refresh=" + $scope.name);
                        }, 2000);
                    }
				});
			};

			$scope.removeSnapshot = function (snapshot) {
				SnapshotService.deleteSnapshot($scope.name, snapshot._id).then(function () {
					_.remove($scope.snapshots, {
						_id: snapshot._id
					});
					toastr.info('Successfully removed candidate.', {
						timeOut: 5 * 1000,
						progressBar: false
					});
				});
			};

		}
	]);

})(angular.module('snapshot.controller', []));

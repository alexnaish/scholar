(function (component) {

	component.controller("BaselineController", ['BaselineService', '$routeParams', function (BaselineService, $routeParams) {

		var vm = this;
        vm.filtering = false;
		var baselines = [];
		vm.images = {};

		BaselineService.listAllBaselines().then(function (data) {
			baselines = data;
			vm.baselines = baselines;
			data.forEach(function (item) {
				if ($routeParams.refresh === item.name) {
					vm.images[item.name] = item.raw + '?' + new Date().getTime();
				} else {
					vm.images[item.name] = item.raw;
				}
			});
		});

		vm.showOutstanding = function () {
            vm.filtering = true;
			BaselineService.getOutstandingCandidates().then(function (outstandingCandidates) {
				vm.baselines = _.filter(baselines, function (baseline) {
					return outstandingCandidates.indexOf(baseline.name) !== -1;
				})
			});
		};

		vm.showAll = function () {
            vm.filtering = false;
			vm.baselines = baselines;
		};

	}]);

})(angular.module('baseline.controller', []));

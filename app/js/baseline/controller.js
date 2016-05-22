(function(component) {

  component.controller("BaselineController", ['BaselineService', '$routeParams', function(BaselineService, $routeParams) {

    var vm = this;
    vm.images = {};
    var filteredByOutstanding = false;
    var outstandingCandidates = [];

    BaselineService.listAllBaselines().then(function(data) {
      vm.baselines = data;
      data.forEach(function(item) {
        if ($routeParams.refresh === item.name) {
          vm.images[item.name] = item.raw + '?' + new Date().getTime();
        } else {
          vm.images[item.name] = item.raw;
        }
      });
    });

    vm.showOutstanding = function() {
      BaselineService.getOutstandingCandidates().then(function(data) {
        filteredByOutstanding = true;
        outstandingCandidates = data;
      });
    };

    vm.showAll = function() {
      filteredByOutstanding = false;
    };

    vm.filterByOutstanding = function(baseline) {
      if (!filteredByOutstanding) return true;
      return outstandingCandidates.indexOf(baseline.name) !== -1;
    };

  }]);

})(angular.module('baseline.controller', []));

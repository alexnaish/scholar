(function (component) {

    component.controller('ListBaselineController', ['BaselineService', 'baselines', function (BaselineService, baselines) {

        var vm = this;
        vm.filtering = false;
        vm.baselines = baselines;

        vm.showOutstanding = function () {
            vm.filtering = true;
            BaselineService.getOutstandingCandidates().then(function (outstandingCandidates) {
                vm.baselines = _.filter(baselines, function (baseline) {
                    return outstandingCandidates.indexOf(baseline._id) !== -1;
                })
            });
        };

        vm.showAll = function () {
            vm.filtering = false;
            vm.baselines = baselines;
        };

        vm.getBrowsers = function (baseline) {
            return baseline.results.map(function (res) {
                return res.browser + ' (' + res.resolution + ')';
            }).join(', ');
        };

        vm.getLabels = function (baseline) {
            var labels = baseline.results.map(function (res) {
                return res.labels.join(', ');
            });
            return _.uniq(labels).join(', ');
        };

    }]);

    component.controller('ViewBaselineController', ['results', '$routeParams', function (results, $routeParams) {

        this.name = $routeParams.name;
        this.results = results;

    }]);



})(angular.module('baseline.controller', []));

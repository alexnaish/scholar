(function (component) {

    component.controller('ListBaselineController', ['BaselineService', 'baselines', 'outstandingCandidates', function (BaselineService, baselines, outstandingCandidates) {

        var vm = this;
        vm.baselines = baselines;

        if (outstandingCandidates.length > 0) {
            filterBaselines(outstandingCandidates);
        }

        function filterBaselines(outstandingCandidates) {
            vm.filtering = true;

            vm.baselines = _.filter(baselines, function (baseline) {
                return outstandingCandidates.indexOf(baseline._id) !== -1;
            });

        }

        vm.showOutstanding = function () {
            BaselineService.getOutstandingCandidates().then(function (candidates) {
                filterBaselines(candidates);
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

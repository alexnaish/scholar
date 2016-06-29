(function (component) {

    component.controller('ListBaselineController', ['BaselineService', 'baselines', 'outstandingCandidates', '$filter', function (BaselineService, baselines, outstandingCandidates, $filter) {

        var vm = this;
        vm.filters = [];

        vm.filtering = false;
        vm.outstandingFilter = false;
        vm.labelFilters = {};
        vm.nameFilter = '';

        vm.baselines = baselines;
        vm.outstandingCandidates = outstandingCandidates;

        vm.filter = function () {
            vm.baselines = $filter('filter')(baselines, function (baseline) {
                var res = requiredChecks.map(function (fn) {
                    return fn(baseline);
                });
                return _.every(res, function (result) {
                    return result;
                });

            });
        };

        vm.updateFilters = function updateFilters() {
            vm.filtering = false;
            vm.filters = [];
            if (vm.outstandingFilter) {
                vm.filters.push('Outstanding Only');
            }
            if (vm.nameFilter) {
                vm.filters.push('Name: ' + vm.nameFilter);
            }
            angular.forEach(vm.labelFilters, function (value, key) {
                vm.filters.push('Label: ' + key);
            });

            if (vm.filters.length > 0) {
                vm.filtering = true;
            }
            vm.filter();
        };

        var requiredChecks = [];
        requiredChecks.push(function isOutstanding(baseline) {
            if (vm.outstandingFilter) {
                return vm.outstandingCandidates.indexOf(baseline._id) !== -1;
            }
            return true;
        });
        requiredChecks.push(function matchesName(baseline) {
            if (vm.nameFilter) {
                return baseline._id.indexOf(vm.nameFilter) !== -1;
            }
            return true;
        });
        requiredChecks.push(function hasLabels(baseline) {
            var labels = Object.keys(vm.labelFilters);
            if (labels.length > 0) {
                return _.every(labels.map(function (label) {
                    return baseline.labels.indexOf(label) !== -1;
                }), function (res) {
                    return res
                });
            }
            return true;
        });

        if (outstandingCandidates.length > 0) {
            vm.outstandingFilter = true;
            vm.updateFilters();
        }



        vm.showOutstanding = function () {
            BaselineService.getOutstandingCandidates().then(function (candidates) {
                vm.outstandingCandidates = candidates;
                vm.outstandingFilter = true;
                vm.updateFilters();
            });
        };

        vm.showAll = function () {
            vm.outstandingFilter = false;
            vm.updateFilters();
        };

        vm.getBrowsers = function (baseline) {
            return baseline.results.map(function (res) {
                return res.browser + ' (' + res.resolution || 'N/A' + ')';
            }).join(', ');
        };

        vm.toggleLabelToFilter = function (label) {
            if(vm.labelFilters[label]) {
                delete vm.labelFilters[label];
            } else {
                vm.labelFilters[label] = true;
            }
            vm.updateFilters();
        };



    }]);

    component.controller('ViewBaselineController', ['BaselineService', 'results', '$routeParams', '$location', 'toastr', function (BaselineService, results, $routeParams, $location, toastr) {

        var vm = this;
        vm.name = $routeParams.name;
        vm.results = results;

        vm.remove = function (screenshot) {
            BaselineService.deleteScreenshot(screenshot).then(function (res) {
                vm.results = _.reject(vm.results, {_id: screenshot._id});
                toastr.info('Successfully removed Screenshot.', {
                    timeOut: 5 * 1000,
                    progressBar: true
                });


                if (vm.results.length === 0) {
                    $location.url('/baseline');
                }

            });

        }

    }]);


})(angular.module('baseline.controller', []));

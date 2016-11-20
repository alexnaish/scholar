(function (component) {

    component.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/baseline', {
                templateUrl: 'app/baseline/list.html',
                controller: 'ListBaselineController as list',
                authenticate: true,
                resolve: {
                    baselines: ['BaselineService', function (BaselineService) {
                        return BaselineService.listAllBaselines();
                    }],
                    outstandingCandidates: ['BaselineService', function (BaselineService) {
                        return BaselineService.getOutstandingCandidates();
                    }],
                    preAppliedTags: ['$location', function ($location) {
                        var params = $location.search();
                        var tags = [];
                        if(Array.isArray(params.tag)){
                          tags = tags.concat(params.tag);
                        } else if(params.tag) {
                          tags.push(params.tag);
                        }
                        return tags;
                    }]
                }
            })
            .when('/baseline/:name', {
                templateUrl: 'app/baseline/view.html',
                controller: 'ViewBaselineController as baseline',
                authenticate: true,
                resolve: {
                    results: ['BaselineService', '$route', function (BaselineService, $route) {
                        return BaselineService.fetchBaseline($route.current.params.name);
                    }]
                }
            });
    }]);

})(angular.module('baseline.config', ['ngRoute']));

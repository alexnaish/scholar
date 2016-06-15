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

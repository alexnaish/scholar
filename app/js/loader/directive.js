(function (component) {

    component.directive('loader', function () {
        return {
            restrict: 'E',
            controller: 'LoaderController',
            bindToController: true,
            controllerAs: 'ctrl',
            templateUrl: 'app/loader/template.html'
        };
    });

    component.controller('LoaderController', ['$rootScope', function ($rootScope) {

        var instance = this;
        instance.displayed = true;

        $rootScope.$on('$routeChangeStart', function () {
            instance.displayed = true;
        });
        $rootScope.$on('$routeChangeSuccess', function () {
            instance.displayed = false;
        });

        $rootScope.$on('$routeChangeError', function () {
            instance.displayed = false;
        });
    }]);

})(angular.module('loader', []));

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

    component.controller('LoaderController', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

        var instance = this;
        instance.displayed = true;

        $rootScope.$on('$routeChangeStart', function () {
            instance.displayed = true;
            $timeout(function () {
                if(instance.displayed) instance.displayed = false;
            }, 8 * 1000);
        });
        $rootScope.$on('$routeChangeSuccess', function () {
            instance.displayed = false;
        });

        $rootScope.$on('$routeChangeError', function () {
            instance.displayed = false;
        });
    }]);

})(angular.module('loader', []));

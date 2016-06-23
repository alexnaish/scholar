(function (component) {

    component.directive('tag', function () {
        return {
            restrict: 'E',
            controller: angular.noop,
            replace: true,
            bindToController: true,
            controllerAs: 'ctrl',
            templateUrl: 'app/tag/template.html',
            scope: {
                value: '='
            }
        };
    });

})(angular.module('loader', []));

(function (component) {

    component.directive('userDropdown', function () {
        return {
            restrict: 'E',
            controller: 'UserDropdownController',
            bindToController: true,
            controllerAs: 'user',
            templateUrl: 'app/user-dropdown/template.html'
        };
    });

    component.controller('UserDropdownController', ['Authentication', '$scope', function (Authentication, $scope) {

        var vm = this;

        $scope.$watch(
            Authentication.isLoggedIn,
            function (loggedIn) {
                vm.loggedIn = loggedIn;
                if(loggedIn) {
                    vm.profile = Authentication.getToken().user;
                    console.log("vm.profile", vm.profile); 
                    if(!vm.profile.avatar) vm.profile.avatar = '/api/user/' + vm.profile._id + '/avatar';
                } else {
                    delete this.profile;
                }
            }
        );

    }]);

})(angular.module('user-dropdown', ['authentication']));

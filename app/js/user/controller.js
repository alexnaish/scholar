(function(component) {

  component.controller("UserListController", ['users', function(users) {
    var vm = this;
    vm.users = users;
  }]);

  component.controller("UserController", ['user', function(user) {
    var vm = this;
    vm.user = user;
  }]);

})(angular.module('user.controller', []));

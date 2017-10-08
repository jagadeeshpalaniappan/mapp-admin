(function () {
  'use strict';

  angular
    .module('root.microapps.admin')
    .controller('MicroAppsAdminController', MicroAppsAdminController);

  MicroAppsAdminController.$inject = ['$scope', '$state', '$window', 'microAppResolve', 'Authentication', 'Notification'];

  function MicroAppsAdminController($scope, $state, $window, microApp, Authentication, Notification) {
    var vm = this;

    vm.microApp = microApp;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing MicroApp
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.microApp.$remove(function() {
          $state.go('admin.microapps.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> MicroApp deleted successfully!' });
        });
      }
    }

    // Save MicroApp
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.articleForm');
        return false;
      }

      // Create a new microApp, or update the current instance
      vm.microApp.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.microapps.list'); // should we send the User to the list or the updated MicroApp's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> MicroApp saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> MicroApp save error!' });
      }
    }
  }
}());

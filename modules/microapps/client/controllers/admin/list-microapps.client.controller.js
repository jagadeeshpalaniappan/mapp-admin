(function () {
  'use strict';

  angular
    .module('root.microapps.admin')
    .controller('MicroAppsAdminListController', MicroAppsAdminListController);

  MicroAppsAdminListController.$inject = ['MicroAppsService'];

  function MicroAppsAdminListController(MicroAppsService) {
    var vm = this;

    vm.microapps = MicroAppsService.query();
  }
}());

(function () {
  'use strict';

  angular
    .module('root.microapps')
    .controller('MicroAppsListController', MicroAppsListController);

  MicroAppsListController.$inject = ['MicroAppsService'];

  function MicroAppsListController(MicroAppsService) {
    var vm = this;

    vm.microapps = MicroAppsService.query();
  }
}());

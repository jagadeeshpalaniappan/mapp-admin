(function () {
  'use strict';

  angular
    .module('root.microapps')
    .controller('MicroAppsController', MicroAppsController);

  MicroAppsController.$inject = ['$scope', 'microAppResolve', 'Authentication'];

  function MicroAppsController($scope, microapp, Authentication) {
    var vm = this;

    vm.microApp = microapp;
    vm.authentication = Authentication;

  }
}());

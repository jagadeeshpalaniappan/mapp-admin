(function () {
  'use strict';

  // Configuring the MicroApps Admin module
  angular
    .module('root.microapps.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Micro Apps',
      state: 'admin.microapps.list'
    });
  }
}());

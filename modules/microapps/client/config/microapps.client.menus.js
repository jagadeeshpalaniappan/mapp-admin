(function () {
  'use strict';

  angular
    .module('root.microapps')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Micro Apps',
      state: 'microapps',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'microapps', {
      title: 'List Micro Apps',
      state: 'microapps.list',
      roles: ['*']
    });
  }
}());

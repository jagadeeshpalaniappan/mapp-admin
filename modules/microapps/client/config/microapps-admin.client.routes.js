(function () {
  'use strict';

  angular
    .module('root.microapps.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.microapps', {
        abstract: true,
        url: '/microapps',
        template: '<ui-view/>'
      })
      .state('admin.microapps.list', {
        url: '',
        templateUrl: '/modules/microapps/client/views/admin/list-microapps.client.view.html',
        controller: 'MicroAppsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.microapps.create', {
        url: '/create',
        templateUrl: '/modules/microapps/client/views/admin/form-microapp.client.view.html',
        controller: 'MicroAppsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          microAppResolve: newArticle
        }
      })
      .state('admin.microapps.edit', {
        url: '/:microAppId/edit',
        templateUrl: '/modules/microapps/client/views/admin/form-microapp.client.view.html',
        controller: 'MicroAppsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          microAppResolve: getArticle
        }
      });
  }

  getArticle.$inject = ['$stateParams', 'MicroAppsService'];

  function getArticle($stateParams, MicroAppsService) {
    return MicroAppsService.get({
      microAppId: $stateParams.microAppId
    }).$promise;
  }

  newArticle.$inject = ['MicroAppsService'];

  function newArticle(MicroAppsService) {
    return new MicroAppsService();
  }
}());

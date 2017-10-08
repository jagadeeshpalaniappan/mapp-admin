(function () {
  'use strict';

  angular
    .module('root.microapps.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('microapps', {
        abstract: true,
        url: '/microapps',
        template: '<ui-view/>',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('microapps.list', {
        url: '',
        templateUrl: '/modules/microapps/client/views/list-microapps.client.view.html',
        controller: 'MicroAppsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Micro Apps List'
        }
      })
      .state('microapps.view', {
        url: '/:microAppId',
        templateUrl: '/modules/microapps/client/views/view-microapps.client.view.html',
        controller: 'MicroAppsController',
        controllerAs: 'vm',
        resolve: {
          microAppResolve: getArticle
        },
        data: {
          pageTitle: 'Micro Apps {{ microAppResolve.title }}'
        }
      });
  }

  getArticle.$inject = ['$stateParams', 'MicroAppsService'];

  function getArticle($stateParams, MicroAppsService) {
    return MicroAppsService.get({
      microAppId: $stateParams.microAppId
    }).$promise;
  }
}());

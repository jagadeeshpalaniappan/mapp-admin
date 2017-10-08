(function () {
  'use strict';

  angular
    .module('root.microapps.services')
    .factory('MicroAppsService', MicroAppsService);

  MicroAppsService.$inject = ['$resource', '$log'];

  function MicroAppsService($resource, $log) {
    var MicroApp = $resource('/api/microapps/:microAppId', {
      microAppId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(MicroApp.prototype, {
      createOrUpdate: function () {
        var microapp = this;
        return createOrUpdate(microapp);
      }
    });

    return MicroApp;

    function createOrUpdate(microapp) {
      if (microapp._id) {
        return microapp.$update(onSuccess, onError);
      } else {
        return microapp.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(microapp) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());

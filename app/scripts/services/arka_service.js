'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.arkaService
 * @description
 * # arkaService
 * Factory in the financieraClienteApp.
 */
angular.module('arkaService', [])
  .factory('arkaRequest', function($http) {
    // Service logic
    // ...
    var path = "http://10.20.0.254/arka_api_crud/v1/";
    // Public API here
    return {
      get: function(tabla, params) {
        return $http.get(path + tabla + "/?" + params);
      },
      post: function(tabla, elemento) {
        return $http.post(path + tabla, elemento);
      },
      put: function(tabla, id, elemento) {
        return $http.put(path + tabla + "/" + id, elemento);
      },
      delete: function(tabla, id) {
        return $http.delete(path + tabla + "/" + id);
      }
    };
  });

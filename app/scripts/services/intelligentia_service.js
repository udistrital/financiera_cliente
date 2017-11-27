'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.intelligentiaService
 * @description
 * # intelligentiaService
 * Service in the financieraClienteApp.
 */
angular.module('financieraClienteApp')
  .service('intelligentiaService', function ($http) {

    var path = "http:s//";

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
    }
  });

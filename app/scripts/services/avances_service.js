'use strict';

/**
 * @ngdoc service
 * @name nixApp.avancesService
 * @description
 * # avancesService
 * Factory in the nixApp.
 */
angular.module('avancesService',[])
  .factory('avancesRequest', function ($http) {
    return {
      get: function(tabla, params) {
        if (params === "") {
          return $http.get(tabla);
        }else {
          return $http.get(tabla + "/?" + params);
        }

      },
      post: function(tabla, elemento) {
        return $http.post(tabla, elemento);
      },
      put: function(tabla, elemento) {
        return $http.put(tabla, elemento);
      },
      delete: function(tabla, id) {
        return $http.delete(tabla + "/" + id);
      }
    };
  });

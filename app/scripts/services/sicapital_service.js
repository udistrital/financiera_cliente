'use strict';

/**
 * @ngdoc service
 * @name nixApp.sicapitalService
 * @description
 * # sicapitalService
 * Factory in the nixApp.
 */
angular.module('nixApp')
  .factory('sicapitalRequest', function($http, CONF) {
    return {
      get: function(info) {
        console.log(info);
        return $http.get(info, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        });
      },
      post: function(tabla, elemento) {
        //se realiza definicion de post con formato header, para resolucion del problema post
        return $http.post(CONF.HOST_SERVICE_SIC + tabla, elemento, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          }
        });
      },
      put: function(tabla, id, elemento) {
        return $http.put(CONF.HOST_SERVICE_SIC + tabla + "/" + id, elemento);
      },
      delete: function(tabla, id) {
        return $http.delete(CONF.HOST_SERVICE_SIC + tabla + "/" + id);
      }
    };
  });

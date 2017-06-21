'use strict';

/**
 * @ngdoc overview
 * @name financieraService
 * @description
 * # financieraService
 *
 * Service module of the application.
 */
angular.module('financieraService', [])

  /**
   * @ngdoc service
   * @name financieraService.service:financieraRequest
   * @requires $http
   * @param {injector} $http componente http de angular
   * @description
   * # financieraService
   * Fabrica sobre la cual se consumen los servicios proveidos por el API de financiera sobre los metodos GET, POST, PUT y DELETE
   */
  .factory('financieraRequest', function($http) {

    var path = "http://10.20.0.254/financiera_api/v1/";
    //var path = "http://127.0.0.1:8084/v1/";       //path local para el desarrollo

    // Public API here
    return {
      /**
       * @ngdoc function
       * @name financieraService.service:financieraRequest#get
       * @methodOf financieraService.service:financieraRequest
       * @param {string} tabla Nombre de la tabla en el API
       * @param {string} params parametros para filtrar la busqueda
       * @return {array|object} objeto u objetos del get
       * @description Metodo GET del servicio
       */
      get: function(tabla, params) {
        return $http.get(path + tabla + "/?" + params);
      },

      /**
       * @ngdoc function
       * @name financieraService.service:financieraRequest#post
       * @param {string} tabla Nombre de la tabla en el API
       * @param {object} elemento objeto a ser creado por el API
       * @methodOf financieraService.service:financieraRequest
       * @return {array|string} mensajes del evento en el servicio
       * @description Metodo POST del servicio
       */
      post: function(tabla, elemento) {
        return $http.post(path + tabla, elemento);
      },

      /**
       * @ngdoc function
       * @name financieraService.service:financieraRequest#put
       * @param {string} tabla Nombre de la tabla en el API
       * @param {string|int} id del elemento en el API
       * @param {object} elemento objeto a ser actualizado por el API
       * @methodOf financieraService.service:financieraRequest
       * @return {array|string} mensajes del evento en el servicio
       * @description Metodo PUT del servicio
       */
      put: function(tabla, id, elemento) {
        return $http.put(path + tabla + "/" + id, elemento);
      },

      /**
       * @ngdoc function
       * @name financieraService.service:financieraRequest#delete
       * @methodOf financieraService.service:financieraRequest
       * @param {string} tabla Nombre de la tabla en el API
       * @param {object} elemento objeto a ser eliminado por el API
       * @return {array|string} mensajes del evento en el servicio
       * @description Metodo DELETE del servicio
       */
      delete: function(tabla, id) {
        return $http.delete(path + tabla + "/" + id);
      }
    };
  });

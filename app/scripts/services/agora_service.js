'use strict';

/**
 * @ngdoc overview
 * @name agoraService
 * @description
 * # agoraService
 *
 * Service module of the application.
 */
 angular.module('agoraService',[])
   /**
    * @ngdoc service
    * @name agoraService.service:agoraRequest
    * @requires $http
    * @param {injector} $http componente http de angular
    * @description
    * # agoraService
    * Fabrica sobre la cual se consumen los servicios proveidos por el API de agora sobre los metodos GET, POST, PUT y DELETE
    */

   .factory('agoraRequest', function ($http) {

     var path = "http://10.20.0.254/agora_api/v1/";
     //var path = "http://127.0.0.1:8089/v1/";
     // Public API here
     return {
       /**
        * @ngdoc function
        * @name agoraService.service:agoraRequest#get
        * @methodOf agoraService.service:agoraRequest
        * @param {string} tabla Nombre de la tabla en el API
        * @param {string} params parametros para filtrar la busqueda
        * @return {array|object} objeto u objetos del get
        * @description Metodo GET del servicio
        */
       get: function (tabla,params) {
         return $http.get(path+tabla+"/?"+params);
       },

       /**
        * @ngdoc function
        * @name agoraService.service:agoraRequest#post
        * @param {string} tabla Nombre de la tabla en el API
        * @param {object} elemento objeto a ser creado por el API
        * @methodOf agoraService.service:agoraRequest
        * @return {array|string} mensajes del evento en el servicio
        * @description Metodo POST del servicio
        */
       post: function (tabla,elemento) {
         return $http.post(path+tabla,elemento);
       },

       /**
        * @ngdoc function
        * @name agoraService.service:agoraRequest#put
        * @param {string} tabla Nombre de la tabla en el API
        * @param {string|int} id del elemento en el API
        * @param {object} elemento objeto a ser actualizado por el API
        * @methodOf agoraService.service:agoraRequest
        * @return {array|string} mensajes del evento en el servicio
        * @description Metodo PUT del servicio
        */
       put: function (tabla,id,elemento) {
         return $http.put(path+tabla+"/"+id,elemento);
       },

       /**
        * @ngdoc function
        * @name agoraService.service:agoraRequest#delete
        * @methodOf agoraService.service:agoraRequest
        * @param {string} tabla Nombre de la tabla en el API
        * @param {object} elemento objeto a ser eliminado por el API
        * @return {array|string} mensajes del evento en el servicio
        * @description Metodo DELETE del servicio
        */
       delete: function (tabla,id) {
         return $http.delete(path+tabla+"/"+id);
       }
     };
   });

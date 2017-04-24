'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.agoraService
 * @description
 * # agoraService
 * Service in the financieraClienteApp.
 */
 angular.module('agoraService',[])
   .factory('agoraRequest', function ($http) {
     // Service logic
     // ...


     var path = "http://10.20.0.254/agora_api/v1/";
     //var path = "http://127.0.0.1:8089/v1/";

     // Public API here
     return {
       get: function (tabla,params) {
         return $http.get(path+tabla+"/?"+params);
       },
       post: function (tabla,elemento) {
         return $http.post(path+tabla,elemento);
       },
       put: function (tabla,id,elemento) {
         return $http.put(path+tabla+"/"+id,elemento);
       },
       delete: function (tabla,id) {
         return $http.delete(path+tabla+"/"+id);
       }
     };
   });

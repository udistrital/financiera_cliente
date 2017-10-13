'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.pagosService
 * @description
 * # pagosService
 * Service in the financieraClienteApp.
 */
 angular.module('pagosService', [])
   .factory('pagosRequest', function ($http) {
     // Service logic
     // ...
     var path = "http://jbpm.udistritaloas.edu.co:8280/services/academicaProxyService/ingresos_concepto/";
     // Public API here
     return {

       get: function (parametros,headers) {
         return $http.get(path+parametros,headers);

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

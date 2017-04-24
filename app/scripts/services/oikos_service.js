'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.oikosService
 * @description
 * # oikosService
 * Factory in the financieraClienteApp.
 */
 angular.module('oikosService',[])
   .factory('oikosRequest', function ($http) {
     var path = "http://10.20.0.254/oikos_api/v1/";

     // Public API here
     return {

       get: function(tabla, params) {
          return $http.get(path + tabla + "/?" + params);
        },
       post: function (table,elemento) {
         return $http.post(path+table,elemento);
       },
       delete: function (table,id) {
         return $http.delete(path+table+"/"+id);
       },
       getOne: function (table,id) {
         return $http.get(path+table+"/"+id);
       },
       put: function (table,id,elemento) {
         return $http.put(path+table+"/"+id,elemento);
       }
     };

   });

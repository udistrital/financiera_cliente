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
     var path = "http://10.20.0.127/urano/index.php?data=B-7djBQWvIdLAEEycbH1n6e-3dACi5eLUOb63vMYhGo7UeM3zDHx3qb-XtnCmqd77icefAdke5B9RO4U1kMew1mK7rfB0yxyQQ-RBU-dLhA3LwBbPFFZkPQvvRhkJ5n_";
     // Public API here
     return {

       get: function (parametros) {
         return $http.get(path, {params: parametros}).then(function(response){
           var json = response.data.split("<json>");
           var jsonObj = JSON.parse(json[1]);
           return jsonObj;
         });

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

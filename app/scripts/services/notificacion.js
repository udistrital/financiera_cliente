'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.notificacion
 * @description
 * # notificacion
 * Factory in the financieraClienteApp.
 */
angular.module('financieraClienteApp')
.factory('notificacion', function($websocket, $http) {
   var id = 2;
   var path = "http://10.20.0.254/configuracion_api/v1/";
   var dataStream = $websocket("ws://10.20.0.254:8100/register?id="+id+"&profile=Admin");
   var log = [];
   dataStream.onMessage(function(message) {
     log.unshift(JSON.parse(message.data));
   });

   var methods = {
     id : -1,
     log: log,
     get: function() {
       dataStream.send(JSON.stringify({
         action: 'get'
       }));
     },
     get_crud: function (tabla,params) {
       return $http.get(path+tabla+"/?"+params);
     },
     put_crud: function (tabla,id,elemento) {
       return $http.put(path+tabla+"/"+id,elemento);
     },
     no_vistos: function() {
       var j = 0;
       angular.forEach(methods.log, function(notificiacion) {
         if (!notificiacion.viewed) {
           j += 1;
         }
       });
       return j;
   }

   };
   return methods;
 });

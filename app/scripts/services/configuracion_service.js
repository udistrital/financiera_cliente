'use strict';


/**
 * @ngdoc overview
 * @name configuracionService
 * @description
 * # configuracionService
 * Service in the financieraClienteApp.
 */

angular.module('configuracionService', [])

  /**
   * @ngdoc service
   * @name configuracionService.service:configuracionRequest
   * @requires $http
   * @param {injector} $http componente http de angular
   * @requires $websocket
   * @param {injector} $websocket componente websocket de angular-websocket
   * @description
   * # configuracionRequest
   * Factory que permite gestionar los servicios para construir y gestion los elementos que se muestran por el cliente a traves del menú
   */

  .factory('configuracionRequest', function($http, $q) {
    // Service logic
    // ...
    var path = "http://10.20.0.254/configuracion_api/v1/";
    var menu_fabrica;
    // Public API here

    return {

      actualizar_menu:  function(perfil){
        var defer = $q.defer();
        $http.get(path+'menu_opcion_padre/ArbolMenus/'+perfil).then(function(response){
          defer.resolve(response.data);
          //menu_fabrica= response.data;
          console.log("menu",menu_fabrica);
        });
        defer.promise.then(data => menu_fabrica= data)
        console.log("defererere");
      },

      get_menu: function(){
        console.log("menuenen", menu_fabrica);
        return menu_fabrica;

      },

      get_acciones: function(path, a) {
        console.log(path, a);
        for (var i = 0; i < a.length; i++) {
          if (a[i].Url === path) {
            return a[i];
          } else if (a[i].Opciones.length > 0) {
            if ((y = this.get_acciones(path,a[i].Opciones)) && y.length >0) {
              return y;
            }
          }
        }
        return [];
      },


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
    }

  });

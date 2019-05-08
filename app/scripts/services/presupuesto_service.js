'use strict';

/**
 * @ngdoc overview
 * @name presupuestoService
 * @description
 * # presupuestoService
 *
 * Service module of the application.
 */
angular.module('presupuestoService', [])

/**
 * @ngdoc service
 * @name presupuestoService.service:presupuestoRequest
 * @requires $http
 * @param {injector} $http componente http de angular
 * @description
 * # presupuestoService
 * Fabrica sobre la cual se consumen los servicios proveidos por el API de presupuesto sobre los metodos GET, POST, PUT y DELETE
 */
.factory('presupuestoRequest', function($http, CONF,$q, requestRequest) {
    var path = CONF.GENERAL.PRESUPUESTO_SERVICE;
    var cancelSearch ;
    // Public API here
    return {
        /**
         * @ngdoc function
         * @name presupuestoService.service:presupuestoRequest#get
         * @methodOf presupuestoService.service:presupuestoRequest
         * @param {string} tabla Nombre de la tabla en el API
         * @param {string} params parametros para filtrar la busqueda
         * @return {array|object} objeto u objetos del get
         * @description Metodo GET del servicio
         */
        get: function(tabla, params) {
            cancelSearch = $q.defer(); //create new defer for new request
            var get
            if (angular.isUndefined(params)||params===null){
              get = path+tabla,{timeout:cancelSearch.promise};
            }else {
              get = path+tabla+"/?"+params,{timeout:cancelSearch.promise};
            }
            return $http.get(get);
        },

        /**
         * @ngdoc function
         * @name presupuestoService.service:presupuestoRequest#post
         * @param {string} tabla Nombre de la tabla en el API
         * @param {object} elemento objeto a ser creado por el API
         * @methodOf presupuestoService.service:presupuestoRequest
         * @return {array|string} mensajes del evento en el servicio
         * @description Metodo POST del servicio
         */
        post: function(tabla, elemento) {
            return $http.post(path + tabla, elemento);
        },

        /**
         * @ngdoc function
         * @name presupuestoService.service:presupuestoRequest#put
         * @param {string} tabla Nombre de la tabla en el API
         * @param {string|int} id del elemento en el API
         * @param {object} elemento objeto a ser actualizado por el API
         * @methodOf presupuestoService.service:presupuestoRequest
         * @return {array|string} mensajes del evento en el servicio
         * @description Metodo PUT del servicio
         */
        put: function(tabla, id, elemento) {
            return $http.put(path + tabla + "/" + id, elemento);
        },

        /**
         * @ngdoc function
         * @name presupuestoService.service:presupuestoRequest#delete
         * @methodOf presupuestoService.service:presupuestoRequest
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
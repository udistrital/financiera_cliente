'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.administrativaPruebasService
 * @description
 * # administrativaPruebasService
 * Factory in the financieraClienteApp.
 */
angular.module('administrativaPruebasService', [])

/**
 * @ngdoc service
 * @name administrativaPruebasService.service:administrativaRequest
 * @requires $http
 * @param {injector} $http componente http de angular
 * @description
 * # administrativaPruebasService
 * Fabrica sobre la cual se consumen los servicios proveidos por el API de financiera sobre los metodos GET, POST, PUT y DELETE
 */
.factory('administrativaPruebasRequest', function($http, CONF) {
    // Service logic
    // ...
    var path = CONF.GENERAL.ADMINISTRATIVA_PRUEBAS_SERVICE;
    // Public API here
    return {
        /**
         * @ngdoc function
         * @name administrativaPruebasService.service:administrativaRequest#get
         * @methodOf administrativaPruebasService.service:administrativaRequest
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
         * @name administrativaPruebasService.service:administrativaRequest#post
         * @param {string} tabla Nombre de la tabla en el API
         * @param {object} elemento objeto a ser creado por el API
         * @methodOf administrativaPruebasService.service:administrativaRequest
         * @return {array|string} mensajes del evento en el servicio
         * @description Metodo POST del servicio
         */
        post: function(tabla, elemento) {
            return $http.post(path + tabla, elemento);
        },

        /**
         * @ngdoc function
         * @name administrativaPruebasService.service:administrativaRequest#put
         * @param {string} tabla Nombre de la tabla en el API
         * @param {string|int} id del elemento en el API
         * @param {object} elemento objeto a ser actualizado por el API
         * @methodOf administrativaPruebasService.service:administrativaRequest
         * @return {array|string} mensajes del evento en el servicio
         * @description Metodo PUT del servicio
         */
        put: function(tabla, id, elemento) {
            return $http.put(path + tabla + "/" + id, elemento);
        },

        /**
         * @ngdoc function
         * @name administrativaPruebasService.service:administrativaRequest#delete
         * @methodOf administrativaPruebasService.service:administrativaRequest
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
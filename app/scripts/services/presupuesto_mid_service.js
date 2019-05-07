'use strict';

/**
 * @ngdoc service
 * @name presupuestoClienteApp.presupuestoMidService
 * @description
 * # presupuestoMidService
 * Service in the presupuestoClienteApp.
 */
angular.module('presupuestoMidService', [])
    /**
     * @ngdoc service
     * @name presupuestoMidService.service:presupuestoMidRequest
     * @requires $http
     * @param {injector} $http componente http de angular
     * @description
     * # presupuestoMidService
     * Fabrica sobre la cual se consumen los servicios proveidos por el API de presupuesto sobre los metodos GET, POST, PUT y DELETE
     */
    .factory('presupuestoMidRequest', function($http, $q,CONF) {
        // Service logic
        var path = CONF.GENERAL.PRESUPUESTO_MID_SERVICE;
        var cancelSearch ; //defer object

        // Public API here
        return {
            /**
             * @ngdoc function
             * @name presupuestoMidService.service:presupuestoMidRequest#get
             * @methodOf presupuestoMidService.service:presupuestoMidRequest
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
             * @name presupuestoMidService.service:presupuestoMidRequest#post
             * @param {string} tabla Nombre de la tabla en el API
             * @param {object} elemento objeto a ser creado por el API
             * @methodOf presupuestoMidService.service:presupuestoMidRequest
             * @return {array|string} mensajes del evento en el servicio
             * @description Metodo POST del servicio
             */
            post: function(tabla, elemento) {
                return $http.post(path + tabla, elemento);
            },
            /**
             * @ngdoc function
             * @name presupuestoMidService.service:presupuestoMidRequest#put
             * @param {string} tabla Nombre de la tabla en el API
             * @param {string|int} id del elemento en el API
             * @param {object} elemento objeto a ser actualizado por el API
             * @methodOf presupuestoMidService.service:presupuestoMidRequest
             * @return {array|string} mensajes del evento en el servicio
             * @description Metodo PUT del servicio
             */
            put: function(tabla, id, elemento) {
                return $http.put(path + tabla + "/" + id, elemento);
            },
            /**
             * @ngdoc function
             * @name presupuestoMidService.service:presupuestoMidRequest#delete
             * @methodOf presupuestoMidService.service:presupuestoMidRequest
             * @param {string} tabla Nombre de la tabla en el API
             * @param {object} elemento objeto a ser eliminado por el API
             * @return {array|string} mensajes del evento en el servicio
             * @description Metodo DELETE del servicio
             */
            delete: function(tabla, id) {
                return $http.delete(path + tabla + "/" + id);
            },
            cancel: function(){
                if (cancelSearch != undefined){
                    return cancelSearch.resolve('search aborted');
                }
                return null
            }
        };
    });

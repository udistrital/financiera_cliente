'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.wso2Service
 * @description
 * # wso2Service
 * 
 * Service module of the application.
 */
angular.module('wso2Service', [])
    /**
     * @ngdoc service
     * @name wso2Service.service:academicaRequest
     * @requires $http
     * @param {injector} $http componente http de angular
     * @description
     * # wso2Service
     * Fabrica sobre la cual se consumen los servicios proveidos por el API de financiera sobre los metodos GET, POST, PUT y DELETE
     */
    .factory('wso2Request', function($http, CONF) {
        var path = CONF.GENERAL.WSO2_SERVICE;
        // Public API here
        return {
            /**
             * @ngdoc function
             * @name wso2Service.service:academicaRequest#get
             * @methodOf wso2Service.service:academicaRequest
             * @param {array} params parametros para filtrar la busqueda
             * @return {array|object} objeto u objetos del get
             * @description Metodo GET del servicio
             */
            get: function(service, params) {
                var param_string = "";
                angular.forEach(params, function(p) {
                    param_string += "/" + p.value;
                });
                return $http.get(path + "/" + service + param_string, { headers: { 'Accept': 'application/json' } });
            }
        };
    });
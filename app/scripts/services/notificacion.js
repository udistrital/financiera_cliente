'use strict';


/**
 * @ngdoc overview
 * @name financieraNotificacion
 * @description
 * # financieraNotificacion
 * Service in the financieraClienteApp.
 */

angular.module('financieraNotificacion', [])

/**
 * @ngdoc service
 * @name financieraNotificacion.service:notificacion
 * @requires $http
 * @param {injector} $http componente http de angular
 * @requires $websocket
 * @param {injector} $websocket componente websocket de angular-websocket
 * @description
 * # Notificacion
 * Factory que permite gestionar los servicios de notificaciones, tanto de websocket, como tambien del api de notificaciones los metodos GET, PUT.
 */

.factory('notificacion', function($websocket, $http) {
    // Service logic
    // ...
    var id = 3;
    var path = "http://10.20.0.254/configuracion_api/v1/";
    var dataStream = $websocket("ws://10.20.2.134:8080/ws/join?id=" + id + "&profiles=2");
    var log = [];
    dataStream.onMessage(function(message) {
        console.log(message.data);
        log.unshift(JSON.parse(message.data));
        console.log(log);
    });
    // Public API here
    var fabrica = {
        id: -1,
        log: log,
        get: function() {
            dataStream.send(JSON.stringify({
                action: 'get'
            }));
        },
        /**
         * @ngdoc function
         * @name financieraNotificacion.service:notificacion#get_crud
         * @methodOf financieraNotificacion.service:notificacion
         * @param {string} tabla Nombre de la tabla en el API
         * @param {string} params parametros para filtrar la busqueda
         * @return {array|object} objeto u objetos del get
         * @description Metodo GET del servicio
         */
        get_crud: function(tabla, params) {
            return $http.get(path + tabla + "/?" + params);
        },
        /**
         * @ngdoc function
         * @name financieraNotificacion.service:notificacion#put_crud
         * @methodOf financieraNotificacion.service:notificacion
         * @param {string} tabla Nombre de la tabla en el API
         * @param {string} id Nombre de la tabla en el API
         * @param {string} elemento parametros para filtrar la busqueda
         * @return {array|object} objeto u objetos del get
         * @description Metodo GET del servicio
         */
        put_crud: function(tabla, id, elemento) {
            return $http.put(path + tabla + "/" + id, elemento);
        },
        /**
         * @ngdoc function
         * @name financieraNotificacion.service:notificacion#no_vistos
         * @methodOf financieraNotificacion.service:notificacion
         * @return {int} Numero de notificaciones no vistas para menu
         * @description Metodo GET del servicio
         */
        no_vistos: function() {
            var j = 0;
            angular.forEach(fabrica.log, function(notificiacion) {
                if (!notificiacion.viewed) {
                    j += 1;
                }
            });
            return j;
        }
    };
    return fabrica;
});
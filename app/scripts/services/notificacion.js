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

.factory('notificacion', function($websocket, $http, CONF, token_service) {
    // Service logic
    // ...
    var perfil = [];
    var id = "";
    if(token_service.live_token()){
            perfil = token_service.getRoles();
            id = token_service.token.sub;
    }
    
    //console.log("Token ",$scope.token_service.token);
    //var id = "utest01";
    var path = CONF.GENERAL.NOTIFICACION_SERVICE;
    var dataStream = $websocket(CONF.GENERAL.NOTIFICACION_WS + "?id=" + id + "&profiles="+perfil);
    var log = [];
    dataStream.onMessage(function(message) {
        log.unshift(JSON.parse(message.data));
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
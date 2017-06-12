'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.modelsService
 * @description
 * # modelsService
 * Factory in the financieraClienteApp.
 */
angular.module('financieraClienteApp')
.factory('modelsRequest', function($http) {
  var path = "scripts/models/";
  // Public API here
  return {
    /**
     * @ngdoc function
     * @name modelsService.service:modelsRequest#get
     * @methodOf modelsService.service:modelsRequest
     * @param {string} tabla Nombre de la tabla en el API
     * @param {string} params parametros para filtrar la busqueda
     * @return {array|object} objeto u objetos del get
     * @description Metodo GET del servicio
     */
    get: function(tabla) {
      return $http.get(path + tabla + ".json");
    },

    /**
     * @ngdoc function
     * @name modelsService.service:modelsRequest#post
     * @param {string} tabla Nombre de la tabla en el API
     * @param {object} elemento objeto a ser creado por el API
     * @methodOf modelsService.service:modelsRequest
     * @return {array|string} mensajes del evento en el servicio
     * @description Metodo POST del servicio
     */
    post: function(tabla, elemento) {
      return $http.post(path + tabla, elemento);
    },

    /**
     * @ngdoc function
     * @name modelsService.service:modelsRequest#put
     * @param {string} tabla Nombre de la tabla en el API
     * @param {string|int} id del elemento en el API
     * @param {object} elemento objeto a ser actualizado por el API
     * @methodOf modelsService.service:modelsRequest
     * @return {array|string} mensajes del evento en el servicio
     * @description Metodo PUT del servicio
     */
    put: function(tabla, id, elemento) {
      return $http.put(path + tabla + "/" + id, elemento);
    },

    /**
     * @ngdoc function
     * @name modelsService.service:modelsRequest#delete
     * @methodOf modelsService.service:modelsRequest
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

'use strict';

/**
 * @ngdoc service
 * @name nixApp.vigencia
 * @description
 * # vigencia
 * Factory in the nixApp.
 */
angular.module('nixApp')
  .factory('vigencia', function() {
    var vigencia;
    var vigencia_actual;
    var fecha = new Date();
    vigencia_actual = fecha.getFullYear();
    var id_solicitud;

    var object_return = {
      vigencia: vigencia,
      vigencia_actual: vigencia_actual,
      id_solicitud: id_solicitud
    };
    return object_return;
  });

'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:DevolucionesParametrosActasCtrl
 * @description
 * # DevolucionesParametrosActasCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('DevolucionesParametrosActasCtrl', function ($scope,$translate,financieraRequest) {
    var ctrl = this;

    ctrl.nombreTabla = "acta_devolucion";
    ctrl.titulo = "ACTA_DEVOLUCION";
    ctrl.subtitulo="LISTA_ACTAS";

  });

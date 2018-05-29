'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:DevolucionesParametrosRazonDevolucionCtrl
 * @description
 * # DevolucionesParametrosRazonDevolucionCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('DevolucionesParametrosRazonDevolucionCtrl', function () {
    var ctrl = this;
    ctrl.nombreTabla = "razon_devolucion";
    ctrl.titulo = "RAZON_DEVOLUCION";
    ctrl.subtitulo="LISTA_RAZON_DEVOLUCION";
    ctrl.nombreServicio="financieraRequest";
  });

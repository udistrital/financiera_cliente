'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:InversionesParametrosTituloCtrl
 * @description
 * # InversionesParametrosTituloCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('InversionesParametrosTituloCtrl', function () {
     var ctrl = this;

     ctrl.nombreTabla = "titulo_inversion";
     ctrl.titulo = "TITULOS";
     ctrl.subtitulo="LISTA_TITULOS";
     ctrl.nombreServicio="financieraRequest";
  });

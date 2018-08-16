'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:TesoreriaParametrosCausalReintegroCtrl
 * @description
 * # TesoreriaParametrosCausalReintegroCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('TesoreriaParametrosCausalReintegroCtrl', function () {
    var ctrl = this;

    ctrl.nombreTabla = "causal_reintegro";
    ctrl.titulo = "CAUSAL_REINTEGRO";
    ctrl.subtitulo="LISTA_ACTAS";
    ctrl.nombreServicio="financieraRequest";
  });

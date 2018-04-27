'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoGirosGirosCrearCtrl
 * @description
 * # OrdenPagoGirosGirosCrearCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GirosCrearCtrl', function ($scope, financieraRequest, $window, $translate) {
    var self = this;
    self.estado = "EOP_07";
    self.op_seleccionadas = [];
  });

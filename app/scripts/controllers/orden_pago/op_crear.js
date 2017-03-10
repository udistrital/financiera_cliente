'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoOpCrearCtrl
 * @description
 * # OrdenPagoOpCrearCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OrdenPagoOpCrearCtrl', function ($scope) {
    //
    var self = this;
    //unidad ejecutora
    self.OrdenPago = {};
    self.OrdenPagoConsulta = {};
    self.RubrosIds = [];
    self.RubrosIdsTest = [35354, 41];
    self.Concepto = [];

    //
  });

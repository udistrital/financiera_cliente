'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoGirosGirosViewAllCtrl
 * @description
 * # OrdenPagoGirosGirosViewAllCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OpGirosViewAllCtrl', function ($scope, financieraRequest, $window, $translate) {
    var self = this;
    self.estado = "EOP_07";
    self.op_seleccionadas = [];
  });

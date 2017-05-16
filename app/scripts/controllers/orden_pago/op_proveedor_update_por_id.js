'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoOpProveedorUpdatePorIdCtrl
 * @description
 * # OrdenPagoOpProveedorUpdatePorIdCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OpProveedorUpdatePorIdCtrl', function ($scope, $routeParams) {
    var self = this;
    self.ordenPagoProveedorId = $routeParams.Id;
  });

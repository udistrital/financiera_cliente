'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoPlantaOpPlantaVerPorIdCtrl
 * @description
 * # OrdenPagoPlantaOpPlantaVerPorIdCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OpPlantaVerPorIdCtrl', function ($scope, $routeParams) {
    var self = this;
    self.ordenPagoProveedorId = $routeParams.Id
  });

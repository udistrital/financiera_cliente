'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoPlantaOpPlantaVerPorIdCtrl
 * @description
 * # OrdenPagoPlantaOpPlantaVerPorIdCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OpPlantaVerPorIdCtrl', function (financieraRequest, $scope, $routeParams) {
    var self = this;
    self.ordenPagoPlantaId = $routeParams.Id;
    // paneles
    $scope.panelUnidadEjecutora = true;
    // get data OP
    financieraRequest.get('orden_pago',
      $.param({
        query: "Id:" + self.ordenPagoPlantaId,
      })).then(function(response) {
        self.OrdenPago = response.data[0];
    });


  });

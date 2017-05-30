'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoPlantaOpPlantaCrearCtrl
 * @description
 * # OrdenPagoPlantaOpPlantaCrearCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OpPlantaCrearCtrl', function($scope, financieraRequest, $window, $translate) {
    var self = this;
    self.PestanaAbierta = true;
    self.OrdenPago = {};
    self.OrdenPagoConsulta = {};
    self.OrdenPagoConsulta.Proveedor = { Id: 469 };
    self.dataLiquidacionConsulta = {};
    self.dataliquidacion = {};
    // obtener vigencia
    financieraRequest.get("orden_pago/FechaActual/2006") //formato de entrada  https://golang.org/src/time/format.go
      .then(function(data) { //error con el success
        self.OrdenPago.Vigencia = data.data;
        self.dataLiquidacionConsulta.Vigencia = self.OrdenPago.Vigencia;
      })
    // Funciones
    self.addOpPlantaCrear = function(){
      console.log(self.OrdenPago)
    }
  });

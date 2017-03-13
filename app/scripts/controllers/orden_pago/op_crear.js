'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoOpCrearCtrl
 * @description
 * # OrdenPagoOpCrearCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OrdenPagoOpCrearCtrl', function ($scope, financieraRequest) {
    //
    var self = this;
    //unidad ejecutora
    self.OrdenPago = {};
    self.OrdenPagoConsulta = {};
    self.RubrosIds = [];
    self.RubrosIdsTest = [35354, 41];
    self.Concepto = [];

    // Insert Orden Pago
    self.addOpProveedor = function(){
      self.OrdenPago.EstadoOrdenPago = {'Id': 1};
      self.OrdenPago.Vigencia = 2017;
      self.OrdenPago.PersonaElaboro = 1;

      console.log("insert")
      financieraRequest.post("orden_pago", self.OrdenPago)
        .then(function(data) {   //error con el success
          console.log(data)
          self.resultado = data
        })
        /*.error(function(data, status, headers, config) {
          console.log("error");
        })*/
    }


    //
  });

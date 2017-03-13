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
    self.ConceptoOrdenPago = [];
    self.Data_OrdenPago_Concepto = {};

    // functions
    self.estructura_orden_pago_conceptos = function(conceptos){
      angular.forEach(conceptos, function(concepto){
        self.ConceptoOrdenPago.push({
            'OrdenDePago':{'Id': 0},
            'Concepto': {'Id': concepto.Id},
            'Valor': concepto.Afectacion
        });
      })
    }

    // Insert Orden Pago
    self.addOpProveedor = function(){
      self.OrdenPago.EstadoOrdenPago = {'Id': 1};
      self.OrdenPago.Vigencia = 2017;
      self.OrdenPago.PersonaElaboro = 1;
      // trabajar estructura de conceptos
      self.Data_OrdenPago_Concepto = {};
      self.ConceptoOrdenPago = [];
      //
      if(self.Concepto ){
        self.estructura_orden_pago_conceptos(self.Concepto);
      }
      //resultado estructura
      console.log(self.ConceptoOrdenPago);

      // fin trabajar estructura de conceptos
      console.log("insert")
      //construir data send
      self.Data_OrdenPago_Concepto.OrdenPago = self.OrdenPago;
      self.Data_OrdenPago_Concepto.ConceptoOrdenPago = self.ConceptoOrdenPago;
      //insert

      financieraRequest.post("orden_pago/RegistrarOp", self.Data_OrdenPago_Concepto)
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

'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoOpCrearCtrl
 * @description
 * # OrdenPagoOpCrearCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OrdenPagoOpCrearCtrl', function ($scope, financieraRequest, $window) {
    //
    var self = this;
    self.OrdenPago = {};
    self.OrdenPagoConsulta = {};
    self.RubrosIds = [];
    self.Concepto = [];
    self.ConceptoOrdenPago = [];
    self.Data_OrdenPago_Concepto = {};
    self.MovimientoContable = [];
    self.MensajesAlerta = [];

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
      //construir data send
      self.Data_OrdenPago_Concepto.OrdenPago = self.OrdenPago;
      self.Data_OrdenPago_Concepto.ConceptoOrdenPago = self.ConceptoOrdenPago;
      self.Data_OrdenPago_Concepto.MovimientoContable = self.movs;
      //console.log(self.Data_OrdenPago_Concepto)

      // validar campos obligatorios en el formulario orden Pago
      self.validar_campos()
    }
    // Funcion encargada de validar la obligatoriedad de los campos
    self.validar_campos = function(){
      self.MensajesAlerta = [];
      if (self.OrdenPago.UnidadEjecutora == undefined) {
        self.MensajesAlerta.push("Debe seleccionar la Unidad Ejecutora\n")
      }
      if (self.OrdenPagoConsulta.Proveedor == undefined) {
        self.MensajesAlerta.push("Debe seleccionar el Proveedor para la orden de pago\n")
      }
      if (self.OrdenPago.RegistroPresupuestal == undefined) {
        self.MensajesAlerta.push("Debe seleccionar el Registro Presupuestal\n")
      }
      if (self.OrdenPago.TipoOrdenPago == undefined) {
        self.MensajesAlerta.push("Debe seleccionar el tipo de Documento en la Sección Valor del Pago\n")
      }
      if (self.OrdenPago.Iva == undefined) {
        self.MensajesAlerta.push("Debe Indicar el Valor del Iva en la Sección Valor del Pago\n")
      }
      if (self.OrdenPago.ValorBase == undefined) {
        self.MensajesAlerta.push("Debe Indicar el Valor Base en la Sección Valor del Pago\n")
      }
      if (self.RubrosIds == undefined || self.RubrosIds.length == 0) {
        self.MensajesAlerta.push("Debe Seleccionar por lo minimo un Rubro\n")
      }
      if (self.Concepto == undefined || self.Concepto.length == 0) {
        self.MensajesAlerta.push("Debe Seleccionar por lo minimo un Comcepto\n")
      }
      // Operar
      if(self.MensajesAlerta == undefined || self.MensajesAlerta.length == 0 ){
        // insert
        financieraRequest.post("orden_pago/RegistrarOp", self.Data_OrdenPago_Concepto)
          .then(function(data) {   //error con el success
            console.log(data)
            self.resultado = data
          })
        swal({
          title: 'Registro Exitoso',
          text: 'La orden de pago se ha Registrado',
          type: 'success',
        }).then(function(){
          $window.location.href = '#/orden_pago/ver_todos';
        })
      }else{
        // mesnajes de error
        swal("Error!", self.MensajesAlerta, "error")
      }
    }
    //
  });

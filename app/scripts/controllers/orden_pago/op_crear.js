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
    self.OrdenPago.RegistroPresupuestal = {'Id':56};
    self.RubrosObjIds = null;
    self.Concepto = [];
    self.ConceptoOrdenPago = [];
    self.dataOrdenPagoInsert = {};
    self.MovimientoContableConceptoOrdenPago = [];
    self.MensajesAlerta = null;
    self.TotalAfectacion = null;

    // functions
    self.estructurarDataSend = function(conceptos){
      // estrurctura total afectacion y movimientos contables
      angular.forEach(conceptos, function(concepto){
        if(concepto.validado == true){ // tiene cuentas y se hace afectacion
          //total afectacion
          self.TotalAfectacion = self.TotalAfectacion + concepto.Afectacion;
          // recorrer novimiento
          angular.forEach(concepto.movs, function(movimiento){
            if (movimiento.Debito > 0 || movimiento.Credito > 0){
              // data movimientos contables
              self.MovimientoContableConceptoOrdenPago.push(movimiento);
            }
          })
        }
      })
      // estructurar concepto orden
      angular.forEach(self.RubrosObjIds, function(rubro){
        angular.forEach(rubro.DisponibilidadApropiacion.Concepto, function(concepto){
          self.ConceptoOrdenPago.push({
            'OrdenDePago':{'Id': 0},
            'Concepto': {'Id': concepto.Id},
            'Valor': concepto.Afectacion,
            'registro_presupuestal_disponibilidad_apropiacion': rubro.Id
          });
        })
      })
    }
    // Insert Orden Pago
    self.addOpProveedor = function(){
      self.OrdenPago.EstadoOrdenPago = {'Id': 1};
      self.OrdenPago.Vigencia = 2017;
      self.OrdenPago.PersonaElaboro = 1;
      // trabajar estructura de conceptos
      self.dataOrdenPagoInsert = {};
      self.ConceptoOrdenPago = [];
      self.MovimientoContableConceptoOrdenPago = [];
      self.TotalAfectacion = 0;
      //
      if(self.Concepto != undefined){
        self.estructurarDataSend(self.Concepto);
      }
      //construir data send
      self.dataOrdenPagoInsert.OrdenPago = self.OrdenPago;
      self.dataOrdenPagoInsert.ConceptoOrdenPago = self.ConceptoOrdenPago;
      self.dataOrdenPagoInsert.MovimientoContable = self.MovimientoContableConceptoOrdenPago;
      console.log("Estructura para enviar")
      console.log(self.dataOrdenPagoInsert)
      // validar campos obligatorios en el formulario orden Pago y se inserta registro
      self.validar_campos()
    }

    // Funcion encargada de validar la obligatoriedad de los campos
    self.validar_campos = function(){
      self.MensajesAlerta = '';
      if (self.OrdenPago.UnidadEjecutora == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>Debe seleccionar la Unidad Ejecutora</li>"
      }
      if (self.OrdenPagoConsulta.Proveedor == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>Debe seleccionar el Proveedor para la orden de pago</li>"
      }
      if (self.OrdenPago.RegistroPresupuestal == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>Debe seleccionar el Registro Presupuestal</li>"
      }
      if (self.OrdenPago.TipoOrdenPago == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>Debe seleccionar el tipo de Documento en la Sección Valor del Pago</li>"
      }
      if (self.OrdenPago.Iva == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>Debe Indicar el Valor del Iva en la Sección Valor del Pago</li>"
      }
      if (self.OrdenPago.ValorBase == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>Debe Indicar el Valor Base en la Sección Valor del Pago</li>"
      }
      /*if (self.RubrosIds == undefined || self.RubrosIds.length == 0) {
        self.MensajesAlerta = self.MensajesAlerta +  "<li>Debe Seleccionar por lo minimo un Rubro</li>"
      }*/
      if (self.Concepto == undefined || self.Concepto.length == 0) {
        self.MensajesAlerta = self.MensajesAlerta +  "<li>Debe Seleccionar por lo minimo un Comcepto</li>"
      }
      if (self.TotalAfectacion != self.OrdenPago.ValorBase) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>El valor total de la afectacion es distinto al valor de la orden de pago. <br> <b>Afectacion: " + self.TotalAfectacion + "<br>Valor Orden: " +  self.OrdenPago.ValorBase + "</b></li>"
      }
      // Operar
      if(self.MensajesAlerta == undefined || self.MensajesAlerta.length == 0 ){
        // insert
        financieraRequest.post("orden_pago/RegistrarOp", self.dataOrdenPagoInsert)
          .then(function(data) {   //error con el success
            self.resultado = data;
            //mensaje
            swal({
              title: 'Registro Exitoso',
              text: 'Orden de Pago Proveedo Registrado Exitosamente con Consecutivo No. ' + self.resultado.data,
              type: 'success',
            }).then(function(){
              $window.location.href = '#/orden_pago/ver_todos';
            })
            //
          })
      }else{
        // mesnajes de error
        swal({
          title: 'Error!',
          html:  '<ol align="left">' + self.MensajesAlerta + '</ol>',
          type: 'error'
        })
      }
    }
    //
  });

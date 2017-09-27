'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoOpCrearCtrl
 * @description
 * # OrdenPagoOpCrearCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OrdenPagoOpCrearCtrl', function($scope, financieraRequest, $window, $translate) {
    //
    var self = this;
    self.OrdenPago = {};
    self.OrdenPagoConsulta = {};
    self.RubrosObjIds = null;
    self.Concepto = [];
    self.ConceptoOrdenPago = [];
    self.dataOrdenPagoInsert = {};
    self.MovimientoContableConceptoOrdenPago = [];
    self.MensajesAlerta = null;
    self.TotalAfectacion = null;
    self.PestanaAbierta = true;
    // obtener vigencia
    financieraRequest.get("orden_pago/FechaActual/2006") //formato de entrada  https://golang.org/src/time/format.go
      .then(function(data) {
        self.Vigencia = parseInt(data.data);
      })
    // functions
    self.estructurarDataSend = function(conceptos) {
      // estrurctura total afectacion y movimientos contables
      angular.forEach(conceptos, function(concepto) {
        if (concepto.validado == true) { // tiene cuentas y se hace afectacion
          //total afectacion
          self.TotalAfectacion = self.TotalAfectacion + concepto.Afectacion;
          // recorrer novimiento
          angular.forEach(concepto.movs, function(movimiento) {
            if (movimiento.Debito > 0 || movimiento.Credito > 0) {
              // data movimientos contables
              self.MovimientoContableConceptoOrdenPago.push(movimiento);
            }
          })
        }
      })
      // estructurar concepto orden
      angular.forEach(self.RubrosObjIds, function(rubro) {
        angular.forEach(rubro.DisponibilidadApropiacion.Concepto, function(concepto) {
          self.ConceptoOrdenPago.push({
            'OrdenDePago': {
              'Id': 0
            },
            'Concepto': {
              'Id': concepto.Id
            },
            'Valor': concepto.Afectacion,
            'RegistroPresupuestalDisponibilidadApropiacion': {
              'Id': rubro.Id
            }
          });
        })
      })
    }
    // Insert Orden Pago
    self.addOpProveedor = function() {
      self.OrdenPago.PersonaElaboro = 1;
      // trabajar estructura de conceptos
      self.dataOrdenPagoInsert = {};
      self.ConceptoOrdenPago = [];
      self.MovimientoContableConceptoOrdenPago = [];
      self.TotalAfectacion = 0;
      //
      if (self.Concepto != undefined) {
        self.estructurarDataSend(self.Concepto);
      }
      //construir data send
      self.dataOrdenPagoInsert.OrdenPago = self.OrdenPago;
      self.dataOrdenPagoInsert.ConceptoOrdenPago = self.ConceptoOrdenPago;
      self.dataOrdenPagoInsert.MovimientoContable = self.MovimientoContableConceptoOrdenPago;
      //console.log("Estructura para enviar")
      //console.log(self.dataOrdenPagoInsert)
      // validar campos obligatorios en el formulario orden Pago y se inserta registro
      self.validar_campos()
    }

    // Funcion encargada de validar la obligatoriedad de los campos
    self.validar_campos = function() {
      self.MensajesAlerta = '';
      if (self.OrdenPago.UnidadEjecutora == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_UNIDAD') + "</li>"
      }
      if (self.OrdenPagoConsulta.Proveedor == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_PROVEEDOR') + "</li>"
      }
      if (self.OrdenPago.RegistroPresupuestal == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_REGISTRO') + "</li>"
      }
      if (self.OrdenPago.SubTipoOrdenPago == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_TIPO_OP') + "</li>"
      }
      if (self.OrdenPago.FormaPago == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_FORMA_PAGO_OP') + "</li>"
      }
      if (self.OrdenPago.Iva == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_IVA') + "</li>"
      }
      if (self.OrdenPago.ValorBase == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_VAL_BASE') + "</li>"
      }
      /*if (self.RubrosIds == undefined || self.RubrosIds.length == 0) {
        self.MensajesAlerta = self.MensajesAlerta +  "<li>Debe Seleccionar por lo minimo un Rubro</li>"
      }*/
      if (self.Concepto == undefined || self.Concepto.length == 0) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_CONCEPTO') + "</li>"
      }
      if (self.TotalAfectacion != self.OrdenPagoConsulta.ValorBruto) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_TOTAL_AFECTACION') + ". <br><b>" + $translate.instant('AFECTACION') + ": " + self.TotalAfectacion + "<br>" + $translate.instant('VALOR_PAGO') + ': ' + self.OrdenPagoConsulta.ValorBruto + "</b></li>"
      }
      // Operar
      if (self.MensajesAlerta == undefined || self.MensajesAlerta.length == 0) {
        // insert
        financieraRequest.post("orden_pago/RegistrarOpProveedor", self.dataOrdenPagoInsert)
          .then(function(data) {
            self.resultado = data;
            //mensaje
            swal({
              title: 'Orden de Pago',
              text: $translate.instant(self.resultado.data.Code)  + self.resultado.data.Body,
              type: self.resultado.data.Type,
            }).then(function() {
              $window.location.href = '#/orden_pago/ver_todos';
            })
            //
          })
      } else {
        // mesnajes de error
        swal({
          title: 'Error!',
          html: '<ol align="left">' + self.MensajesAlerta + '</ol>',
          type: 'error'
        })
      }
    }
    //
  });

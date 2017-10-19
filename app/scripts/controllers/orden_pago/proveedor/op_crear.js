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
    self.PestanaAbierta = false;
    self.panelUnidadEjecutora = false;
    self.OrdenPago = {};
    self.Proveedor = {};
    self.OrdenPago.RegistroPresupuestal = {'Id': 99} // data tes
    self.Conceptos = {};
    self.MensajesAlerta = null;
    // unidad ejecutora
    financieraRequest.get('unidad_ejecutora',
      $.param({
        query: 'Id:1', //llega por rol de usuario
      })
    ).then(function(response) {
      self.OrdenPago.UnidadEjecutora = response.data[0];
    });
    // functions
    self.estructurarDatosParaRegistro = function(pConceptos) {
      self.ConceptoOrdenPago = [];
      self.MovimientoContable = [];
      angular.forEach(pConceptos, function(concepto) {
        if (concepto.validado == true && concepto.Afectacion != 0) {
          // estructurar los conceptos a ConceptoOrdenPago
          self.ConceptoOrdenPago.push({
            'OrdenDePago': {
              'Id': 0
            },
            'Concepto': {
              'Id': concepto.Id
            },
            'Valor': concepto.Afectacion,
            'RegistroPresupuestalDisponibilidadApropiacion': {
              'Id': concepto.RegistroPresupuestalDisponibilidadApropiacion.Id
            }
          });
          //  data movimientos contables
          angular.forEach(concepto.movs, function(movimiento) {
            if (movimiento.Debito > 0 || movimiento.Credito > 0) {
              self.MovimientoContable.push(movimiento);
            }
          })
        }
      })
    }

    //funcion calcularTotalAfectacion
    self.calcularTotalAfectacion = function(pConceptos) {
      self.TotalAfectacion = 0;
      angular.forEach(pConceptos, function(concepto) {
        if (concepto.validado == true && concepto.Afectacion != 0) {
          // total afectacion
          self.TotalAfectacion = self.TotalAfectacion + concepto.Afectacion;
        }
      });
    };

    // funcion agrupa la afectación de los conceptos por rubro y valida que no supere el saldo de rubro
    self.afectaciónPorConceptoNoSuperaSaldoRubro = function(pConceptos){
      self.afectacionEnRubros = {};
      self.saldoDeRubros = {};
      angular.forEach(pConceptos, function(concepto) {
        if (concepto.validado == true && concepto.Afectacion != 0) {
          // total afectacion
          if(self.afectacionEnRubros[concepto.RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Codigo] == undefined){
            self.afectacionEnRubros[concepto.RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Codigo] = concepto.Afectacion;
          }else{
            self.afectacionEnRubros[concepto.RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Codigo] = self.afectacionEnRubros[concepto.RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Codigo] + concepto.Afectacion;
          }
          // saldos
          if(self.saldoDeRubros[concepto.RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Codigo] == undefined){
            self.saldoDeRubros[concepto.RegistroPresupuestalDisponibilidadApropiacion.DisponibilidadApropiacion.Apropiacion.Rubro.Codigo] = concepto.RegistroPresupuestalDisponibilidadApropiacion.Saldo;
          }
        }
      });
    }

    // Insert Orden Pago
    self.registrarOpProveedor = function() {
      self.afectaciónPorConceptoNoSuperaSaldoRubro(self.Conceptos);
      self.calcularTotalAfectacion(self.Conceptos);
      if (self.camposObligatorios()) {
        // trabajar estructura de conceptos
        if (Object.keys(self.Conceptos).length > 0) {
          self.estructurarDatosParaRegistro(self.Conceptos);
          //construir data send
          self.dataOrdenPagoInsert = {};
          self.dataOrdenPagoInsert.OrdenPago = self.OrdenPago;
          self.dataOrdenPagoInsert.ConceptoOrdenPago = self.ConceptoOrdenPago;
          self.dataOrdenPagoInsert.MovimientoContable = self.MovimientoContable;
          self.dataOrdenPagoInsert.Usuario = {'Id': 1}; // Con autenticación llegara el objeto
        }
        // registrar OP Proveedor
        financieraRequest.post("orden_pago/RegistrarOpProveedor", self.dataOrdenPagoInsert)
          .then(function(data) {
            self.resultado = data;
            //mensaje
            swal({
              title: 'Orden de Pago',
              text: $translate.instant(self.resultado.data.Code) + self.resultado.data.Body,
              type: self.resultado.data.Type,
            }).then(function() {
              $window.location.href = '#/orden_pago/ver_todos';
            })
          })
      } else {
        // mesnajes de error campos obligatorios
        swal({
          title: 'Error!',
          html: '<ol align="left">' + self.MensajesAlerta + '</ol>',
          type: 'error'
        })
      }
    }

    // Funcion encargada de validar la obligatoriedad de los campos
    self.camposObligatorios = function() {
      self.MensajesAlerta = '';
      if (Object.keys(self.Proveedor).length == 0) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_PROVEEDOR') + "</li>";
      }
      if (self.OrdenPago.RegistroPresupuestal == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_REGISTRO') + "</li>";
      }
      if (self.OrdenPago.SubTipoOrdenPago == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_TIPO_OP') + "</li>";
      }
      if (self.OrdenPago.FormaPago == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_FORMA_PAGO_OP') + "</li>";
      }
      if (self.OrdenPago.ValorBase == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_VAL_BASE') + "</li>";
      }
      if (Object.keys(self.Conceptos).length == 0) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_CONCEPTO') + "</li>";
      }
      if (self.TotalAfectacion != self.OrdenPago.ValorBase) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_TOTAL_AFECTACION') + "</li>" + self.TotalAfectacion + " != " + self.OrdenPago.ValorBase;
      }
      if(Object.keys(self.afectacionEnRubros).length != 0 && Object.keys(self.saldoDeRubros).length != 0){
        angular.forEach(self.afectacionEnRubros, function(afectacionValue, afectacionKey){
          angular.forEach(self.saldoDeRubros, function(saldoValue, saldoKey){
            if(saldoKey == afectacionKey && afectacionValue > saldoValue){
              self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_TOTAL_AECTACION') + " "+ afectacionKey + " " + $translate.instant('MSN_SUPERA_SALDO') + "</li>";
            }
          })
        })
      }
      // Operar
      if (self.MensajesAlerta == undefined || self.MensajesAlerta.length == 0) {
        return true;
      } else {
        return false;
      }
    }
    //
  });

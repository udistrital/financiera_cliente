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
    self.panel_abierto = "ninguno";
    var currentTime = new Date();
    var year = currentTime.getFullYear()
    self.open = false;
    self.panelUnidadEjecutora = false;
    self.OrdenPago = {};
    self.Proveedor = {};
    //self.OrdenPago.RegistroPresupuestal = {'Id': 103} // data tes
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
          self.dataOrdenPagoInsert.RegistroPresupuestal = self.RegistroPresupuestal;
          self.dataOrdenPagoInsert.Usuario = {'Id': 1}; // Con autenticación llegara el objeto
        }
        // registrar OP Proveedor
        console.log(self.dataOrdenPagoInsert);
        financieraRequest.post("orden_pago/RegistrarOpProveedor", self.dataOrdenPagoInsert)
          .then(function(data) {
            self.resultado = data;
            console.log("resultado op", self.resultado.data.Body)
            var templateAlert = "<table class='table table-bordered'><th>" + $translate.instant('ORDEN_DE_PAGO') + "</th><th>" + $translate.instant('VIGENCIA') + "</th><th>" + $translate.instant('DETALLE') + "</th>";
            templateAlert = templateAlert + "<tr class='success'><td>" + self.resultado.data.Body + "</td>" + "<td>" + year + "</td><td>" + $translate.instant(self.resultado.data.Code) + "</td></tr>" ;
            templateAlert = templateAlert + "</table>";

            swal({
              title: '',
              html: templateAlert,
              type: self.resultado.data.Type,
            }).then(function() {
              $window.location.href = '#/orden_pago/ver_todos';
            })
          })
      } else {
        // mesnajes de error campos obligatorios
        swal({
          title: '¡Error!',
          html: '<ol align="left">' + self.MensajesAlerta + '</ol>',
          type: 'error'
        })
      }
    }

    // Funcion encargada de validar la obligatoriedad de los campos
    self.camposObligatorios = function() {
      var respuesta;
      self.MensajesAlerta = '';
      if (Object.keys(self.Proveedor).length == 0) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_PROVEEDOR') + "</li>";
      }
      if (self.RegistroPresupuestal == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_REGISTRO') + "</li>";
      }
      if (self.OrdenPago.SubTipoOrdenPago == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_TIPO_OP') + "</li>";
      }
      if (self.OrdenPago.Documento == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_DOCUMENTO') + "</li>";
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
      if ((self.TotalAfectacion != self.OrdenPago.ValorBase) && self.OrdenPago.ValorBase != undefined) {

        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_TOTAL_AFECTACION')
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
        respuesta = true;
      } else {
        respuesta =  false;
      }

      return respuesta;
    };

    self.mostrar_panel_unidad = function (){
      self.panelUnidadEjecutora = !self.panelUnidadEjecutora;
      self.panelProveedores = false;
      self.panelRps = false;
      self.panelDetalle = false;
      self.panelRubros = false;
      self.panelCuentas = false;
    };

    self.mostrar_proveedores = function (){
      self.panelUnidadEjecutora = false;
      self.panelProveedores = !self.panelProveedores;
      self.panelRps = false;
      self.panelDetalle = false;
      self.panelRubros = false;
      self.panelCuentas = false;
    };

    self.mostrar_rps = function (){
      self.panelUnidadEjecutora = false;
      self.panelProveedores = false;
      self.panelRps = !self.panelRps;
      self.panelDetalle = false;
      self.panelRubros = false;
      self.panelCuentas = false;
    };

    self.mostrar_detalle_pago = function (){
      self.panelUnidadEjecutora = false;
      self.panelProveedores = false;
      self.panelRps = false;
      self.panelDetalle = !self.panelDetalle;
      self.panelRubros = false;
      self.panelCuentas = false;
    };

    self.mostrar_rubros = function (){
      self.panelUnidadEjecutora = false;
      self.panelProveedores = false;
      self.panelRps = false;
      self.panelDetalle = false;
      self.panelRubros = !self.panelRubros;
      self.panelCuentas = false;
    };

    self.mostrar_cuentas = function (){
      self.panelUnidadEjecutora = false;
      self.panelProveedores = false;
      self.panelRps = false;
      self.panelDetalle = false;
      self.panelRubros = false;
      self.panelCuentas = !self.panelCuentas;
    };

    self.abrir_panel = function(nombre){

      if(self.panel_abierto === nombre && self.open === true){
          self.open = false;
          self.panel_abierto = "ninguno"
      }else{
        self.panel_abierto = nombre;
        if(self.open === false){
          self.open = true;
      }else{
          if(self.open === true){
            self.open = false;

          }
        }
      }



    }

    //
  });

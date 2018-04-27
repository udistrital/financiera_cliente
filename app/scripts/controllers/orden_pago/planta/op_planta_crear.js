'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoPlantaOpPlantaCrearCtrl
 * @description
 * # OrdenPagoPlantaOpPlantaCrearCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OpPlantaCrearCtrl', function($scope, financieraRequest, $window, $translate, financieraMidRequest, titanRequest, $http) {
    var self = this;
    self.PestanaAbierta = false;
    self.PestanaAbiertaDetallePago = false;
    self.PestanaAbiertaLiquidacion = false;
    self.OrdenPago = {};
    self.Necesidad = {};
    self.NecesidadProcesoExterno = {};
    // unidad ejecutora
    financieraRequest.get('unidad_ejecutora',
      $.param({
        query: 'Id:1', //llega por rol de usuario
      })
    ).then(function(response) {
      self.OrdenPago.UnidadEjecutora = response.data[0];
    });
    //forma de pago
    financieraRequest.get('forma_pago',
      $.param({
        limit: 0
      })
    ).then(function(response) {
      self.formaPagos = response.data;
    });
    // obtener vigencia
    financieraRequest.get("orden_pago/FechaActual/2006") //formato de entrada  https://golang.org/src/time/format.go
      .then(function(data) { //error con el success
        self.OrdenPago.Vigencia = parseInt(data.data);
      })
    // ***************
    // Funciones
    // ***************
    self.camposObligatorios = function() {
      self.MensajesAlerta = '';
      if (Object.keys(self.Necesidad).length == 0) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_OP_PLANTA_DEBE_NECESIDAD') + "</li>"
      }
      if (self.OrdenPago.RegistroPresupuestal == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_OP_PLANTA_DEBE_NECESIDAD_CON_RP') + "</li>"
      }
      if (self.OrdenPago.FormaPago == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_FORMA_PAGO_OP') + "</li>"
      }
      if (self.OrdenPago.Liquidacion == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_OP_PLANTA_DEBE_LIQUIDACION_A_NECESIDAD') + "</li>"
      }
      // Operar
      if (self.MensajesAlerta == undefined || self.MensajesAlerta.length == 0) {
        return true;
      } else {
        return false;
      }
    }
    //
    self.addOpPlantaCrear = function() {
      if (self.camposObligatorios()) {
        self.dataOrdenPagoPlanta = {};
        self.dataOrdenPagoPlanta.OrdenPago = self.OrdenPago;
        self.dataOrdenPagoPlanta.Usuario = {'Id': 1}; // Con autenticación llegara el objeto
        //insert
        financieraMidRequest.post("orden_pago_nomina/MidCrearOPNomina", self.dataOrdenPagoPlanta)
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
            //
          })
      } else {
        swal({
          title: 'Error!',
          html: '<ol align="left">' + self.MensajesAlerta + '</ol>',
          type: 'error'
        })
      }
    }
    //
  });

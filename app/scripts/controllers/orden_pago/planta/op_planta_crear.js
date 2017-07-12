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
    self.PestanaAbierta = true;
    self.OrdenPago = {};
    self.OrdenPagoConsulta = {};
    self.dataLiquidacionConsulta = {};
    self.dataliquidacion = {};
    //self.OrdenPagoConsulta.Proveedor = {Id: 469};  // debe ser Registro de la UD


    // obtener vigencia
    financieraRequest.get("orden_pago/FechaActual/2006") //formato de entrada  https://golang.org/src/time/format.go
      .then(function(data) { //error con el success
        self.OrdenPago.Vigencia = parseInt(data.data);
        self.dataLiquidacionConsulta.Vigencia = self.OrdenPago.Vigencia;
      })
    // ***************
    // Funciones
    // ***************
    self.validar_campos = function() {
      self.MensajesAlerta = '';
      if (self.OrdenPago.UnidadEjecutora == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_UNIDAD') + "</li>"
      }
      if (self.OrdenPago.RegistroPresupuestal == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_REGISTRO') + "</li>"
      }
      if (self.OrdenPago.Liquidacion == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_LIQUIDACION') + "</li>"
      }
      // Operar
      if (self.MensajesAlerta == undefined || self.MensajesAlerta.length == 0) {
        // insertc
        console.log("Insertar DATA");
        console.log(self.dataSend);
        console.log("Insertar DATA");
        financieraMidRequest.post("orden_pago_nomina", self.dataSend)
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
    self.addOpPlantaCrear = function() {
      if (self.OrdenPago.RegistroPresupuestal){
        self.OrdenPago.ValorBase = self.OrdenPago.RegistroPresupuestal.ValorTotal; // se obtendra del rp
      }
      // Data para enviar al servicio
      self.OrdenPago.PersonaElaboro = 1;
      self.dataSend = self.OrdenPago; // para api_mid
      self.validar_campos();
    }
  });

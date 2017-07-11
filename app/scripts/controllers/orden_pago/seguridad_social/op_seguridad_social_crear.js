'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoSeguridadSocialOpSeguridadSocialCrearCtrl
 * @description
 * # OrdenPagoSeguridadSocialOpSeguridadSocialCrearCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OpSeguridadSocialCrearCtrl', function ($scope, financieraRequest, $window, $translate, financieraMidRequest, titanRequest, $http) {
    var self = this;
    self.PestanaAbierta = true;
    self.OrdenPago = {};
    self.OrdenPago.RegistroPresupuestal = {Id: 84}
    self.NecesidadId = null;
    self.DataSeguridadSocial = {};

    // obtener vigencia
    financieraRequest.get("orden_pago/FechaActual/2006") //formato de entrada  https://golang.org/src/time/format.go
      .then(function(data) { //error con el success
        self.OrdenPago.Vigencia = parseInt(data.data);
        self.DataSeguridadSocial.Vigencia = self.OrdenPago.Vigencia;
      })
    // ***************
    // Funciones
    // ***************
    self.validar_campos = function() {

      // Operar

      // insertc
      console.log("Insertar DATA");
      console.log(self.dataSend);
      console.log("Insertar DATA");
      financieraMidRequest.post("orden_pago_nomina/CrearOPSeguridadSocial", self.dataSend)
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

    }
    //
    self.addOpPlantaSsCrear = function() {
      console.log("funcion");
      self.OrdenPago.ValorBase = 0;       // se obtendra del rp
      self.OrdenPago.PersonaElaboro = 1;
      self.dataSend = {};
      self.dataSend.OrdenPago = self.OrdenPago;
      self.dataSend.SeguridadSocial = self.DataSeguridadSocial ;
      self.validar_campos();
    }

  });

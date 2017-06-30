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

    // obtener vigencia
    financieraRequest.get("orden_pago/FechaActual/2006") //formato de entrada  https://golang.org/src/time/format.go
      .then(function(data) { //error con el success
        self.OrdenPago.Vigencia = parseInt(data.data);
        self.dataLiquidacionConsulta.Vigencia = self.OrdenPago.Vigencia;
      })
    // ***************
    // Funciones
    // ***************

  });

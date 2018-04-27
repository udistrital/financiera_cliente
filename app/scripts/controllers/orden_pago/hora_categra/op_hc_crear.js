'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoHoraCategraOpHcCrearCtrl
 * @description
 * # OrdenPagoHoraCategraOpHcCrearCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OrdenPagoHoraCategraOpHcCrearCtrl', function($scope, financieraRequest, $window, $translate, financieraMidRequest, titanRequest) {
    var self = this;
    self.PestanaAbiertaLiquidacion = false;
    self.PestanaAbiertaDetallePago = false;
    self.OrdenPago = {};
    self.DataNomininaSelet = {};
    self.DataHomologacion = {};
    self.DataNominaTitanSelect = {};

    $scope.$watch('opHcCrear.DataHomologacion', function() {
      if (Object.keys(self.DataHomologacion).length > 0 && self.DataHomologacion.TipoLiquidacion != null) {
        self.tipoNominaDeLiquidacion = {};
        self.tipoNominaDeLiquidacion.tipoNomina = self.DataHomologacion.TipoLiquidacion;
        self.tipoNominaDeLiquidacion.tipoOrdenPago = "GENERAL";
      }else{
        self.tipoNominaDeLiquidacion = {};
      }
    })

    // Funcion encargada de validar la obligatoriedad de los campos
    self.camposObligatorios = function() {
      var respuesta;
      self.MensajesAlerta = '';
      if (Object.keys(self.DataNominaTitanSelect).length == 0) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_LIQUIDACION') + "</li>";
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
      if (!self.checkVigencia(self.OrdenPago.Vigencia)) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_FORMA_VIGENCIA') + "</li>";
      }
      // Operar
      if (self.MensajesAlerta == undefined || self.MensajesAlerta.length == 0) {
        respuesta =  true;
      } else {
        respuesta =  false;
      }

      return respuesta;
    }
    self.checkVigencia = function(p_vigencia) {
      var respuesta;
      if (p_vigencia.length != 4) {
        respuesta =  false;
      } else {
        respuesta =  true;
      }
      return respuesta;
    }

    self.registrarOpMasivo = function() {
      if (self.camposObligatorios()) {
        self.dataSen = {};
        self.dataSen = self.DataHomologacion;
        self.OrdenPago.Vigencia = parseInt(self.OrdenPago.Vigencia);
        self.dataSen.InfoGeneralOp = self.OrdenPago;
        console.log(self.dataSen);
        financieraMidRequest.post('orden_pago_nomina/RegistroCargueMasivoOp', self.dataSen)
          .then(function(response) {
            self.MensajesAlertaSend = '';
            self.resultado = response.data;
            console.log("Resultado");
            console.log(response);
            console.log("Resultado");
            angular.forEach(self.resultado, function(mensaje) {
              self.MensajesAlertaSend = self.MensajesAlertaSend + "<li>" + $translate.instant(mensaje.Code) + mensaje.Body + "</li>";
            })
            swal({
              title: $translate.instant('ORDEN_DE_PAGO'),
              html: '<ol align="left">' + self.MensajesAlertaSend + '</ol>',
              type: "success",
            }).then(function() {
              $window.location.href = '#/orden_pago/ver_todos';
            })
          })
      } else {
        swal({
          title: 'Error!',
          html: '<ol align="left">' + self.MensajesAlerta + '</ol>',
          type: 'error'
        })
      }
    }
  });

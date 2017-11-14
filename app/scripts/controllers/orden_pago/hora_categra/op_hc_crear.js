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
    self.OrdenPago.Vigencia = 0;
    self.DataNomininaSelet = {};
    self.DataHomologacion = {};
    self.DataNominaTitanSelect = {};
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
    // subtipo op porveedor
    financieraRequest.get('sub_tipo_orden_pago',
      $.param({
        query: 'TipoOrdenPago.CodigoAbreviacion:OP-PROV',
        limit: -1,
      })
    ).then(function(response) {
      self.subTipoOrdenPago = response.data;
    });
    // Funcion encargada de validar la obligatoriedad de los campos
    self.camposObligatorios = function() {
      self.MensajesAlerta = '';
      if (Object.keys(self.DataNominaTitanSelect).length == 0) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_LIQUIDACION') + "</li>";
      }
      if (self.OrdenPago.SubTipoOrdenPago == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_TIPO_OP') + "</li>";
      }
      if (self.OrdenPago.FormaPago == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_FORMA_PAGO_OP') + "</li>";
      }
      if(!self.checkVigencia(self.OrdenPago.Vigencia)){
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_FORMA_VIGENCIA') + "</li>";
      }
      // Operar
      if (self.MensajesAlerta == undefined || self.MensajesAlerta.length == 0) {
        return true;
      } else {
        return false;
      }
    }
    self.checkVigencia = function(p_vigencia){
      if (p_vigencia.length !=  4) {
        return false;
      }else{
        return true;
      }
    }
    self.registrarOpMasivo = function() {
      if (self.camposObligatorios()) {
        console.log("operar");
      } else {
        swal({
          title: 'Error!',
          html: '<ol align="left">' + self.MensajesAlerta + '</ol>',
          type: 'error'
        })
      }
      self.dataSen = {};
      self.dataSen.OrdenPago = self.OrdenPago;
      self.dataSen.InfoGeneralOp = self.DataHomologacion;
      console.log(self.dataSen);
      // financieraMidRequest.post('orden_pago_nomina/PreviewCargueMasivoOp', self.dataSen)
      //   .then(function(data) {
      //     console.log(data);
      //   })
    }
  });

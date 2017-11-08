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
    self.DataHomologacion = {};
    self.OrdenPago = {};
    self.OrdenPago.Vigencia = 2017;
    self.DataNomininaSelet = {};
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
    //
    self.registrarOpMasivo = function() {
      console.log("Data Sen");
      self.dataSen = {};
      self.dataSen.OrdenPago = self.OrdenPago;
      self.dataSen.InfoGeneralOp = self.DataHomologacion;
      console.log(self.dataSen);
      financieraMidRequest.post('orden_pago_nomina/PreviewCargueMasivoOp', self.dataSen)
        .then(function(data) {
          console.log(data);
        })
    }
  });

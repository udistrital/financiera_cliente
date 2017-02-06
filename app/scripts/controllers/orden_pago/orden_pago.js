'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoOrdenPagoCtrl
 * @description
 * # OrdenPagoOrdenPagoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OrdenPagoCtrl', function (financieraRequest, administrativaRequest) {
    var self = this;
    self.padre = {};
    //
    administrativaRequest.get("informacion_proveedor", "").then(function(response) {
      self.informacion_proveedor = response.data;
      console.log(self.informacion_proveedor);
    });

  //
  });

'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PlanCuentasCuentaCtrl
 * @description
 * # PlanCuentasCuentaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('CuentaCtrl', function ($routeParams, financieraRequest) {
    var self = this;
    self.cuentaId=$routeParams.Id;
    financieraRequest.get('cuenta_contable',$.param({
      query: "Codigo:"+$routeParams.Id
    })).then(function(response){
      self.v_cuenta=response.data[0];
    });

  });

'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PlanCuentasCrearCuentasCtrl
 * @description
 * # PlanCuentasCrearCuentasCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('PlanCuentasCrearCuentasCtrl', function(financieraRequest) {
    var self = this;
    self.prueba = "affs";

    self.cuentas = [];

    self.naturalezas = ["debito", "credito"];

    self.nueva_cuenta = {};

    self.cuenta_estructura = {};

    self.niveles=[];

    financieraRequest.get('nivel_clasificacion',"").then(function(response){
      self.niveles=response.data;
    });




    self.crear_cuenta = function() {

      if (self.cuenta_estructura != {}) {
        self.nueva_cuenta.Codigo = self.cuenta_estructura.Codigo + "-" + self.nueva_cuenta.Codigo;
        self.nueva_cuenta.subcuentas = [];
        self.cuenta_estructura.subcuentas.push(self.nueva_cuenta);
      }

      self.nueva_cuenta.subcuentas = [];
      self.cuenta_estructura.subcuentas.push(self.nueva_cuenta);

      self.cuentas.push(self.nueva_cuenta);

      self.nueva_cuenta = {};
    };



  });

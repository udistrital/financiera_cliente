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

    financieraRequest.get('nivel_clasificacion/primer_nivel',"").then(function(response){
      self.nivel=response.data;
      self.nueva_cuenta.NivelClasificacion=response.data;
    });

    self.crear_cuenta = function() {
      //self.nueva_cuenta.subcuentas = [];
      financieraRequest.post("cuenta_contable", self.nueva_cuenta).then(function(response){
        console.log(response.data);
      });
      self.nueva_cuenta = {};
    };



  });

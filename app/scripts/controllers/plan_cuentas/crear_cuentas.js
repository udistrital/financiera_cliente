'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PlanCuentasCrearCuentasCtrl
 * @description
 * # PlanCuentasCrearCuentasCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('PlanCuentasCrearCuentasCtrl', function(financieraRequest, $scope) {
    var self = this;
    self.prueba = "affs";
    self.cuentas = [];
    self.naturalezas = ["debito", "credito"];
    self.nueva_cuenta = {};
    self.niveles = [];
    self.padre = {};

    self.cargar_plan_maestro = function(){
      financieraRequest.get("plan_cuentas", $.param({
        query: "PlanMaestro:" + true
      })).then(function(response) {
        self.plan_maestro = response.data[0];
      });
    };


    self.crear_cuenta = function(form) {
      var nc = confirm("Desea Agregar la cuenta nueva?");
      if (nc) {
        if (self.padre.Codigo != undefined) {
          self.nueva_cuenta.Codigo = self.padre.Codigo.concat("-", self.nueva_cuenta.Codigo);
        }
        self.tr_cuenta = {
          Cuenta: self.nueva_cuenta,
          CuentaPadre: self.padre,
          PlanCuentas: self.plan_maestro
        };
        financieraRequest.post('tr_cuentas_contables', self.tr_cuenta).then(function(response) {
          alert("cuenta creada");
          self.recargar_arbol = !self.recargar_arbol;
          self.resetear(form);
        });
      }
    };


    /*self.crear_cuenta = function() {
      //self.nueva_cuenta.subcuentas = [];

      financieraRequest.post("cuenta_contable", self.nueva_cuenta).then(function(response) {
        console.log(response.data);
      });
      self.nueva_cuenta = {};
    };*/

    $scope.$watch('crearCuentas.padre', function() {

      if (self.padre.NivelClasificacion == undefined) {
        financieraRequest.get('nivel_clasificacion/primer_nivel', "").then(function(response) {
          self.nivel = response.data;
          self.nueva_cuenta.NivelClasificacion = response.data;
        });
      } else {
        financieraRequest.get('estructura_niveles_clasificacion', $.param({
          query: "NivelPadre:" + self.padre.NivelClasificacion.Id
        })).then(function(response) {
          if (response.data==null) {
            financieraRequest.get('nivel_clasificacion/primer_nivel', "").then(function(response) {
              alert("El nivel de clasificación siguiente no existe");
              self.nivel = response.data;
              self.nueva_cuenta.NivelClasificacion = response.data;
              self.padre={};
            });
          }
          else{
            self.nivel = response.data[0].NivelHijo;
            self.nueva_cuenta.NivelClasificacion = self.nivel;
          }
        });
      }

    }, true);

    self.resetear = function(form) {
      var r = confirm("Desea Limpiar el Formulario?");
      if (r) {
        form.$setPristine();
        form.$setUntouched();
        self.nueva_cuenta = {};
        self.padre = {};
        financieraRequest.get('nivel_clasificacion/primer_nivel', "").then(function(response) {
          self.nivel = response.data;
          self.nueva_cuenta.NivelClasificacion = response.data;
        });
      }
    };

    self.cargar_plan_maestro();

  });

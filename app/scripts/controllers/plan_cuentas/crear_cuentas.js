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

    self.cargar_plan_maestro = function() {
      financieraRequest.get("plan_cuentas", $.param({
        query: "PlanMaestro:" + true
      })).then(function(response) {
        self.plan_maestro = response.data[0];
      });
    };


    self.crear_cuenta = function(form) {
      swal({
        title: 'Nueva Cuenta!',
        text: "Deseas crear la nueva cuenta?",
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }).then(function() {
        if (self.padre != undefined) {
          self.nueva_cuenta.Codigo = self.padre.Codigo.concat("-", self.nueva_cuenta.Codigo);
          self.tr_padre = self.padre;
        } else {
          self.tr_padre = {};
        }
        self.tr_cuenta = {
          Cuenta: self.nueva_cuenta,
          CuentaPadre: self.tr_padre,
          PlanCuentas: self.plan_maestro
        };
        financieraRequest.post('tr_cuentas_contables', self.tr_cuenta).then(function(response) {
          self.alerta = "";
          for (var i = 1; i < response.data.length; i++) {
            self.alerta = self.alerta + response.data[i] + "\n";
          }
          swal("", self.alerta, response.data[0]);
          self.recargar_arbol = !self.recargar_arbol;
          if (response.data[0]=="success") {
            form.$setPristine();
            form.$setUntouched();
            self.nueva_cuenta = {};
            self.padre = undefined;
          }
          //self.resetear(form);
        });
      });
    };


    /*self.crear_cuenta = function() {
      //self.nueva_cuenta.subcuentas = [];

      financieraRequest.post("cuenta_contable", self.nueva_cuenta).then(function(response) {
        console.log(response.data);
      });
      self.nueva_cuenta = {};
    };*/

    $scope.$watch('crearCuentas.padre', function() {

      if (self.padre == undefined) {
        financieraRequest.get('nivel_clasificacion/primer_nivel', "").then(function(response) {
          self.nivel = response.data;
          self.nueva_cuenta.NivelClasificacion = response.data;
        });
      } else {
        financieraRequest.get('estructura_niveles_clasificacion', $.param({
          query: "NivelPadre:" + self.padre.NivelClasificacion.Id
        })).then(function(response) {
          if (response.data == null) {
            financieraRequest.get('nivel_clasificacion/primer_nivel', "").then(function(response) {
              alert("El nivel de clasificación siguiente no existe");
              self.nivel = response.data;
              self.nueva_cuenta.NivelClasificacion = response.data;
              self.padre = {};
            });
          } else {
            self.nivel = response.data[0].NivelHijo;
            self.nueva_cuenta.NivelClasificacion = self.nivel;
          }
        });
      }

    }, true);

    self.resetear = function(form) {
      swal({
        text: "Deseas limpiar el formulario?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }).then(function() {
        form.$setPristine();
        form.$setUntouched();
        self.nueva_cuenta = {};
        self.padre = undefined;
        financieraRequest.get('nivel_clasificacion/primer_nivel', "").then(function(response) {
          self.nivel = response.data;
          self.nueva_cuenta.NivelClasificacion = response.data;
        });
      });
    };

    self.cargar_plan_maestro();

  });

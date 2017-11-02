'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:ConceptosEditarCtrl
 * @description
 * # ConceptosEditarCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('conceptosEditarCtrl', function ($scope, financieraRequest, $routeParams, $translate) {
    var self=this;

    self.cargar_concepto = function() {
      financieraRequest.get("concepto", $.param({
        query: "Codigo:" + $routeParams.Codigo
      })).then(function(response) {
        self.e_concepto = response.data[0];
        financieraRequest.get("afectacion_concepto", $.param({
          query: "Concepto.Id:" + self.e_concepto.Id
        })).then(function(response) {
          self.e_afectaciones = response.data;
        });
        self.e_concepto.FechaExpiracion=new Date(self.e_concepto.FechaExpiracion);
        self.cuentas=[];
        for (var i = 0; i < self.e_concepto.ConceptoCuentaContable.length; i++) {
          self.cuentas.push(self.e_concepto.ConceptoCuentaContable[i].CuentaContable)
        }
        self.e_cuentas=angular.copy(self.cuentas);
      });
    };

    self.agregar_cuentas = function() {
      if (self.e_cuentas.indexOf(self.cuenta_contable) < 0 && self.cuenta_contable != undefined) {
        if (self.cuenta_contable.Hijos == null) {
          var exist=false;
          for (var i = 0; i < self.e_cuentas.length; i++) {
            if (self.e_cuentas[i].Codigo==self.cuenta_contable.Codigo) {
              exist=true;
            }
          }
          if (!exist) {
            self.e_cuentas.push(self.cuenta_contable);
          }
          self.cuenta_contable = undefined;
        } else {
          swal("Espera!", "Unicamente puedes seleccionar cuentas que no tengan hijos", "warning");
          self.cuenta_contable = undefined;
        }
      }
    };

    self.quitar_cuentas = function(i) {
      self.e_cuentas.splice(i, 1);
    };

    self.cargar_plan_maestro = function() {
      financieraRequest.get("plan_cuentas", $.param({
        query: "PlanMaestro:" + true
      })).then(function(response) {
        self.plan_maestro = response.data[0];
      });
    };

    self.editar_concepto=function(){
      for (let i = 0; i < self.cuentas.length; i++) {
        var exist=false;
        var index;
        for (let j = 0; j < self.e_cuentas.length; j++) {
          if (self.e_cuentas[j].Codigo==self.cuentas[i].Codigo) {
            exist=true;
            index=j;
          }
        }
        if (!exist) {
          console.log("eliminar",self.cuentas[i].Codigo );
        } else {
          self.e_cuentas.splice(index, 1);
        }
      }
      console.log("cuentas nuevas:",self.e_cuentas);

    };

    self.cargar_plan_maestro();
    self.cargar_concepto();

    $scope.$watch('conceptosEditar.cuenta_contable', function() {
      self.agregar_cuentas();
    }, true);

  });

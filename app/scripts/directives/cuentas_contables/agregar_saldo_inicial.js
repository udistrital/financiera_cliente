'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:cuentasContables/agregarSaldoInicial
 * @description
 * # cuentasContables/agregarSaldoInicial
 */
angular.module('financieraClienteApp')
  .directive('agregarSaldoInicial', function(financieraRequest) {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */
      templateUrl: 'views/directives/cuentas_contables/agregar_saldo_inicial.html',
      controller: function($scope) {
        var self = this;
        self.cargar_plan_maestro = function() {
          console.log("enenene");
          financieraRequest.get("plan_cuentas", $.param({
            query: "PlanMaestro:" + true
          })).then(function(response) {
            self.plan_maestro = response.data[0]; //Se carga data devuelta por el servicio en la variable del controlador plan_maestro
            console.log(self.plan_maestro);
          });
        };
        self.cargar_plan_maestro();

      },
      controllerAs: 'd_agregarSaldoInicial'
    };
  });

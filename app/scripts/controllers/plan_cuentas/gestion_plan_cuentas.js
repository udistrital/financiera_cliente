'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PlanCuentasGestionPlanCuentasCtrl
 * @description
 * # PlanCuentasGestionPlanCuentasCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionPlanCuentasCtrl', function (financieraRequest) {
    var self=this;

    self.cargar_plan_maestro = function() {
      financieraRequest.get("plan_cuentas", $.param({
        query: "PlanMaestro:" + true
      })).then(function(response) {
        self.plan_maestro = response.data[0]; //Se carga data devuelta por el servicio en la variable del controlador plan_maestro
      });
    };

    self.cargar_plan_maestro();
  });

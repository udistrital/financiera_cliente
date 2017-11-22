'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PlanCuentasGestionPlanCuentasCtrl
 * @description
 * # PlanCuentasGestionPlanCuentasCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionPlanCuentasCtrl', function ($scope, $translate, financieraRequest) {
    var self=this;
    $scope.btneditar=$translate.instant('BTN.EDITAR');
    self.cargar_plan_maestro = function() {
      financieraRequest.get("plan_cuentas", $.param({
        query: "PlanMaestro:" + true
      })).then(function(response) {
        self.plan_maestro = response.data[0]; //Se carga data devuelta por el servicio en la variable del controlador plan_maestro
      });
    };

    self.cargar_plan_maestro();

    $scope.$watch("gestionPlanCuentas.padre", function(){
      window.location = "http://127.0.0.1:9000/#/plan_cuentas/editar_cuenta/"+self.padre.Codigo;
    },true);
  });

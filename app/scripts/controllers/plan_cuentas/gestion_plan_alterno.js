'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PlanCuentasGestionPlanAlternoCtrl
 * @description
 * # PlanCuentasGestionPlanAlternoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionPlanAlternoCtrl', function($scope, financieraRequest) {
    var self= this;

    self.nueva_cuenta={};
    self.nueva_rama=[];

    self.cargar_plan_maestro = function() {
      financieraRequest.get("plan_cuentas", $.param({
        query: "PlanMaestro:" + true
      })).then(function(response) {
        self.plan_maestro = response.data[0]; //Se carga data devuelta por el servicio en la variable del controlador plan_maestro
      });
    };

    self.cargar_plan_maestro();


    $scope.agregar = function() {
      angular.forEach(self.nueva_cuenta.Hijos, function(item){
        var familia={
          CuentaPadre: self.nueva_cuenta,
          CuentaHijo: item,
          PlanCuentas: {Id:2}
        };
        financieraRequest.post('estructura_cuentas', familia).then(function(response){
          console.log(response);
        });
      });

    };

  });

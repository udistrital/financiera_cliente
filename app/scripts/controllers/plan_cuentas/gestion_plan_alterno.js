'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:PlanCuentasGestionPlanAlternoCtrl
 * @description
 * # PlanCuentasGestionPlanAlternoCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionPlanAlternoCtrl', function($scope, financieraRequest, $routeParams, $translate) {
    var self = this;
    self.idPlan = $routeParams.Id;
    //self.nueva_cuenta={};
    self.nueva_rama = [];

    self.cargar_plan_maestro = function() {
      financieraRequest.get("plan_cuentas", $.param({
        query: "PlanMaestro:" + true
      })).then(function(response) {
        self.plan_maestro = response.data[0]; //Se carga data devuelta por el servicio en la variable del controlador plan_maestro
      });
    };

    self.cargar_plan_alterno = function() {
      financieraRequest.get("plan_cuentas", $.param({
        query: "Id:" + $routeParams.Id
      })).then(function(response) {
        self.plan_alterno = response.data[0]; //Se carga data devuelta por el servicio en la variable del controlador plan_maestro
      });
    };

    self.crear_rama = function() {
      var rama = [];
      angular.copy(self.nueva_rama, rama);
      angular.forEach(rama, function(item, index) {
        if (rama[index + 1] !== undefined) {
          rama[index + 1].Hijos = [];
          rama[index + 1].Hijos.push(item);
        } else {
          self.rama_unica = item;
        }
      });
      financieraRequest.post("arbol_plan_cuentas" + "/" + self.plan_alterno.Id, self.rama_unica).then(function(response) {
        swal('', $translate.instant(response.data.Code), response.data.Type);
      }).finally(function() {
        $scope.recargar_arbol = !$scope.recargar_arbol;
      });
    };

    self.quitar_cuenta = function() {
      financieraRequest.delete('arbol_plan_cuentas', self.cuenta_plan.Id + "/" + self.plan_alterno.Id).then(function(response) {
        swal('', $translate.instant(response.data.Code), response.data.Type);
      }).finally(function() {
        $scope.recargar_arbol = !$scope.recargar_arbol;
        self.cuenta_plan = undefined;
      });
    };

    self.cargar_plan_maestro();
    self.cargar_plan_alterno();

    $scope.$watch('gestionPlanAlterno.cuenta_plan', function() {
      if (self.cuenta_plan === undefined) {
        $scope.btn_cancelar = false;
      } else {
        self.nueva_cuenta = undefined;
        $scope.btn_cancelar = true;
      }
    }, true);

    $scope.$watch('gestionPlanAlterno.nueva_cuenta', function() {
      if (self.nueva_cuenta === undefined) {
        $scope.btn_agregar = false;
      } else {
        self.cuenta_plan = undefined;
        $scope.btn_agregar = true;
      }
    }, true);

  });

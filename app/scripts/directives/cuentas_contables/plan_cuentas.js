'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:cuentasContables/planCuentas
 * @description
 * # cuentasContables/planCuentas
 */
angular.module('financieraClienteApp')
  .directive('planCuentas', function(financieraRequest) {
    return {
      restrict: 'E',
      scope: {
        seleccion: '=?',
        filtro: '=?',
        cuentasel: '=?',
        recargar: '=?',
        planid: '='
      },
      templateUrl: 'views/directives/cuentas_contables/plan_cuentas.html',
      controller: function($scope) {
        var self = this;

        self.treeOptions = {
          nodeChildren: "Hijos",
          dirSelectable: true,
          injectClasses: {
            ul: "a1",
            li: "a2",
            liSelected: "a7",
            iExpanded: "a3",
            iCollapsed: "a4",
            iLeaf: "a5",
            label: "a6",
            labelSelected: "a8"
          }
        };

        self.cargar_arbol = function() {
          financieraRequest.get("plan_cuentas", $.param({
            query: "Id:" + $scope.planid
          })).then(function(response) {
            self.plan = response.data[0];
            financieraRequest.get("arbol_plan_cuentas/" + self.plan.Id, "").then(function(response) {
              self.plan_cuentas = response.data;
            });
          });
        }

        $scope.$watch("recargar", function() {
          self.cargar_arbol();
        });

        self.seleccionar_cuenta = function(cuenta) {
          $scope.seleccion = cuenta;
        };

      },
      controllerAs: 'd_planCuentas'
    };
  });

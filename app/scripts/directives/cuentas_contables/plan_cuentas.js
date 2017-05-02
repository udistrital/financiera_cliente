'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:planCuentas
 * @restrict E
 * @scope
 * @requires financieraService.service:financieraRequest
 * @requires $scope
 * @param {object} seleccion cuenta seleccionada en el panel
 * @param {object|string|int} filtro dato para filtrar por cualquier atributo en la estructura
 * @param {object} cuentasel cuenta seleccionada en la estructura
 * @param {undefined} recargar dato de cualquier tipo que al cambiar recarga la estructura
 * @param {string|int} planid Id del plan de cuentas a cargarse
 * @description
 * # planCuentas
 * Directiva en la cual se muestra la estructura de cuentas de cualquier plan de cuentas que sea pasado por el scope de la misma
 */
angular.module('financieraClienteApp')
  .directive('planCuentas', function(financieraRequest) {
    return {
      restrict: 'E',
      //variables del scope de la directiva
      scope: {
        seleccion: '=?',
        filtro: '=?',
        cuentasel: '=?',
        recargar: '=?',
        planid: '='
      },
      templateUrl: 'views/directives/cuentas_contables/plan_cuentas.html', //url del template de la directiva
      controller: function($scope) {
        var self = this;

        /**
         * @ngdoc function
         * @name financieraClienteApp.directive:planCuentas#seleccionar_cuenta
         * @methodOf financieraClienteApp.directive:planCuentas
         * @param {object} cuenta cuenta seleccionada en el panel
         * @description Asigna la cuenta seleccionada en el panel y lo envia a la variable del scope
         */
        self.seleccionar_cuenta = function(cuenta) {
          $scope.seleccion = cuenta;
        };

        //Opciones para el componente angular-tree-control
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

        /**
         * @ngdoc function
         * @name financieraClienteApp.directive:planCuentas#cargar_arbol
         * @methodOf financieraClienteApp.directive:planCuentas
         * @description Recarga la estructura del plan de cuentas con el id adquirido por el scope haciendo uso del servicio {@link financieraService.service:financieraRequest financieraRequest}
         */
        self.cargar_arbol = function() {
          financieraRequest.get("plan_cuentas", $.param({
            query: "Id:" + $scope.planid
          })).then(function(response) {
            self.plan = response.data[0];
            financieraRequest.get("arbol_plan_cuentas/" + self.plan.Id, "").then(function(response) {
              self.plan_cuentas = response.data;
            });
          });
        };

        /**
         * @ngdoc event
         * @name financieraClienteApp.directive:planCuentas#watch_on_recargar
         * @eventOf financieraClienteApp.directive:planCuentas
         * @param {undefined} recargar variable que activa el evento
         * @description Si la variable recargar tiene un cambio el evento se activa recargando la estructura del plan de cuentas por la funcion cargar_arbol
         */
        $scope.$watch("recargar", function() {
          self.cargar_arbol();
        }, true);

      },
      controllerAs: 'd_planCuentas' //alias del controlador de la directiva
    };
  });

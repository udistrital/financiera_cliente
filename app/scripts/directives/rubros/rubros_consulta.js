'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:rubrosConsulta
 * @restrict E
 * @scope
 * @requires financieraService.service:financieraRequest
 * @requires $scope
 * @param {object} seleccion seleccion del rubro en el arbol
 * @param {object|string|int} filtro dato para filtrar por cualquier atributo en la estructura
 * @param {object} rubrosel rubro seleccionado en la estructura
 * @param {undefined} recargar dato de cualquier tipo que al cambiar recarga la estructura
 * @param {string|int} rubroid Id del rubro
 * @description
 * # rubrosConsulta
 * Directiva en la cual se muestra la estructura de los rubros presupuestales registrados y permita la seleccion de estos
 */
angular.module('financieraClienteApp')
  .directive('rubrosConsulta', function(financieraRequest, $timeout) {
    return {
      restrict: 'E',
      scope: {
        seleccion: '=?',
        filtro: '=?',
        rubrosel: '=?',
        recargar: '=?',
        rubroid: '=?',
        arbol: '=?',
        noresumen: '@?',
        ramasel: '=?'
      },
      templateUrl: 'views/directives/rubros/rubros_consulta.html',
      controller: function($scope) {
        var self = this;
        self.treeOptions = {
          nodeChildren: "Hijos",
          dirSelectable: $scope.ramasel,

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
         * @name financieraClienteApp.directive:rubrosConsulta#cargar_arbol
         * @methodOf financieraClienteApp.directive:rubrosConsulta
         * @description Recarga la estructura de los rubros haciendo uso del servicio {@link financieraService.service:financieraRequest financieraRequest}
         */
        self.cargar_arbol = function() {
          financieraRequest.get("rubro/ArbolRubros", "").then(function(response) {
            $scope.arbol = [];
            if (response.data !== null) {
              $scope.arbol = response.data;

            }
          });

        };

        self.expandedNodes = [];
        /**
         * @ngdoc function
         * @name financieraClienteApp.directive:rubrosConsulta#expandAllNodes
         * @methodOf financieraClienteApp.directive:rubrosConsulta
         * @description funcion para expandir recursivamente los nodos del arbol de rubros
         */
        self.expandAllNodes = function (tree) {
          angular.forEach(tree, function(leaf){
            if (leaf.Hijos) {
              self.expandedNodes.push(leaf);
              self.expandAllNodes(leaf.Hijos);

            }
          });

        };

        /**
         * @ngdoc event
         * @name financieraClienteApp.directive:rubrosConsulta#watch_on_filtro
         * @eventOf financieraClienteApp.directive:rubrosConsulta
         * @param {undefined} filtro variable que activa el evento
         * @description si esta variable cambia se expanden los nodos del arbol para facilitar su busqueda
         */
        $scope.$watch("filtro", function() {
          if ($scope.filtro !== "" && $scope.filtro !== undefined) {
            $timeout(function(){self.expandAllNodes($scope.arbol);}, 2000); 
            //self.expandAllNodes($scope.arbol);
          }else {
            self.expandedNodes = [];
          }
        }, true);

        /**
         * @ngdoc event
         * @name financieraClienteApp.directive:rubrosConsulta#watch_on_recargar
         * @eventOf financieraClienteApp.directive:rubrosConsulta
         * @param {undefined} recargar variable que activa el evento
         * @description si esta variable cambia se actualiza el arbol
         */
        $scope.$watch("recargar", function() {
          self.cargar_arbol();
        }, true);

        $scope.showSelected = function(node, $path) {
          $scope.ramasel = $path();
        };
        self.cargar_arbol();


      },
      controllerAs: 'd_rubrosConsulta'
    };
  });

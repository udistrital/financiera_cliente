'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:rubros/rubrosConsulta
 * @description
 * # rubros/rubrosConsulta
 */
angular.module('financieraClienteApp')
  .directive('rubrosConsulta', function(financieraRequest) {
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

        self.cargar_arbol = function() {
          financieraRequest.get("rubro/ArbolRubros", "").then(function(response) {
            $scope.arbol = [];
            if (response.data !== null) {
              $scope.arbol = response.data;

            }
          });

        };

        self.expandedNodes = [];

        self.expandAllNodes = function (tree) {
          angular.forEach(tree, function(leaf){
            if (leaf.Hijos) {
              self.expandedNodes.push(leaf);
              self.expandAllNodes(leaf.Hijos);

            }
          });

        };

        $scope.$watch("filtro", function() {
          if ($scope.filtro !== "") {
            self.expandAllNodes($scope.arbol);
          }else {
            self.expandedNodes = [];
          }
        }, true);
        $scope.showSelected = function(node, $path) {
          $scope.ramasel = $path();
        };
        self.cargar_arbol();


      },
      controllerAs: 'd_rubrosConsulta'
    };
  });

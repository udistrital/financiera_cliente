'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:conceptos/arbolConceptos
 * @description
 * # conceptos/arbolConceptos
 */
angular.module('financieraClienteApp')
  .directive('arbolConceptos', function(financieraRequest) {
    return {
      restrict: "E",
      scope: {
        seleccion: '=?',
        filtro: '=?',
        conceptosel: '=?',
        recargar: '=?',
        rdesc: '=?'
      },
      templateUrl: "views/directives/conceptos/arbol_conceptos.html",
      controller: function($scope,$attrs) {
        var self = this;
        self.padre = {};
        self.arbol_conceptos = [];

        financieraRequest.get("arbol_conceptos", "").then(function(response) {
          self.arbol_conceptos = response.data;
        });
        $scope.rvdesc='rdesc' in $attrs;
        $scope.$watch("recargar",function(){
          financieraRequest.get("arbol_conceptos", "").then(function(response) {
            console.log("recargo!");
            self.arbol_conceptos = response.data;
          });
        },true);

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

        self.seleccionar_concepto = function(concepto) {
          $scope.seleccion = concepto;
        };


      },
      controllerAs: "d_arbolConceptos"
    };
  });

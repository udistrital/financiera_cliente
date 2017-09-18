'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:apropiacion/apropiacionConsulta
 * @description
 * # apropiacion/apropiacionConsulta
 */
angular.module('financieraClienteApp')
  .directive('apropiacionConsulta', function (financieraRequest) {
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
        ramasel: '=?',
        vigencia: '=?',
      },
      templateUrl: 'views/directives/apropiacion/apropiacion_consulta.html',
      controller:function($scope, $translate){
        var self = this;
        $scope.botones = [
          { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
          { clase_color: "editar", clase_css: "fa fa-pencil fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.EDITAR'), operacion: 'edit', estado: true },
        ];
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
          financieraRequest.get("apropiacion/ArbolApropiaciones/2017", "").then(function(response) {
            $scope.arbol = [];
            if (response.data !== null) {
              $scope.arbol = response.data;

            }
          });

        };

        self.arbol_operacion = function(nodo, operacion){
          self.operacion = operacion;
          
          switch (operacion) {
              case "ver":
                  $("#myModal").modal();
                  self.apropiacionsel = null;
                  self.apropiacionsel = nodo;
                  break;
              case "add":
                  break;
              case "edit":
                  break;
              case "delete":
                  break;
              case "config":
                  break;
              default:
          }
        }

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
          
          if (self.expandedNodes.length === 0){
            self.expandAllNodes($scope.arbol);
          }
          
              if ($scope.filtro !== '' && $scope.filtro !== undefined){
                
              }else{
                self.expandedNodes.length = 0;
              }
             
             
           
        }, true);
        
        
        $scope.$watch("recargar", function() {
          self.cargar_arbol();
        }, true);

        $scope.showSelected = function(node, $path) {
          $scope.ramasel = $path();
        };
        self.cargar_arbol();
      },
      controllerAs:'d_apropiacionConsulta'
    };
  });

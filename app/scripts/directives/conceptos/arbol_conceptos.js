'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:conceptos/arbolConceptos
 * @description
 * # conceptos/arbolConceptos
 */
angular.module('financieraClienteApp')
  .directive('arbolConceptos', function(financieraRequest,$translate) {
    return {
      restrict: "E",
      scope: {
        seleccion: '=?',
        filtro: '=?',
        conceptosel: '=?',
        recargar: '=?',
        rdesc: '=?',
        nohead: '=?',
        btnselnom: '=?'
      },
      templateUrl: "views/directives/conceptos/arbol_conceptos.html",
      controller: function($scope,$attrs) {
        var self = this;
        self.padre = {};
        self.arbol_conceptos = [];


        self.multiSelect = "multiselect" in $attrs;


        financieraRequest.get("arbol_conceptos", "").then(function(response) {
          self.arbol_conceptos = response.data;
        });
        $scope.rvdesc='rdesc' in $attrs;
        $scope.$watch("recargar",function(){
          $scope.load=true;
          financieraRequest.get("arbol_conceptos", "").then(function(response) {
            self.arbol_conceptos = response.data;
            $scope.load=false;
          });
        },true);


        $scope.$watch("conceptosel",function(){
          console.log("concepto seleccionado ",$scope.conceptosel);
            if (self.multiSelect && !angular.isUndefined($scope.conceptosel)){
              self.algo_fue_seleccionado=false;
            }
        },true);


        $scope.vtitle=!('nohead' in $attrs);
        $scope.btnsel=('btnselnom' in $attrs)?$scope.btnselnom:$translate.instant('BTN.SELECCIONAR');
        self.treeOptions = {
          nodeChildren: "Hijos",
          dirSelectable: true,
          injectClasses: {
            ul: "a1",
            li: "a2",
            liSelected: "a7",
            iExpanded: "a3",
            iCollapsed: "a4",
            iLeaf: "a3",
            label: "a6",
            labelSelected: "a8"
          },
          isLeaf:function(node){
            return !(node.Clasificador);
          }
        };
        self.hideShowWindow=function(){
          if(self.multiSelect){
            self.algo_fue_seleccionado=false;
          }else{
            $scope.seleccion=undefined;
            $scope.conceptosel=undefined;
            self.algo_fue_seleccionado=false;
            $scope.showc=false;
          }

        }
        self.seleccionar_concepto = function(concepto) {

          self.temp = $scope.conceptosel;

          if (self.multiSelect===true){

            if($scope.seleccion.indexOf(concepto)===-1){
              concepto.valorAfectacion = 0;
              $scope.seleccion.push(concepto);
            }
          }else{
            $scope.seleccion = concepto;
          }
          $scope.showc=false;
          $scope.conceptosel=undefined;
          self.algo_fue_seleccionado = true;
        };
      },
      controllerAs: "d_arbolConceptos"
    };
  });

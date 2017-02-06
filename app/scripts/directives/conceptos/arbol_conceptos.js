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
        conceptosel: '=?'
      },
      templateUrl: "/views/directives/conceptos/arbol_conceptos.html",
      controller: function($scope) {
        var self = this;
        self.padre = {};
        self.arbol_conceptos = [];

        /*financieraRequest.get("concepto", $.param({
          sortby: "Id",
          order: "asc",
          limit: 0
        })).then(function(response) {
          self.lista_conceptos = response.data;
        });*/

        financieraRequest.get("concepto_concepto/Arbol", "").then(function(response) {
          self.arbol_conceptos = response.data;

          /*if (self.lista_conceptos) {
            self.lista_conceptos.forEach(function(elem){
              var temp =JSON.parse( JSON.stringify( elem ) );
              self.arbol_conceptos.push(self.cargar_rama(temp));
              //self.limpiar_ramas(elem);
            });
            delete self.relaciones_conceptos;
            delete self.lista_conceptos;
            self.arbol_conceptos.forEach(function(elem){
            self.limpiar_ramas(elem);
            });
          }*/
        });

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

        self.cargar_rama = function(concepto) {
          if (concepto != null) {
            concepto.Hijos = [];
            for (var i = 0; i < self.relaciones_conceptos.length; i++) {
              if (concepto.Id == self.relaciones_conceptos[i].ConceptoPadre.Id) {
                concepto.Hijos.push(self.relaciones_conceptos[i].ConceptoHijo);
              }
            }
            for (var i = 0; i < concepto.Hijos.length; i++) {
              self.cargar_rama(concepto.Hijos[i]);
            }
          }
          return concepto;
        };


        /*    self.cargar_arbol=function(){
              if (self.lista_conceptos) {
                self.lista_conceptos.forEach(function(elem){
                  var temp =JSON.parse( JSON.stringify( elem ) );
                  self.arbol_conceptos.push(self.cargar_rama(temp));
                  //self.limpiar_ramas(elem);
                });
                delete self.relaciones_conceptos;
                delete self.lista_conceptos;
                self.arbol_conceptos.forEach(function(elem){
                self.limpiar_ramas(elem);
                });
              }
              //self.filtro_padre.TipoConcepto.Id=self.tipo_concepto.Id;
            };*/

        /*self.limpiar_ramas=function(concepto){
          if (concepto!=null) {
            for (var i = 0; i < concepto.Hijos.length; i++) {
              for (var j = 0; j < self.arbol_conceptos.length; j++) {
                if (self.arbol_conceptos[j].Id==concepto.Hijos[i].Id) {
                  self.arbol_conceptos.splice(j,1);
                }
                self.limpiar_ramas(concepto.Hijos[i]);
              }
            }
          }
        };*/

        self.seleccionar_concepto = function(concepto) {
          $scope.seleccion = concepto;
        };


      },
      controllerAs: "d_arbolConceptos"
    };
  });

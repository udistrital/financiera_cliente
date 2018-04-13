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
        ramasel: '=?',
        botones: '=?',
      },
      templateUrl: 'views/directives/rubros/rubros_consulta.html',
      controller: function($scope, $translate,$interval) {
        var self = this;
        self.UnidadEjecutora = 1;
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
          financieraRequest.get("rubro/ArbolRubros", $.param({
          UnidadEjecutora: self.UnidadEjecutora
        })).then(function(response) {
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
                  $scope.data = nodo;
                  $("#myModal").modal();
                  break;
              case "add":
                  break;
              case "edit":
                  break;
              case "delete":
                  
                 if (nodo !== undefined){
                  financieraRequest.delete("rubro",nodo.Id).then(function(response){
                    console.log(response.data);
                    if (response.data.Type !== undefined) {
                      if (response.data.Type === "error") {
                          swal('', $translate.instant(response.data.Code), response.data.Type);
                      } else {

                          swal('', $translate.instant(response.data.Code), response.data.Type);
                          $scope.recargar = !$scope.recargar;
                      }

                  }
                  });
                 }
                  break;
              case "config":
                  break;
              default:
          }
        }

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
          
          /*if (self.expandedNodes.length === 0){
            self.expandAllNodes($scope.arbol);
          }
          
              if ($scope.filtro !== '' && $scope.filtro !== undefined){
                
              }else{
                self.expandedNodes.length = 0;
              }*/
             
             
           
        }, true);

        /*$interval(function() {
          self.cargar_arbol();// your code
       }, 5000);*/
        
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
  }).directive('debounceState', function() {
    return {
      require: 'ngModel',
      link: function(s, e, a, c) {
        
        var origDebounce = c.$$debounceViewValueCommit;
        var origCommit = c.$commitViewValue;
        
        c.$$debounceViewValueCommit = function() {
          console.log(c.$debouncing);
          if (!c.$debouncing) {
            s.$apply(function() {
              c.$debouncing = true;  
            })          
          }
  
          origDebounce.apply(this, arguments);
        }
        
        c.$commitViewValue = function() {
          c.$debouncing = false;
          console.log(c.$debouncing);
          origCommit.apply(this, arguments);
        }
      }
    }
  });

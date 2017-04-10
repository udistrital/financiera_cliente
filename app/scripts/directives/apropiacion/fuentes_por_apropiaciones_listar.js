'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:apropiacion/fuentesPorApropiacionesListar
 * @description
 * # apropiacion/fuentesPorApropiacionesListar
 */
angular.module('financieraClienteApp')
  .directive('fuentesPorApropiacionesListar', function (financieraRequest, $timeout) {
    return {
      restrict: 'E',
      scope:{
          apropiacionids:'='
        },
      templateUrl: 'views/directives/apropiaciones/fuentes_por_apropiaciones_listar.html',
      controller:function($scope){
        var self = this;
        self.gridOptions_fuente = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,

          columnDefs : [
            {field: 'Id',                            visible : false},
            {field: 'Fuente.Descripcion',            displayName: 'Descripcion'},
            {field: 'Valor',                         displayName: 'Valor'},
            {field: 'Apropiacion.Rubro.Codigo',      displayName: 'Rubro'}
          ]
        };
        self.gridOptions_fuente.onRegisterApi = function(gridApi){
            //set gridApi on scope
            self.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
              $scope.unidaejecutora = row.entity
            });
          };
          self.gridOptions_fuente.multiSelect = false;
          // refrescar
          self.refresh = function() {
            $scope.refresh = true;
            $timeout(function() {
              $scope.refresh = false;
            }, 0);
          };
          //
          $scope.$watch('apropiacionids', function(){
            self.refresh();
            if($scope.apropiacionids != undefined){
              self.consulta($scope.apropiacionids);
              $scope.gridHeight = self.gridOptions_fuente.rowHeight * 6 + (self.gridOptions_fuente.data.length * self.gridOptions_fuente.rowHeight);

            }
          });
          //
          self.consulta = function(ids){
            self.fuentes = [];
            angular.forEach(ids, function(i){
              financieraRequest.get('fuente_financiacion_apropiacion',
                $.param({ query: 'Apropiacion.Id:' + i })
              ).then(function(response){
                if(response.data){
                  angular.forEach(response.data, function(datas){
                    self.fuentes.push(datas)
                  })
                }
              });
            })
            self.gridOptions_fuente.data = self.fuentes;
          };
          //

        //fin
      },
      controllerAs:'d_fuentesPorApropiacionesListar'
    };
  });

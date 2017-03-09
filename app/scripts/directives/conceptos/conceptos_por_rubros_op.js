'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:conceptos/conceptosPorRubrosOp
 * @description
 * # conceptos/conceptosPorRubrosOp
 */
angular.module('financieraClienteApp')
  .directive('conceptosPorRubrosOp', function (financieraRequest, $timeout) {
    return {
      restrict: 'E',
      scope:{
        rubroids:'=?',
        conceptos: '=?'
        },

      templateUrl: '/views/directives/conceptos/conceptos_por_rubros_op.html',
      controller:function($scope){
        var self = this;
        self.conceptos = [];
        self.gridOptions_conceptos = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          columnDefs : [
            {field: 'Id',                         visible : false},
            {field: 'Codigo',                     displayName: 'Codigo'},
            {field: 'Nombre',                     displayName: 'Nombre'},
            {field: 'TipoConcepto.Nombre',        displayName: 'Tipo'}
          ]
        };
        // refrescar
        self.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };
        //
        self.consulta = function(ids){
          console.log("1-consulta")
          angular.forEach(ids, function(i){
            financieraRequest.get('concepto',
            $.param({
              query: "Rubro.Id:" + i,
              limit:0
            })
            ).then(function(response) {
              if(response.data){
                angular.forEach(response.data, function(datas){
                    self.conceptos.push(datas);
                });
              }
            });
          });
          console.log(self.conceptos);
          self.gridOptions_conceptos.data = self.conceptos;
        }

        $scope.$watch('rubroids', function(){
          self.refresh();
          if ($scope.rubroids){
            //
            console.log($scope.rubroids)
            console.log(self.consulta($scope.rubroids))

          }
        })

        self.gridOptions_conceptos.onRegisterApi = function(gridApi){
            //set gridApi on scope
            self.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
              $scope.conceptos = row.entity
            });
          };
          self.gridOptions_conceptos.multiSelect = false;

        // fin
      },
      controllerAs:'d_conceptosPorRubrosOp'
    };
  });

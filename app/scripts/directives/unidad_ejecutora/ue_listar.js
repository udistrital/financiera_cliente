'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:unidadEjecutora/ueListar
 * @description
 * # unidadEjecutora/ueListar
 */
angular.module('financieraClienteApp')
  .directive('ueListar', function (financieraRequest, $translate) {
    return {
      restrict: 'E',
      scope:{
          unidaejecutora:'=',
          inputpestanaabierta: '=?',
        },

      templateUrl: 'views/directives/unidad_ejecutora/ue_listar.html',
      controller:function($scope){
        var self = this;
        self.gridOptions_unidad_ejecutora = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,

          paginationPageSizes: [5, 10, 15],
          paginationPageSize: null,

          enableFiltering: true,
          enableSelectAll: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          minRowsToShow: 6,
          useExternalPagination: false,

          columnDefs : [
            {field: 'Id',             visible : false},
            {field: 'Nombre',         displayName: $translate.instant('NOMBRE')},
            {field: 'Descripcion',    displayName: $translate.instant('DESCRIPCION')}
          ]
        };
        // Data para grid
        financieraRequest.get('unidad_ejecutora','limit=0').then(function(response) {
          self.gridOptions_unidad_ejecutora.data = response.data;
        });
        // select registro
        self.gridOptions_unidad_ejecutora.onRegisterApi = function(gridApi){
            //set gridApi on scope
            self.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
              $scope.unidaejecutora = row.entity
            });
          };
          self.gridOptions_unidad_ejecutora.multiSelect = false;
        //
        $scope.$watch('inputpestanaabierta', function() {
          if ($scope.inputpestanaabierta){
            $scope.a = true;
          }
        })
        // Control para aparecer Filtros de ui-grid
        $scope.$watch('[d_ueListar.gridOptions_unidad_ejecutora.paginationPageSize, d_ueListar.gridOptions_unidad_ejecutora.data]', function() {
          if ((self.gridOptions_unidad_ejecutora.data.length <= self.gridOptions_unidad_ejecutora.paginationPageSize || self.gridOptions_unidad_ejecutora.paginationPageSize == null) && self.gridOptions_unidad_ejecutora.data.length > 0) {
            $scope.gridHeight = self.gridOptions_unidad_ejecutora.rowHeight * 2 + (self.gridOptions_unidad_ejecutora.data.length * self.gridOptions_unidad_ejecutora.rowHeight);
            if (self.gridOptions_unidad_ejecutora.data.length <= 5) {
              self.gridOptions_unidad_ejecutora.enablePaginationControls = false;
            }
          } else {
            $scope.gridHeight = self.gridOptions_unidad_ejecutora.rowHeight * 3 + (self.gridOptions_unidad_ejecutora.paginationPageSize * self.gridOptions_unidad_ejecutora.rowHeight);
            self.gridOptions_unidad_ejecutora.enablePaginationControls = true;
          }
        }, true);

        //
      },
      controllerAs:'d_ueListar'
    };
  });

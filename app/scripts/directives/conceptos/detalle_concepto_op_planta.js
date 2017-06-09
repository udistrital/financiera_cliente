'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:conceptos/detalleConceptoOpPlanta
 * @description
 * # conceptos/detalleConceptoOpPlanta
 */
angular.module('financieraClienteApp')
  .directive('detalleConceptoOpPlanta', function (financieraRequest, $translate) {
    return {
      restrict: 'E',
      /*scope:{
          var:'='
        },
      */
      templateUrl: '/views/directives/conceptos/detalle_concepto_op_planta.html',
      controller:function(){
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

      // fin
      },
      controllerAs:'d_detalleConceptoOpPlanta'
    };
  });

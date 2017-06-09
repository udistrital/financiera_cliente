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
      scope:{
          inputidordenpago:'=',
          inputpestanaabierta: '=?',
        },

      templateUrl: '/views/directives/conceptos/detalle_concepto_op_planta.html',
      controller:function($scope){
        var self = this;
        self.gridOptions_concepto_orden_pago = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,

          paginationPageSizes: [5, 10, 15],
          paginationPageSize: null,

          enableFiltering: true,
          enableSelectAll: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          minRowsToShow: 12,
          useExternalPagination: false,

          columnDefs : [
            {field: 'Concepto.Id',             visible : false},
            {field: 'Concepto.Codigo',         displayName: $translate.instant('CODIGO')},
            {field: 'Concepto.Nombre',         displayName: $translate.instant('NOMBRE')},
            {field: 'Concepto.Descripcion',    displayName: $translate.instant('DESCRIPCION')},
            {field: 'Concepto.TipoConcepto.Nombre',    displayName: $translate.instant('TIPO')}
          ]
        };
        //
        $scope.$watch('inputpestanaabierta', function() {
          if ($scope.inputpestanaabierta){
            $scope.a = true;
          }
        })
        // Data para grid
        $scope.$watch('inputidordenpago', function() {
          //get data
          if($scope.inputidordenpago != undefined){
            financieraRequest.get('concepto_orden_pago',
            $.param({
                query: "OrdenDePago.Id:" + $scope.inputidordenpago,
            })).then(function(response) {
              self.gridOptions_concepto_orden_pago.data = response.data;
            });
          }

        })
        // select registro
        self.gridOptions_concepto_orden_pago.onRegisterApi = function(gridApi){
            //set gridApi on scope
            self.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
              $scope.unidaejecutora = row.entity
            });
          };
          self.gridOptions_concepto_orden_pago.multiSelect = false;

      // fin
      },
      controllerAs:'d_detalleConceptoOpPlanta'
    };
  });

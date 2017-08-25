'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:alamcen/entrada
 * @description
 * # alamcen/entrada
 */
angular.module('financieraClienteApp')
  .directive('entradaAlmacen', function (arkaRequest, agoraRequest, $translate) {
    return {
      restrict: 'E',
      scope:{
          inputproveedor: '=',
          inputvigencia: '=',
          inputpestanaabierta: '=?',
          outputentradaalmacenid: '=',
        },
      templateUrl: 'views/directives/alamcen/entrada.html',
      controller:function($scope){
        var self = this;
        self.gridOptions_entrada = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,

          paginationPageSizes: [13, 50, 100],
          paginationPageSize: null,

          enableFiltering: true,
          enableSelectAll: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          minRowsToShow: 13,
          useExternalPagination: false,

          columnDefs: [{
              field: 'Id',
              visible: false
            },
            {
              field: 'Consecutivo',
              displayName: $translate.instant('NO'),
              cellClass: 'input_center',
              width: '8%',
            },
            {
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              cellClass: 'input_center',
              width: '10%',
            },
            {
              field: 'FechaRegistro',
              displayName: $translate.instant('FECHA'),
              cellFilter: "date:'yyyy-MM-dd'",
              cellClass: 'input_center',
              width: '12%',
            },
            {
              field: 'NumeroFactura',
              displayName: $translate.instant('NO') + $translate.instant('FACTURA'),
              cellClass: 'input_center',
              width: '11%',
            },
            {
              field: 'TipoContrato.Descripcion',
              displayName: $translate.instant('TIPO') + ' ' + $translate.instant('CONTRATO'),
            },
            {
              field: 'Observaciones',
              displayName: $translate.instant('OBSERVACIONES'),
            },
          ]
        };
        //
        $scope.$watch('inputproveedor', function() {
          if ($scope.inputpestanaabierta){
            $scope.a = true;
          }
          arkaRequest.get('entrada',
            $.param({
              query: 'Proveedor:' + $scope.inputproveedor,
              limit: -1,
            })
          ).then(function(response){
              self.gridOptions_entrada.data = response.data;
            });
        });
        self.gridOptions_entrada.onRegisterApi = function(gridApi) {
          //set gridApi on scope
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.outputentradaalmacenid = row.entity.Id;
          });
        };
        self.gridOptions_entrada.multiSelect = false;
      // fin
      },
      controllerAs:'d_entrada_almacen'
    };
  });

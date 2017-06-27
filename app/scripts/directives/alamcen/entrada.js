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
          outputentradaalmacen: '=',
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
              field: 'Vigencia',
              displayName: $translate.instant('VIGENCIA'),
              cellClass: 'input_center'
            },
            {
              field: 'Proveedor',
              displayName: $translate.instant('PROVEEDOR')
            },
            {
              field: 'NumeroFactura',
              displayName: $translate.instant('NO') + $translate.instant('FACTURA'),
            },
            {
              field: 'Sede',
              displayName: $translate.instant('SEDE'),
            },
            {
              field: 'Dependencia',
              displayName: $translate.instant('DEPENDENCIA'),
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
            // $.param({
            //   query: 'Proveedor:' + $scope.inputproveedor + ", Vigencia:" + $scope.inputvigencia,
            //   limit: -1
            // })
          ).then(function(response){
              self.gridOptions_entrada.data = response.data;
            });
        });
        self.gridOptions_entrada.onRegisterApi = function(gridApi) {
          //set gridApi on scope
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            $scope.outputentradaalmacen = row.entity;
          });
        };
        self.gridOptions_entrada.multiSelect = false;
      // fin
      },
      controllerAs:'d_entrada_almacen'
    };
  });

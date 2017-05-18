'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:cuentasContables/verDescuentos
 * @description
 * # cuentasContables/verDescuentos
 */
angular.module('financieraClienteApp')
  .directive('verDescuentos', function (financieraRequest, $translate) {
    return {
      restrict: 'E',
      scope:{
          seldesc:'=?',
          cuentasel:'=?'
        },
      templateUrl: 'views/directives/cuentas_contables/ver_descuentos.html',
      controller:function($scope, $attrs){
        console.log($attrs);
        var self = this;
        self.gridOptions = {
          paginationPageSizes: [5, 10, 15],
          paginationPageSize: 5,
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          enableFiltering: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 1,
          useExternalPagination: false,
          enableSelectAll: false,
          columnDefs: [{
              field: 'CuentaContable.Codigo',
              displayName: $translate.instant('CODIGO'),
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              width: '15%'
            },
            {
              field: 'CuentaContable.Nombre',
              displayName: $translate.instant('NOMBRE'),
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              width: '30%'
            },
            {
              field: 'TarifaUvt',
              displayName: $translate.instant('UVT'),
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              width: '5%'
            },
            {
              field: 'Porcentaje',
              displayName: $translate.instant('PORCENTAJE'),
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              width: '9%'
            },
            {
              field: 'Deducible',
              displayName: $translate.instant('DEDUCIBLE'),
              cellTemplate: '<center><input type="checkbox" ng-checked="row.entity.Deducible" disabled></center>',
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              width: '8%'
            },
            {
              field: 'InformacionPersonaJuridica',
              displayName: $translate.instant('PROVEEDOR'),
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              width: '24%'
            },
            {
              field: 'TipoCuentaEspecial.Nombre',
              displayName: $translate.instant('TIPO'),
              headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
              width: '8%'
            }
          ]
        };

        self.gridOptions.multiSelect = false;
        self.gridOptions.modifierKeysToMultiSelect = false;

        self.gridOptions.onRegisterApi = function(gridApi) {
          self.gridApi = gridApi;
          gridApi.selection.on.rowSelectionChanged($scope, function() {
            $scope.seldesc = self.gridApi.selection.getSelectedRows()[0];
            if ('cuentasel' in $attrs) {
              financieraRequest.get('cuenta_contable',$.param({
                query:'Codigo:'+$scope.seldesc.CuentaContable.Codigo
              })).then(function(response){
                $scope.cuentasel=response.data[0];
              });
            }
          });
        };

        self.cargar = function() {
          financieraRequest.get("cuenta_especial", $.param({
            limit: -1
          })).then(function(response) {
            self.gridOptions.data = response.data;
          });
        };

        self.cargar();

        $scope.$watch('[d_verDescuentos.gridOptions.paginationPageSize,d_verDescuentos.gridOptions.data]', function() {
          if ((self.gridOptions.data.length <= self.gridOptions.paginationPageSize || self.gridOptions.paginationPageSize == null) && self.gridOptions.data.length > 0) {
            $scope.gridHeight = self.gridOptions.rowHeight * 2 + (self.gridOptions.data.length * self.gridOptions.rowHeight);
            if (self.gridOptions.data.length <= 5) {
              self.gridOptions.enablePaginationControls = false;
            }
          } else {
            $scope.gridHeight = self.gridOptions.rowHeight * 3 + (self.gridOptions.paginationPageSize * self.gridOptions.rowHeight);
            self.gridOptions.enablePaginationControls = true;
          }
        }, true);

      },
      controllerAs:'d_verDescuentos'
    };
  });

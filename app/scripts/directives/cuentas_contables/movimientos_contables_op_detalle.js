'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:cuentasContables/movimientosContablesOpDetalle
 * @description
 * # cuentasContables/movimientosContablesOpDetalle
 */
angular.module('financieraClienteApp')

  .directive('movimientosContablesOpDetalle', function(financieraRequest, $timeout, $translate, uiGridConstants) {
    return {
      restrict: 'E',
      scope: {
        codigodocumentoafectante:'=?',
        panel:'=?',
        selection:'=?',
        debitos:'=?',
        creditos:'=?'
      },

      templateUrl: 'views/directives/cuentas_contables/movimientos_contables_op_detalle.html',
      controller: function($scope) {
        var self = this;
        self.cargando = false;
        self.hayData = true;

        self.gridOptions_movimientos = {
          paginationPageSizes: [5, 15, 20],
          paginationPageSize: 5,
          enableFiltering: true,
          enableSorting: true,
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          enableSelectAll: true,
          selectionRowHeaderWidth: 35,
          columnDefs: [{
              field: 'Id',
              visible: false
            },
            {
              field: 'CuentaContable.Codigo',
              displayName: $translate.instant('CODIGO'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'CuentaContable.Nombre',
              displayName: $translate.instant('CUENTA'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            },
            {
              field: 'Debito',
              displayName: $translate.instant('DEBITO'),
              cellFilter: 'currency',
              aggregationType: uiGridConstants.aggregationTypes.sum,
              footerCellTemplate: '<div> Total {{col.getAggregationValue() | currency}}</div>',
              footerCellClass: 'input_right',
              cellClass: 'input_right',
              headerCellClass: 'encabezado'
            },
            {
              field: 'Credito',
              displayName: $translate.instant('CREDITO'),
              cellFilter: 'currency',
              aggregationType: uiGridConstants.aggregationTypes.sum,
              footerCellTemplate: '<div> Total {{col.getAggregationValue() | currency}}</div>',
              footerCellClass: 'input_right',
              cellClass: 'input_right',
              headerCellClass: 'encabezado'
            },
            {
              field: 'CuentaContable.Naturaleza',
              displayName: $translate.instant('NATURALEZA'),
              cellClass: 'input_center',
              headerCellClass: 'encabezado'
            }
          ]
        };

        self.activateSelection = function(){
          if ($scope.selection = true) {
            self.gridOptions_movimientos.enableRowHeaderSelection = true;
            self.gridOptions_movimientos.enableSelectAll= true;
          }
        }
        self.activateSelection();
        // refrescar
        self.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };
        // operar_repetidos
        self.totalizar_cuentas_repetidas = function(movimientos) {
          self.retornar_movimientos = movimientos;
          // quitar repetidos
          var hash = {};
          self.retornar_movimientos = self.retornar_movimientos.filter(function(current) {
            var exists = !hash[current.CuentaContable.Codigo] || false;
            hash[current.CuentaContable.Codigo] = true;
            return exists;
          });
          //
          $scope.counter = {};
          // contar los repetidos
          movimientos.forEach(function(obj) {
            var key = obj.CuentaContable.Codigo;
            $scope.counter[key] = ($scope.counter[key] || 0) + 1;
          });
          // sumar
          angular.forEach($scope.counter, function(value, key) {
            if (value > 1) {
              var debito = 0;
              var credito = 0;
              angular.forEach(movimientos, function(movimiento) {

                if (movimiento.CuentaContable.Codigo === key) {
                  credito = credito + movimiento.Credito;
                  debito = debito + movimiento.Debito;
                }
              });
              //asigno totales
              angular.forEach(self.retornar_movimientos, function(mov_sin_repe) {

                if (mov_sin_repe.CuentaContable.Codigo === key) {
                  mov_sin_repe.Credito = credito;
                  mov_sin_repe.Debito = debito;
                }
              });
              //asigno totales
            }
          });
          return self.retornar_movimientos;
        };


        $scope.$watch('codigodocumentoafectante', function() {
          self.refresh();



          if ($scope.codigodocumentoafectante !== undefined) {

            self.gridOptions_movimientos.data = [];
            self.cargando = true;
            self.hayData = true;

            financieraRequest.get('movimiento_contable',
              $.param({
                query: "TipoDocumentoAfectante.Id:1,CodigoDocumentoAfectante:" + $scope.codigodocumentoafectante,
                limit: 0,
              })).then(function(response) {

              if(response.data === null){
                self.hayData = false;
                self.cargando = false;
                self.gridOptions_movimientos.data = [];
              }else{
                self.hayData = true;
                self.cargando = false;
                self.gridOptions_movimientos.data = self.totalizar_cuentas_repetidas(response.data);
                $scope.gridHeight = self.gridOptions_movimientos.rowHeight * 4 + (self.gridOptions_movimientos.data.length * self.gridOptions_movimientos.rowHeight);

              }
              //self.gridOptions_movimientos.data = response.data


            });
          }
        });

        self.gridOptions_movimientos.onRegisterApi = function(gridApi) {
          //set gridApi on scope
          self.gridApi = gridApi;

          /* Se comenta ya que las sumas no están siendo visualizadas en este momento
          gridApi.selection.on.rowSelectionChanged($scope, function(row) {
            if (angular.isUndefined($scope.debitos)){
                $scope.debitos=0;
            }
            if (angular.isUndefined($scope.creditos)){
                $scope.creditos=0;
            }
            if(row.isSelected){
              $scope.debitos=$scope.debitos + row.entity.Debito;
              $scope.creditos=$scope.creditos + row.entity.Credito;
            }else{
              $scope.debitos=$scope.debitos - row.entity.Debito;
              $scope.creditos=$scope.creditos - row.entity.Credito;
            }
            console.log("Suma debitos",$scope.debitos,"suma credito",$scope.creditos);
          });

          gridApi.selection.on.rowSelectionChangedBatch($scope, function(row) {
            $scope.sumaDebitos=0;
            gridApi.selection.getSelectedGridRows().forEach(function(row) {
                  if(row.isSelected){
                    $scope.debitos=$scope.debitos + row.entity.Debito;
                    $scope.creditos=$scope.creditos + row.entity.Credito;
                  }
                });
            });
                    */
        };

        //self.gridOptions_movimientos.multiSelect = false;
        //
      },
      controllerAs: 'd_movimientosContablesOpDetalle'
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:cuentasContables/movimientosContablesOpDetalle
 * @description
 * # cuentasContables/movimientosContablesOpDetalle
 */
angular.module('financieraClienteApp')

  .directive('movimientosContablesOpDetalle', function(financieraRequest, $timeout, $translate, uiGridConstants, $interval) {
    return {
      restrict: 'E',
      scope: {
        codigodocumentoafectante:'=?',
        panel:'=?',
        selection:'=?',
        inputpestanaabierta:'=?',
        cuentaselecc:'=?'
      },
      templateUrl: 'views/directives/cuentas_contables/movimientos_contables_op_detalle.html',
      controller: function($scope,$attrs) {
        var self = this;
        self.cargando = false;
        self.hayData = true;
        self.abierta = $scope.abierta;
        self.devolucionesTrib = 'devolt' in $attrs;


        self.gridOptions_movimientos = {
          paginationPageSizes: [5, 15, 20],
          paginationPageSize: 5,
          enableFiltering: true,
          enableSorting: true,
          enableRowSelection: false,
          enableRowHeaderSelection: false,
          enableSelectAll: false,
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
          ],
          onRegisterApi : function(gridApi) {
            self.gridApriCuentas= gridApi;
            if(self.devolucionesTrib){
              gridApi.selection.on.rowSelectionChanged($scope, function(row) {
                  $scope.cuentaselecc = gridApi.selection.getSelectedRows();
                  //gridApi.selection.clearSelectedRows();
              });
              gridApi.selection.on.rowSelectionChangedBatch($scope,function(row){
                $scope.cuentaselecc = gridApi.selection.getSelectedRows();

              });
            }
          },
          isRowSelectable: function(row){
            return row.entity.Credito > 0;
          }
        };

        self.activateSelection = function(){
          if ($scope.selection = true) {
            self.gridOptions_movimientos.enableSelectAll= true;
            self.gridOptions_movimientos.enableRowSelection = true;
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


        $scope.$watch('inputpestanaabierta', function(newvalue) {

            if(newvalue){
              $interval( function() {
                  self.gridApriCuentas.core.handleWindowResize();
                }, 500, 2);
            }else{
              console.log('inputpestanacerrada');

              self.gridApriCuentas.selection.clearSelectedRows();

            }
          },true);
        //self.gridOptions_movimientos.multiSelect = false;
        //
      },
      controllerAs: 'd_movimientosContablesOpDetalle'
    };
  });

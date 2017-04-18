'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:cuentasContables/movimientosContablesOpDetalle
 * @description
 * # cuentasContables/movimientosContablesOpDetalle
 */
angular.module('financieraClienteApp')
  .directive('movimientosContablesOpDetalle', function (financieraRequest, $timeout) {
    return {
      restrict: 'E',
      scope:{
          codigodocumentoafectante:'=?'
        },

      templateUrl: 'views/directives/cuentas_contables/movimientos_contables_op_detalle.html',
      controller:function($scope){
        var self = this;
        self.gridOptions_movimientos = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          columnDefs : [
            {field: 'Id',                                                     visible : false},
            {field: 'ConceptoCuentaContable.CuentaContable.Codigo',           displayName: 'Código Cuenta'},
            {field: 'ConceptoCuentaContable.CuentaContable.Nombre',           displayName: 'Nombre Cuenta'},
            {field: 'Debito',                                                 displayName: 'Debito'},
            {field: 'Credito',                                                displayName: 'Credito'},
            {field: 'ConceptoCuentaContable.CuentaContable.Naturaleza',       displayName: 'Naturaleza'}
          ]
        };
        // refrescar
        self.refresh = function() {
          $scope.refresh = true;
          $timeout(function() {
            $scope.refresh = false;
          }, 0);
        };
        // operar_repetidos
        self.totalizar_cuentas_repetidas = function(movimientos){
          self.retornar_movimientos = movimientos;
          // quitar repetidos
          var hash = {};
          self.retornar_movimientos = self.retornar_movimientos.filter(function(current) {
            var exists = !hash[current.ConceptoCuentaContable.CuentaContable.Codigo] || false;
            hash[current.ConceptoCuentaContable.CuentaContable.Codigo] = true;
            return exists;
          });
          //
          $scope.counter  = {};
          // contar los repetidos
          movimientos.forEach(function(obj) {
              var key = obj.ConceptoCuentaContable.CuentaContable.Codigo
              $scope.counter[key] = ($scope.counter[key] || 0) + 1
          })
          // sumar
          angular.forEach($scope.counter, function(value, key){
            if(value > 1){
              var debito = 0;
              var credito = 0;
              angular.forEach(movimientos, function(movimiento){
                if(movimiento.ConceptoCuentaContable.CuentaContable.Codigo == key){
                  credito = credito + movimiento.Credito;
                  debito = debito + movimiento.Debito;
                }
              })
              //asigno totales
              angular.forEach(self.retornar_movimientos,function(mov_sin_repe){
                if(mov_sin_repe.ConceptoCuentaContable.CuentaContable.Codigo == key){
                  mov_sin_repe.Credito = credito;
                  mov_sin_repe.Debito = debito;
                }
              })
              //asigno totales
            }
          })
          return self.retornar_movimientos
        }

        $scope.$watch('codigodocumentoafectante', function(){
          self.refresh();
          if($scope.codigodocumentoafectante != undefined){
            financieraRequest.get('movimiento_contable',
              $.param({
                  query: "TipoDocumentoAfectante.Id:1,CodigoDocumentoAfectante:" + $scope.codigodocumentoafectante,
                  limit: 0,
              })).then(function(response) {
                //self.gridOptions_movimientos.data = response.data
                self.gridOptions_movimientos.data = self.totalizar_cuentas_repetidas(response.data)
            });
          }
        })

        self.gridOptions_movimientos.onRegisterApi = function(gridApi){
            //set gridApi on scope
            self.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
              $scope.movimientos = row.entity;
            });
          };
          self.gridOptions_movimientos.multiSelect = false;
      //
      },
      controllerAs:'d_movimientosContablesOpDetalle'
    };
  });

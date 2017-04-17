'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:cuentasContables/movimientosContablesOpDetalle
 * @description
 * # cuentasContables/movimientosContablesOpDetalle
 */
angular.module('financieraClienteApp')
  .directive('movimientosContablesOpDetalle', function (financieraRequest) {
    return {
      restrict: 'E',
      scope:{
          codigodocumentoafectante:'='
        },

      templateUrl: 'views/directives/cuentas_contables/movimientos_contables_op_detalle.html',
      controller:function($scope){
        var self = this;

        self.gridOptions_movimientos = {
          enableRowSelection: true,
          enableRowHeaderSelection: false,

          columnDefs : [
            {field: 'Id',                                                   visible : false},
            {field: 'ConceptoCuentaContable.CuentaContable.Codigo',         displayName: 'Código Cuenta'},
            {field: 'ConceptoCuentaContable.CuentaContable.Nombre',         displayName: 'Nombre Cuenta'},
            {field: 'Debito',                                               displayName: 'Debito'},
            {field: 'Credito',                                              displayName: 'Credito'},
            {field: 'ConceptoCuentaContable.CuentaContable.Naturaleza',     displayName: 'Naturaleza'}
          ]
        };
        // TipoDocumentoAfectante # 1 son las ordenes de pago
        $scope.$watch('codigodocumentoafectante', function(){
          console.log('AAAAAA');
          console.log($scope.codigodocumentoafectante);

          if($scope.codigodocumentoafectante != undefined){
            console.log('BBBBBB');
            financieraRequest.get('movimiento_contable',
              $.param({
                  query: "TipoDocumentoAfectante.Id:1,CodigoDocumentoAfectante:"+$scope.codigodocumentoafectante,
                  limit: 0,
              })).then(function(response) {
                console.log(response.data)
                self.gridOptions_movimientos = response.data;
            });
          }
        })
        //
        self.gridOptions_movimientos.onRegisterApi = function(gridApi){
            //set gridApi on scope
            self.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
              $scope.unidaejecutora = row.entity
            });
          };
          self.gridOptions_movimientos.multiSelect = false;


      //
      },
      controllerAs:'d_movimientosContablesOpDetalle'
    };
  });

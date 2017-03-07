'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:cuentasContables/movimientosContables
 * @description
 * # cuentasContables/movimientosContables
 */
angular.module('financieraClienteApp')
  .directive('movimientosContables', function(financieraRequest,uiGridConstants) {
    return {
      restrict: 'E',
      scope: {
        conceptoid: '=',
        movimiento: '=?'        
      },
      templateUrl: 'views/directives/cuentas_contables/movimientos_contables.html',
      controller: function($scope) {
        var self = this;

        $scope.$watch('d_movimientosContables.gridOptions.data',function(){
          self.suma1 = 0;
          self.suma2 = 0;
          for (var i = 0; i < self.gridOptions.data.length; i++) {
            self.suma1 =self.suma1 + self.gridOptions.data[i].Debito;
            self.suma2  =self.suma2 + self.gridOptions.data[i].Credito;
          }
          if (self.suma1 == self.suma2) {
            self.doble_partida=true;
          }else{
            self.doble_partida=false;
          }
          console.log(self.suma1 + "=" + self.suma2+","+self.doble_partida);

        },true);


        self.gridOptions = {
          showColumnFooter: true,
          enableCellEditOnFocus: true,
          rowHeight: 40,
          enableHorizontalScrollbar: true,
          enableRowHeaderSelection: false,
          enableFiltering: false,
          enableSorting: true,
          treeRowHeaderAlwaysVisible: false,
          showTreeExpandNoChildren: true,
          rowEditWaitInterval: -1,
          columnDefs: [{
              field: 'CuentaContable.Codigo',
              displayName: 'Codigo Cuenta',
              cellClass: 'text-success',
              headerCellClass: 'text-info',
              cellTooltip: function(row, col) {
                return row.entity.CuentaContable.NivelClasificacion.Nombre;
              },
              enableCellEdit: false,
              width: '20%'
            },
            {
              field: 'CuentaContable.Nombre',
              displayName: 'Nombre Cuenta',
              cellClass: 'text-success',
              headerCellClass: 'text-info',
              cellTooltip: function(row, col) {
                return row.entity.CuentaContable.Nombre+": \n"+row.entity.CuentaContable.Descripcion;
              },
              enableCellEdit: false,
              width: '25%'
            },
            {
              field: 'Debito',
              headerCellClass: 'text-info',
              cellTemplate:'<div ng-init="row.entity.Debito=0">{{row.entity.Debito}}</div>',
              width: '20%',
              enableCellEdit: true,
              type:'number',
              aggregationType: uiGridConstants.aggregationTypes.sum
            },
            {
              field: 'Credito',
              width: '20%',
              headerCellClass: 'text-info',
              type:'number',
              enableCellEdit: true,
              cellTemplate:'<div ng-init="row.entity.Credito=0">{{row.entity.Credito}}</div>',
              aggregationType: uiGridConstants.aggregationTypes.sum
            },
            {
              field: 'CuentaContable.Naturaleza',
              displayName: 'Naturaleza',
              headerCellClass: 'text-info',
              enableCellEdit: false,
              width: '15%'
            }
          ]

        };

        financieraRequest.get('concepto_cuenta_contable', $.param({
          query: "Concepto:" + $scope.conceptoid,
          limit: 0
        })).then(function(response) {
          self.gridOptions.data = response.data;
          $scope.gridHeight = self.gridOptions.rowHeight*2 + (self.gridOptions.data.length * self.gridOptions.rowHeight);
        });

        /*
        $scope.gridWidtht=0;
        for (var i = 0; i < self.gridOptions.columnDefs.length; i++) {
          $.each(self.gridOptions.columnDefs[i], function(k, v) {
            if (k=='width') {
              console.log(k + "is" + v);
              $scope.gridWidtht = $scope.gridWidtht+Number(v);
              console.log($scope.gridWidtht);
            }
          });
        }
        */



        self.comparar = function(){

        };


      },
      controllerAs: 'd_movimientosContables'
    };
  });

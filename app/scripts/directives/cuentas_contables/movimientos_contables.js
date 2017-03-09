'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:movimientosContables
 * @description directiva para la gestión de movimientos contables
 * #movimientosContables
 */

angular.module('financieraClienteApp')
  .directive('movimientosContables', function(financieraRequest, uiGridConstants) {
    return {
      restrict: 'E',
      scope: {
        conceptoid: '=?',
        movimientos: '=?',
        editable: '@?',
        monto: '=?',
        validatemov: '=?'
      },
      templateUrl: 'views/directives/cuentas_contables/movimientos_contables.html',
      link: function(scope, element, attrs) {
        scope.showmovs = 'conceptoid' in attrs;
        if ('editable' in attrs) {
          attrs['editable'] = true;
        } else {
          attrs['editable'] = false;
        }
        console.log(attrs);
      },
      controller: function($scope) {
        var self = this;

        self.gridOptions = {
          showColumnFooter: true,
          enableCellEditOnFocus: true,
          rowHeight: 40,
          enableHorizontalScrollbar: 2,
          enableVerticalScrollbar: 2,
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
                return row.entity.CuentaContable.Nombre + ": \n" + row.entity.CuentaContable.Descripcion;
              },
              enableCellEdit: false,
              width: '25%'
            },
            {
              field: 'Debito',
              headerCellClass: 'text-info',
              cellTemplate: '<div ng-init="row.entity.Debito=0">{{row.entity.Debito}}</div>',
              width: '20%',
              enableCellEdit: true,
              cellEditableCondition: function() {
                return $scope.editable
              },
              type: 'number',
              aggregationType: uiGridConstants.aggregationTypes.sum
            },
            {
              field: 'Credito',
              width: '20%',
              headerCellClass: 'text-info',
              type: 'number',
              enableCellEdit: true,
              cellEditableCondition: function() {
                return $scope.editable
              },
              cellTemplate: '<div ng-init="row.entity.Credito=0">{{row.entity.Credito}}</div>',
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
        $scope.gridHeight = self.gridOptions.rowHeight * 2;

        self.cargar_cuentas = function() {
          if ($scope.conceptoid != undefined) {
            financieraRequest.get('concepto_cuenta_contable', $.param({
              query: "Concepto:" + $scope.conceptoid,
              limit: 0
            })).then(function(response) {
              if (response.data != null) {
                $scope.movimientos = response.data;
                self.gridOptions.data = $scope.movimientos;
                $scope.gridHeight = self.gridOptions.rowHeight * 2 + (self.gridOptions.data.length * self.gridOptions.rowHeight);
              } else {
                $scope.movimientos = [];
                self.gridOptions.data = $scope.movimientos;
                $scope.gridHeight = self.gridOptions.rowHeight * 2;
              }
            });
          } else {
            $scope.movimientos = [];
            self.gridOptions.data = $scope.movimientos;
          }
        };

        $scope.$watch('[d_movimientosContables.gridOptions.data,monto]', function() {
          if ($scope.monto == undefined) {
            $scope.monto = 0;
          }
          self.suma1 = 0;
          self.suma2 = 0;
          for (var i = 0; i < self.gridOptions.data.length; i++) {
            self.suma1 = self.suma1 + self.gridOptions.data[i].Debito;
            self.suma2 = self.suma2 + self.gridOptions.data[i].Credito;
          }
          if (self.suma1 == self.suma2) {
            if ($scope.monto != self.suma1) {
              console.log($scope.monto);
              $scope.validatemov = false;
            } else {
              $scope.validatemov = true;
            }
          } else {
            $scope.validatemov = false;
          }
        }, true);

        $scope.$watch('conceptoid', function() {
          self.cargar_cuentas();
        });
      },
      controllerAs: 'd_movimientosContables'
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:movimientosContables
 * @restrict E
 * @scope
 * @requires financieraService.service:financieraRequest
 * @requires uiGridConstants
 * @requires $translate
 * @requires $scope
 * @param {boolean} validatemov variable que confirma si la transaccion es correcta o no
 * @param {object|array} movimientos movimientos realizados sobre cada cuenta contable
 * @param {undefined} editable bandera de cualquier tipo para conocer si se requiere que la directiva permita edición
 * @param {int} monto monto dado sobre el concepto
 * @param {string|int} conceptoid Id del concepto a registrar movimientos
 * @description
 * # movimientosContables
 * Directiva en la cual se realiza la gestion de los movimientos contables producidos en una transacción referente a un concepto
 */

angular.module('financieraClienteApp')
  .directive('movimientosContables', function(financieraRequest, uiGridConstants, $translate) {
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
      },
      controller: function($scope) {
        var self = this;

        //grid para movimientos generales
        self.gridOptionsMovimientos = {
          showColumnFooter: true,
          enableCellEditOnFocus: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          enableRowHeaderSelection: false,
          enableFiltering: false,
          enableSorting: true,
          treeRowHeaderAlwaysVisible: false,
          showTreeExpandNoChildren: true,
          rowEditWaitInterval: -1,
          columnDefs: [{
              field: 'CuentaContable.Codigo',
              displayName: $translate.instant('CODIGO') + " " + $translate.instant('CUENTA'),
              cellClass: 'text-success',
              headerCellClass: 'text-info',
              cellClass: 'input_center',
              cellTooltip: function(row) {
                return row.entity.CuentaContable.NivelClasificacion.Nombre;
              },
              enableCellEdit: false,
              width: '20%'
            },
            {
              field: 'CuentaContable.Nombre',
              displayName: $translate.instant('NOMBRE') + " " + $translate.instant('CUENTA'),
              cellClass: 'text-success',
              headerCellClass: 'text-info',
              cellTooltip: function(row) {
                return row.entity.CuentaContable.Nombre + ": \n" + row.entity.CuentaContable.Descripcion;
              },
              enableCellEdit: false,
              width: '25%'
            },
            {
              field: 'Debito',
              displayName: $translate.instant('DEBITO'),
              cellClass: 'input_right',
              headerCellClass: 'text-info',
              cellTemplate: '<div ng-init="row.entity.Debito=0">{{row.entity.Debito | currency:undefined:0}}</div>',
              width: '20%',
              enableCellEdit: true,
              cellEditableCondition: function() {
                return $scope.editable;
              },
              type: 'number',
              cellFilter: 'number',
              aggregationType: uiGridConstants.aggregationTypes.sum,
              footerCellTemplate: '<div> Total {{col.getAggregationValue() | currency}}</div>',
              footerCellClass: 'input_right'
            },
            {
              field: 'Credito',
              displayName: $translate.instant('CREDITO'),
              cellClass: 'input_right',
              width: '20%',
              headerCellClass: 'text-info',
              type: 'number',
              cellFilter: 'number',
              enableCellEdit: true,
              cellEditableCondition: function() {
                return $scope.editable;
              },
              cellTemplate: '<div ng-init="row.entity.Credito=0">{{row.entity.Credito | currency:undefined:0}}</div>',
              aggregationType: uiGridConstants.aggregationTypes.sum,
              footerCellTemplate: '<div> Total {{col.getAggregationValue() | currency}}</div>',
              footerCellClass: 'input_right'
            },
            {
              field: 'CuentaContable.Naturaleza',
              displayName: $translate.instant('NATURALEZA'),
              headerCellClass: 'text-info',
              enableCellEdit: false,
              width: '15%'
            }
          ]
        };

        //grid para movimientos acreedores
        self.gridOptionsMovsAcreedores = {
          showColumnFooter: true,
          enableCellEditOnFocus: true,
          enableHorizontalScrollbar: 0,
          enableVerticalScrollbar: 0,
          enableRowHeaderSelection: false,
          enableFiltering: false,
          enableSorting: true,
          treeRowHeaderAlwaysVisible: false,
          showTreeExpandNoChildren: true,
          rowEditWaitInterval: -1,
          headerTemplate: '<div class="ui-grid-top-panel ui-grid-cell-contents ui-grid-header-cell-primary-focus text-info" style="text-align: center">Cuentas Acreedoras</div>',
          columnDefs: [{
              field: 'CuentaContable.Codigo',
              displayName: $translate.instant('CODIGO') + " " + $translate.instant('CUENTA'),
              cellClass: 'text-success',
              headerCellClass: 'text-info',
              cellTooltip: function(row) {
                return row.entity.CuentaContable.NivelClasificacion.Nombre;
              },
              enableCellEdit: false,
              width: '20%'
            },
            {
              field: 'CuentaContable.Nombre',
              displayName: $translate.instant('NOMBRE') + " " + $translate.instant('CUENTA'),
              cellClass: 'text-success',
              headerCellClass: 'text-info',
              cellTooltip: function(row) {
                return row.entity.CuentaContable.Nombre + ": \n" + row.entity.CuentaContable.Descripcion;
              },
              enableCellEdit: false,
              width: '25%'
            },
            {
              field: 'Debito',
              displayName: $translate.instant('DEBITO'),
              headerCellClass: 'text-info',
              cellTemplate: '<div ng-init="row.entity.Debito=0">{{row.entity.Debito | currency:undefined:0}}</div>',
              width: '20%',
              enableCellEdit: true,
              cellEditableCondition: function() {
                return $scope.editable;
              },
              type: 'number',
              cellFilter: 'number',
              aggregationType: uiGridConstants.aggregationTypes.sum
            },
            {
              field: 'Credito',
              displayName: $translate.instant('CREDITO'),
              width: '20%',
              headerCellClass: 'text-info',
              type: 'number',
              cellFilter: 'number',
              enableCellEdit: true,
              cellEditableCondition: function() {
                return $scope.editable;
              },
              cellTemplate: '<div ng-init="row.entity.Credito=0">{{row.entity.Credito | currency:undefined:0}}</div>',
              aggregationType: uiGridConstants.aggregationTypes.sum
            },
            {
              field: 'CuentaContable.Naturaleza',
              displayName: $translate.instant('NATURALEZA'),
              headerCellClass: 'text-info',
              enableCellEdit: false,
              width: '15%'
            }
          ]
        };

        /**
         * @ngdoc function
         * @name financieraClienteApp.directive:movimientosContables#cargar_cuentas
         * @methodOf financieraClienteApp.directive:movimientosContables
         * @description En base al conceptoid dado por el scope de la directiva se consume el servicio
         * {@link financieraService.service:financieraRequest financieraRequest}  para obtener las cuentas contables asociadas al concepto
         * y con estas manejar los movimientos que se vallan a realizar
         */
        self.cargar_cuentas = function() {
          if ($scope.conceptoid != undefined) {
            financieraRequest.get('concepto_cuenta_contable', $.param({
              query: "Concepto:" + $scope.conceptoid,
              limit: 0
            })).then(function(response) {
              if (response.data != null) {
                $scope.movimientos = response.data;
                for (var i = 0; i < $scope.movimientos.length; i++) {

                  if (!$scope.movimientos[i].CuentaAcreedora) {
                    self.gridOptionsMovimientos.data.push($scope.movimientos[i]);
                  } else {
                    self.gridOptionsMovsAcreedores.data.push($scope.movimientos[i]);
                  }
                }
                $scope.gridHeight = self.gridOptionsMovimientos.rowHeight * 2 + (self.gridOptionsMovimientos.data.length * self.gridOptionsMovimientos.rowHeight);
                $scope.grid2Height = self.gridOptionsMovsAcreedores.rowHeight * 2 + (self.gridOptionsMovsAcreedores.data.length * self.gridOptionsMovsAcreedores.rowHeight);
              } else {
                $scope.movimientos = [];
                self.gridOptionsMovimientos.data = $scope.movimientos;
                $scope.gridHeight = self.gridOptionsMovimientos.rowHeight * 2;
                $scope.grid2Height = self.gridOptionsMovsAcreedores.rowHeight * 2;
              }
            });
          } else {
            $scope.movimientos = [];
            self.gridOptionsMovimientos.data = $scope.movimientos;
          }
        };

        $scope.gridHeight = self.gridOptionsMovimientos.rowHeight * 2;

        /**
         * @ngdoc event
         * @name financieraClienteApp.directive:movimientosContables#watch_on_grids_data
         * @eventOf financieraClienteApp.directive:movimientosContables
         * @param {array} gridOptionsMovimientos variable que activa el evento
         * @param {array} gridOptionsMovsAcreedores variable que activa el evento
         * @description Si el data de alguno de los grids surge un cambio Se activa el evento que se encarga de realizar la validacion
         * por medio de la suma de los valores del principio de partida doble, y muestra un mensaje dependiendo si este se cumple o no con el cambio generado.
         */
        $scope.$watch('[d_movimientosContables.gridOptionsMovimientos.data,monto,d_movimientosContables.gridOptionsMovsAcreedores.data]', function() {
          if ($scope.monto == undefined) {
            $scope.monto = 0;
          }
          self.suma1 = 0;
          self.suma2 = 0;
          self.suma3 = 0;
          self.suma4 = 0;
          for (var i = 0; i < self.gridOptionsMovimientos.data.length; i++) {
            self.suma1 = self.suma1 + self.gridOptionsMovimientos.data[i].Debito;
            self.suma2 = self.suma2 + self.gridOptionsMovimientos.data[i].Credito;
          }
          if (self.gridOptionsMovsAcreedores.data.length > 0) {
            for (var j = 0; j < self.gridOptionsMovsAcreedores.data.length; j++) {
              self.suma3 = self.suma3 + self.gridOptionsMovsAcreedores.data[j].Debito;
              self.suma4 = self.suma4 + self.gridOptionsMovsAcreedores.data[j].Credito;
            }
          } else {
            self.suma3 = self.suma1;
            self.suma4 = self.suma3;
          }
          if (self.suma1 == self.suma2 && self.suma3 == self.suma4 && self.suma1 == self.suma4) {
            if ($scope.monto != self.suma1) {
              $scope.validatemov = false;
            } else {
              $scope.validatemov = true;
            }
          } else {
            $scope.validatemov = false;
          }
        }, true);

        /**
         * @ngdoc event
         * @name financieraClienteApp.directive:movimientosContables#watch_on_conceptoid
         * @eventOf financieraClienteApp.directive:movimientosContables
         * @param {string|int} conceptoid variable que activa el evento
         * @description Si la variable conceptoid cambia el evento se activa recargando las cuentas contables
         */
        $scope.$watch('conceptoid', function() {
          self.cargar_cuentas();
        }, true);
      },
      controllerAs: 'd_movimientosContables'
    };
  });
